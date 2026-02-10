<?php
/**
 * Загрузка изображений для админ-панели elenafitmagic.ru.
 *
 * Эндпоинты:
 *   POST (multipart/form-data)  — загрузка изображения (требует авторизации)
 *     - file: файл изображения (JPEG/PNG/WebP, макс. 5 МБ)
 *     - type: тип загрузки (screenshots)
 *   DELETE ?file=filename.jpg   — удаление изображения (требует авторизации)
 *   GET ?list=1                 — список загруженных файлов (требует авторизации)
 *
 * Файлы сохраняются в /uploads/screenshots/ с уникальными именами.
 */

// === Сессия ===
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
header('Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Vary: Origin');

// Preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// === Все операции требуют авторизации ===
if (empty($_SESSION['admin_authenticated'])) {
    http_response_code(401);
    echo json_encode(['ok' => false, 'error' => 'Unauthorized']);
    exit;
}

// === Конфигурация ===
$uploadBaseDir = dirname(__DIR__) . '/uploads';
$allowedTypes = [
    'screenshots' => [
        'dir' => $uploadBaseDir . '/screenshots',
        'urlPrefix' => '/uploads/screenshots',
    ],
];

// Допустимые MIME-типы и расширения
$allowedMimes = [
    'image/jpeg' => 'jpg',
    'image/png' => 'png',
    'image/webp' => 'webp',
];
$maxFileSize = 5 * 1024 * 1024; // 5 МБ

// === GET — список файлов ===
if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['list'])) {
    $type = isset($_GET['type']) ? $_GET['type'] : 'screenshots';

    if (!isset($allowedTypes[$type])) {
        http_response_code(400);
        echo json_encode(['ok' => false, 'error' => 'Invalid type']);
        exit;
    }

    $dir = $allowedTypes[$type]['dir'];
    $urlPrefix = $allowedTypes[$type]['urlPrefix'];
    $files = [];

    if (is_dir($dir)) {
        $entries = scandir($dir);
        foreach ($entries as $entry) {
            if ($entry === '.' || $entry === '..') continue;
            $filePath = $dir . '/' . $entry;
            if (is_file($filePath)) {
                $files[] = [
                    'name' => $entry,
                    'url' => $urlPrefix . '/' . $entry,
                    'size' => filesize($filePath),
                    'modified' => filemtime($filePath),
                ];
            }
        }
        // Сортировка по дате модификации (новые первыми)
        usort($files, function ($a, $b) {
            return $b['modified'] - $a['modified'];
        });
    }

    echo json_encode(['ok' => true, 'files' => $files]);
    exit;
}

// === POST — загрузка файла ===
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $type = isset($_POST['type']) ? $_POST['type'] : 'screenshots';

    if (!isset($allowedTypes[$type])) {
        http_response_code(400);
        echo json_encode(['ok' => false, 'error' => 'Invalid upload type']);
        exit;
    }

    // Проверка наличия файла
    if (!isset($_FILES['file']) || $_FILES['file']['error'] !== UPLOAD_ERR_OK) {
        $errorCode = isset($_FILES['file']) ? $_FILES['file']['error'] : -1;
        http_response_code(400);
        echo json_encode([
            'ok' => false,
            'error' => 'File upload failed (code: ' . $errorCode . ')',
        ]);
        exit;
    }

    $file = $_FILES['file'];

    // Проверка размера
    if ($file['size'] > $maxFileSize) {
        http_response_code(400);
        echo json_encode([
            'ok' => false,
            'error' => 'File too large. Maximum: ' . ($maxFileSize / 1024 / 1024) . ' MB',
        ]);
        exit;
    }

    // Проверка MIME-типа (через finfo, не доверяем $_FILES['type'])
    $finfo = finfo_open(FILEINFO_MIME_TYPE);
    $mime = finfo_file($finfo, $file['tmp_name']);
    finfo_close($finfo);

    if (!isset($allowedMimes[$mime])) {
        http_response_code(400);
        echo json_encode([
            'ok' => false,
            'error' => 'Invalid file type: ' . $mime . '. Allowed: JPEG, PNG, WebP',
        ]);
        exit;
    }

    $ext = $allowedMimes[$mime];
    $targetDir = $allowedTypes[$type]['dir'];
    $urlPrefix = $allowedTypes[$type]['urlPrefix'];

    // Создаём директорию если не существует
    if (!is_dir($targetDir)) {
        mkdir($targetDir, 0755, true);
    }

    // Генерация уникального имени файла (timestamp + random)
    $uniqueName = date('Ymd_His') . '_' . bin2hex(random_bytes(4)) . '.' . $ext;
    $targetPath = $targetDir . '/' . $uniqueName;

    // Перемещение загруженного файла
    if (!move_uploaded_file($file['tmp_name'], $targetPath)) {
        http_response_code(500);
        echo json_encode(['ok' => false, 'error' => 'Failed to save file']);
        exit;
    }

    // Устанавливаем права
    chmod($targetPath, 0644);

    echo json_encode([
        'ok' => true,
        'file' => [
            'name' => $uniqueName,
            'url' => $urlPrefix . '/' . $uniqueName,
            'size' => filesize($targetPath),
        ],
    ]);
    exit;
}

// === DELETE — удаление файла ===
if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $fileName = isset($_GET['file']) ? $_GET['file'] : '';
    $type = isset($_GET['type']) ? $_GET['type'] : 'screenshots';

    if (!isset($allowedTypes[$type])) {
        http_response_code(400);
        echo json_encode(['ok' => false, 'error' => 'Invalid type']);
        exit;
    }

    if (empty($fileName)) {
        http_response_code(400);
        echo json_encode(['ok' => false, 'error' => 'File name required']);
        exit;
    }

    // Санитизация имени файла — только буквы, цифры, точки, дефисы, подчёркивания
    $sanitized = preg_replace('/[^a-zA-Z0-9._-]/', '', $fileName);
    if ($sanitized !== $fileName || strpos($fileName, '..') !== false) {
        http_response_code(400);
        echo json_encode(['ok' => false, 'error' => 'Invalid file name']);
        exit;
    }

    $targetDir = $allowedTypes[$type]['dir'];
    $filePath = $targetDir . '/' . $sanitized;

    if (!file_exists($filePath)) {
        http_response_code(404);
        echo json_encode(['ok' => false, 'error' => 'File not found']);
        exit;
    }

    if (!unlink($filePath)) {
        http_response_code(500);
        echo json_encode(['ok' => false, 'error' => 'Failed to delete file']);
        exit;
    }

    echo json_encode(['ok' => true, 'message' => 'File deleted']);
    exit;
}

// Другие методы
http_response_code(405);
echo json_encode(['ok' => false, 'error' => 'Method not allowed']);
exit;
