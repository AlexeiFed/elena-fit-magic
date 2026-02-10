<?php
/**
 * Авторизация админ-панели elenafitmagic.ru.
 * Поддерживает login, logout, check через PHP session + bcrypt.
 *
 * Эндпоинты:
 *   GET  ?action=check   — проверка текущей сессии
 *   POST ?action=login    — вход (body: { "password": "..." })
 *   POST ?action=logout   — выход
 *
 * Пароль хранится как bcrypt-хеш в .env.php: ADMIN_PASSWORD_HASH
 */

// === Настройки сессии (безопасные cookie) ===
ini_set('session.cookie_httponly', 1);
ini_set('session.cookie_samesite', 'Strict');
ini_set('session.use_strict_mode', 1);
// secure cookie только на продакшене (HTTPS)
if (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on') {
    ini_set('session.cookie_secure', 1);
}
session_start();

header('Content-Type: application/json; charset=utf-8');

// === CORS — ограничен доменом ===
$allowedOrigins = [
    'https://elenafitmagic.ru',
    'http://localhost:5173',      // dev-сервер Vite
    'http://localhost:4173',      // preview Vite
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

// === Загрузка конфигурации ===
$envFile = __DIR__ . '/.env.php';
if (!file_exists($envFile)) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'Server configuration missing']);
    exit;
}
require_once $envFile;

// Проверяем наличие хеша пароля в конфигурации
if (!defined('ADMIN_PASSWORD_HASH')) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'Admin password not configured']);
    exit;
}

// === Rate limiting для login (файловый, простой) ===
$rateLimitFile = __DIR__ . '/data/backups/.rate_limit.json';
$rateLimitWindow = 900; // 15 минут
$rateLimitMax = 5;      // максимум попыток

/**
 * Проверяет rate limit по IP.
 * @return bool true если лимит превышен
 */
function isRateLimited(): bool {
    global $rateLimitFile, $rateLimitWindow, $rateLimitMax;

    $ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
    $now = time();
    $data = [];

    if (file_exists($rateLimitFile)) {
        $raw = file_get_contents($rateLimitFile);
        $data = json_decode($raw, true) ?: [];
    }

    // Очистка старых записей
    if (isset($data[$ip])) {
        $data[$ip] = array_filter($data[$ip], function ($ts) use ($now, $rateLimitWindow) {
            return ($now - $ts) < $rateLimitWindow;
        });
    }

    $attempts = isset($data[$ip]) ? count($data[$ip]) : 0;
    return $attempts >= $rateLimitMax;
}

/**
 * Записывает попытку входа для rate limiting.
 */
function recordLoginAttempt(): void {
    global $rateLimitFile, $rateLimitWindow;

    $ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
    $now = time();
    $data = [];

    if (file_exists($rateLimitFile)) {
        $raw = file_get_contents($rateLimitFile);
        $data = json_decode($raw, true) ?: [];
    }

    // Очистка старых записей для этого IP
    if (isset($data[$ip])) {
        $data[$ip] = array_filter($data[$ip], function ($ts) use ($now, $rateLimitWindow) {
            return ($now - $ts) < $rateLimitWindow;
        });
    }

    $data[$ip][] = $now;
    file_put_contents($rateLimitFile, json_encode($data), LOCK_EX);
}

/**
 * Сбрасывает rate limit для IP после успешного входа.
 */
function clearRateLimit(): void {
    global $rateLimitFile;

    $ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';

    if (!file_exists($rateLimitFile)) return;

    $raw = file_get_contents($rateLimitFile);
    $data = json_decode($raw, true) ?: [];
    unset($data[$ip]);
    file_put_contents($rateLimitFile, json_encode($data), LOCK_EX);
}

// === Роутинг по action ===
$action = isset($_GET['action']) ? $_GET['action'] : '';

switch ($action) {

    // --- Проверка авторизации ---
    case 'check':
        if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
            http_response_code(405);
            echo json_encode(['ok' => false, 'error' => 'Method not allowed']);
            exit;
        }
        $authenticated = !empty($_SESSION['admin_authenticated']);
        echo json_encode([
            'ok' => true,
            'authenticated' => $authenticated,
        ]);
        break;

    // --- Вход ---
    case 'login':
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            http_response_code(405);
            echo json_encode(['ok' => false, 'error' => 'Method not allowed']);
            exit;
        }

        // Rate limit
        if (isRateLimited()) {
            http_response_code(429);
            echo json_encode(['ok' => false, 'error' => 'Too many attempts. Try again in 15 minutes.']);
            exit;
        }

        // Чтение тела запроса
        $input = json_decode(file_get_contents('php://input'), true);
        $password = isset($input['password']) ? $input['password'] : '';

        if (empty($password)) {
            http_response_code(400);
            echo json_encode(['ok' => false, 'error' => 'Password required']);
            exit;
        }

        // Проверка пароля через bcrypt
        if (password_verify($password, ADMIN_PASSWORD_HASH)) {
            // Регенерация ID сессии для защиты от session fixation
            session_regenerate_id(true);
            $_SESSION['admin_authenticated'] = true;
            $_SESSION['admin_login_time'] = time();
            clearRateLimit();

            echo json_encode(['ok' => true, 'authenticated' => true]);
        } else {
            recordLoginAttempt();
            http_response_code(401);
            echo json_encode(['ok' => false, 'error' => 'Invalid password']);
        }
        break;

    // --- Выход ---
    case 'logout':
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            http_response_code(405);
            echo json_encode(['ok' => false, 'error' => 'Method not allowed']);
            exit;
        }

        $_SESSION = [];
        session_destroy();
        echo json_encode(['ok' => true, 'authenticated' => false]);
        break;

    default:
        http_response_code(400);
        echo json_encode(['ok' => false, 'error' => 'Invalid action. Use: check, login, logout']);
        break;
}
