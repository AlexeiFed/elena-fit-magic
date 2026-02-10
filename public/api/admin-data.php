<?php
/**
 * CRUD API для чтения/записи JSON-данных сайта elenafitmagic.ru.
 *
 * Эндпоинты:
 *   GET  ?type=testimonials|screenshots|services|site-content  — публичное чтение
 *   POST ?type=testimonials|screenshots|services|site-content  — запись (требует авторизации)
 *
 * При записи создаётся автобэкап предыдущей версии в data/backups/.
 * JSON-файлы хранятся в data/ и защищены .htaccess от прямого доступа.
 */

// === Сессия (для проверки авторизации при POST) ===
ini_set('session.cookie_httponly', 1);
ini_set('session.cookie_samesite', 'Strict');
ini_set('session.use_strict_mode', 1);
if (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on') {
    ini_set('session.cookie_secure', 1);
}
session_start();

header('Content-Type: application/json; charset=utf-8');

// === CORS ===
$allowedOrigins = [
    'https://elenafitmagic.ru',
    'http://localhost:5173',
    'http://localhost:4173',
];
$origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';

if (in_array($origin, $allowedOrigins, true)) {
    header('Access-Control-Allow-Origin: ' . $origin);
    header('Access-Control-Allow-Credentials: true');
}
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Vary: Origin');

// Preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// === Допустимые типы данных ===
$allowedTypes = ['testimonials', 'screenshots', 'services', 'site-content'];
$dataDir = __DIR__ . '/data';
$backupDir = $dataDir . '/backups';

// === Валидация параметра type ===
$type = isset($_GET['type']) ? $_GET['type'] : '';

if (!in_array($type, $allowedTypes, true)) {
    http_response_code(400);
    echo json_encode([
        'ok' => false,
        'error' => 'Invalid type. Allowed: ' . implode(', ', $allowedTypes),
    ]);
    exit;
}

$filePath = $dataDir . '/' . $type . '.json';

// === GET — публичное чтение ===
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (!file_exists($filePath)) {
        // Файл ещё не создан — возвращаем пустую структуру
        echo json_encode(getDefaultData($type));
        exit;
    }

    $content = file_get_contents($filePath);
    $data = json_decode($content, true);

    if ($data === null && json_last_error() !== JSON_ERROR_NONE) {
        http_response_code(500);
        echo json_encode(['ok' => false, 'error' => 'Corrupted JSON file']);
        exit;
    }

    echo json_encode($data);
    exit;
}

// === POST — запись (только для авторизованных) ===
if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    // Проверка авторизации
    if (empty($_SESSION['admin_authenticated'])) {
        http_response_code(401);
        echo json_encode(['ok' => false, 'error' => 'Unauthorized']);
        exit;
    }

    // Чтение тела запроса
    $rawInput = file_get_contents('php://input');
    $newData = json_decode($rawInput, true);

    if ($newData === null && json_last_error() !== JSON_ERROR_NONE) {
        http_response_code(400);
        echo json_encode([
            'ok' => false,
            'error' => 'Invalid JSON: ' . json_last_error_msg(),
        ]);
        exit;
    }

    // Валидация структуры данных
    $validationError = validateData($type, $newData);
    if ($validationError !== null) {
        http_response_code(400);
        echo json_encode(['ok' => false, 'error' => $validationError]);
        exit;
    }

    // Автобэкап текущей версии перед записью
    if (file_exists($filePath)) {
        if (!is_dir($backupDir)) {
            mkdir($backupDir, 0755, true);
        }
        $timestamp = date('Y-m-d_H-i-s');
        $backupPath = $backupDir . '/' . $type . '_' . $timestamp . '.json';
        copy($filePath, $backupPath);

        // Удаляем старые бэкапы (оставляем последние 20 для каждого типа)
        cleanupBackups($backupDir, $type, 20);
    }

    // Запись новых данных
    $jsonContent = json_encode($newData, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    $result = file_put_contents($filePath, $jsonContent, LOCK_EX);

    if ($result === false) {
        http_response_code(500);
        echo json_encode(['ok' => false, 'error' => 'Failed to write file']);
        exit;
    }

    echo json_encode(['ok' => true, 'message' => 'Data saved successfully']);
    exit;
}

// Другие методы не поддерживаются
http_response_code(405);
echo json_encode(['ok' => false, 'error' => 'Method not allowed']);
exit;


// =============================================
// Вспомогательные функции
// =============================================

/**
 * Возвращает дефолтную структуру для каждого типа данных.
 * Используется когда JSON-файл ещё не создан.
 */
function getDefaultData(string $type): array {
    switch ($type) {
        case 'testimonials':
            return [
                'textReviewsEnabled' => true,
                'screenshotsEnabled' => true,
                'items' => [],
            ];
        case 'screenshots':
            return ['items' => []];
        case 'services':
            return ['featuredId' => '', 'categories' => []];
        case 'site-content':
            return ['hero' => [], 'about' => [], 'process' => [], 'cta' => [], 'contacts' => []];
        default:
            return [];
    }
}

/**
 * Валидация структуры данных перед записью.
 * Возвращает строку с ошибкой или null если всё ок.
 */
function validateData(string $type, array $data): ?string {
    switch ($type) {
        case 'testimonials':
            if (!isset($data['items']) || !is_array($data['items'])) {
                return 'Missing or invalid "items" array';
            }
            if (!isset($data['textReviewsEnabled'])) {
                return 'Missing "textReviewsEnabled" flag';
            }
            if (!isset($data['screenshotsEnabled'])) {
                return 'Missing "screenshotsEnabled" flag';
            }
            // Валидация каждого отзыва
            foreach ($data['items'] as $i => $item) {
                if (empty($item['id'])) return "Item[$i]: missing id";
                if (empty($item['name'])) return "Item[$i]: missing name";
                if (empty($item['quote'])) return "Item[$i]: missing quote";
                if (empty($item['result'])) return "Item[$i]: missing result";
            }
            break;

        case 'screenshots':
            if (!isset($data['items']) || !is_array($data['items'])) {
                return 'Missing or invalid "items" array';
            }
            foreach ($data['items'] as $i => $item) {
                if (empty($item['id'])) return "Item[$i]: missing id";
                if (empty($item['src'])) return "Item[$i]: missing src";
            }
            break;

        case 'services':
            if (!isset($data['categories']) || !is_array($data['categories'])) {
                return 'Missing or invalid "categories" array';
            }
            break;

        case 'site-content':
            // Минимальная проверка — должен быть объект
            if (empty($data)) {
                return 'Data cannot be empty';
            }
            break;
    }

    return null;
}

/**
 * Удаляет старые бэкапы, оставляя последние $keep файлов для данного типа.
 */
function cleanupBackups(string $backupDir, string $type, int $keep): void {
    $pattern = $backupDir . '/' . $type . '_*.json';
    $files = glob($pattern);

    if ($files === false || count($files) <= $keep) {
        return;
    }

    // Сортируем по имени (содержит timestamp) — старые первыми
    sort($files);

    // Удаляем самые старые
    $toDelete = array_slice($files, 0, count($files) - $keep);
    foreach ($toDelete as $file) {
        unlink($file);
    }
}
