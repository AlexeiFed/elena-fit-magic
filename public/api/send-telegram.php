<?php
/**
 * Серверный прокси для отправки сообщений в Telegram.
 * Токен бота хранится ТОЛЬКО на сервере, не попадает в клиентский JS.
 *
 * Настройка: создайте файл /var/www/elenafitmagic.ru/api/.env.php с содержимым:
 * <?php
 * define('TELEGRAM_BOT_TOKEN', 'ваш_токен');
 * define('TELEGRAM_CHAT_ID', 'ваш_chat_id');
 */

header('Content-Type: application/json; charset=utf-8');

// SEC-004: CORS ограничен конкретным доменом вместо *
$allowedOrigin = 'https://elenafitmagic.ru';
$origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';

if ($origin === $allowedOrigin) {
    header('Access-Control-Allow-Origin: ' . $allowedOrigin);
} else {
    header('Access-Control-Allow-Origin: ' . $allowedOrigin);
}
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Vary: Origin');

// Handle preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// SEC-005: Проверка Origin/Referer — защита от CSRF
if ($origin !== '' && $origin !== $allowedOrigin) {
    http_response_code(403);
    echo json_encode(['ok' => false, 'error' => 'Forbidden origin']);
    exit;
}
$referer = isset($_SERVER['HTTP_REFERER']) ? $_SERVER['HTTP_REFERER'] : '';
if ($origin === '' && $referer !== '' && strpos($referer, 'https://elenafitmagic.ru') !== 0) {
    http_response_code(403);
    echo json_encode(['ok' => false, 'error' => 'Forbidden referer']);
    exit;
}

// Only POST allowed
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'Method not allowed']);
    exit;
}

// Load secrets from server-side config (NOT in web root's git-tracked files)
$envFile = __DIR__ . '/.env.php';
if (!file_exists($envFile)) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'Server configuration missing']);
    exit;
}
require_once $envFile;

if (!defined('TELEGRAM_BOT_TOKEN') || !defined('TELEGRAM_CHAT_ID')) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'Server configuration incomplete']);
    exit;
}

// Ограничение размера тела запроса (SEC-010)
if (isset($_SERVER['CONTENT_LENGTH']) && (int)$_SERVER['CONTENT_LENGTH'] > 8192) {
    http_response_code(413);
    echo json_encode(['ok' => false, 'error' => 'Payload too large']);
    exit;
}

// Parse request body — принимаем структурированные поля, а не готовый HTML (SEC-001, SEC-002, SEC-013)
$input = json_decode(file_get_contents('php://input'), true);
if (!$input) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Invalid JSON']);
    exit;
}

// SEC-012: Honeypot — если поле заполнено, это бот. Отвечаем 200 OK чтобы бот не понял
$honeypot = isset($input['website']) ? trim($input['website']) : '';
if ($honeypot !== '') {
    echo json_encode(['ok' => true]);
    exit;
}

// Валидация обязательных полей на сервере
$name = isset($input['name']) ? trim($input['name']) : '';
$phone = isset($input['phone']) ? trim($input['phone']) : '';
$message = isset($input['message']) ? trim($input['message']) : '';
$service = isset($input['service']) ? trim($input['service']) : '';
$contactMethods = isset($input['contactMethods']) && is_array($input['contactMethods']) ? $input['contactMethods'] : [];

if ($name === '' || mb_strlen($name) > 200) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Invalid name']);
    exit;
}

if ($phone === '' || !preg_match('/^\+?[\d\s\-()]{7,18}$/', $phone)) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Invalid phone']);
    exit;
}

if (empty($contactMethods)) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'At least one contact method required']);
    exit;
}

if (mb_strlen($message) > 2000) {
    $message = mb_substr($message, 0, 2000);
}
if (mb_strlen($service) > 200) {
    $service = mb_substr($service, 0, 200);
}

// Санитизация всех пользовательских данных — защита от HTML-инъекций (SEC-001)
$safeName = htmlspecialchars($name, ENT_QUOTES, 'UTF-8');
$safePhone = htmlspecialchars($phone, ENT_QUOTES, 'UTF-8');
$safeMessage = htmlspecialchars($message, ENT_QUOTES, 'UTF-8');
$safeService = $service !== '' ? htmlspecialchars($service, ENT_QUOTES, 'UTF-8') : 'Не указан';

// Санитизация контактных методов
$safeContacts = [];
$allowedMethods = ['whatsapp', 'telegram', 'max'];
foreach ($contactMethods as $cm) {
    if (!is_array($cm) || !isset($cm['type']) || !in_array($cm['type'], $allowedMethods, true)) {
        continue;
    }
    $type = $cm['type'];
    $value = isset($cm['value']) ? htmlspecialchars(trim($cm['value']), ENT_QUOTES, 'UTF-8') : '';
    if ($type === 'whatsapp') {
        $safeContacts[] = 'WhatsApp';
    } elseif ($type === 'telegram') {
        $safeContacts[] = 'Telegram: @' . $value;
    } elseif ($type === 'max') {
        $safeContacts[] = 'Max: ' . $value;
    }
}

// SEC-003: Усиленный rate limiting — 30с между запросами + 10 запросов/час
$ip = $_SERVER['REMOTE_ADDR'];
$ipHash = md5($ip);
$rateLimitFile = sys_get_temp_dir() . '/telegram_rate_' . $ipHash;
$rateLimitHourFile = sys_get_temp_dir() . '/telegram_hour_' . $ipHash;

// Проверка интервала между запросами (30 секунд)
if (file_exists($rateLimitFile)) {
    $lastRequest = (int)file_get_contents($rateLimitFile);
    $elapsed = time() - $lastRequest;
    if ($elapsed < 30) {
        http_response_code(429);
        echo json_encode(['ok' => false, 'error' => 'Too many requests. Please wait ' . (30 - $elapsed) . ' seconds.']);
        exit;
    }
}

// Проверка лимита запросов в час (максимум 10)
$hourlyData = [];
if (file_exists($rateLimitHourFile)) {
    $hourlyData = json_decode(file_get_contents($rateLimitHourFile), true) ?: [];
    // Удаляем записи старше 1 часа
    $hourlyData = array_values(array_filter($hourlyData, function($ts) {
        return (time() - $ts) < 3600;
    }));
    if (count($hourlyData) >= 10) {
        http_response_code(429);
        echo json_encode(['ok' => false, 'error' => 'Hourly request limit reached. Try again later.']);
        exit;
    }
}

// Записываем текущий запрос
file_put_contents($rateLimitFile, time());
$hourlyData[] = time();
file_put_contents($rateLimitHourFile, json_encode($hourlyData));

// Сборка Telegram-сообщения на стороне сервера (SEC-013)
$text = "🏋️ <b>Новая заявка с сайта</b>\n\n";
$text .= "<b>Формат:</b> {$safeService}\n\n";
$text .= "<b>Имя:</b> {$safeName}\n";
$text .= "<b>Телефон:</b> {$safePhone}\n";
$text .= "<b>Способ связи:</b> " . implode(', ', $safeContacts) . "\n";
if ($safeMessage !== '') {
    $text .= "<b>Сообщение:</b> {$safeMessage}\n";
}

// Send to Telegram
$url = 'https://api.telegram.org/bot' . TELEGRAM_BOT_TOKEN . '/sendMessage';
$payload = json_encode([
    'chat_id' => TELEGRAM_CHAT_ID,
    'text' => $text,
    'parse_mode' => 'HTML',
]);

$ch = curl_init($url);
curl_setopt_array($ch, [
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => $payload,
    CURLOPT_HTTPHEADER => ['Content-Type: application/json'],
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_TIMEOUT => 10,
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curlError = curl_error($ch);
curl_close($ch);

if ($curlError) {
    http_response_code(502);
    echo json_encode(['ok' => false, 'error' => 'Failed to connect to Telegram']);
    exit;
}

if ($httpCode !== 200) {
    http_response_code(502);
    echo json_encode(['ok' => false, 'error' => 'Telegram API error']);
    exit;
}

echo json_encode(['ok' => true]);
