#!/usr/bin/env node

/**
 * Скрипт для автоматического деплоя на Timeweb через SFTP
 * Использование: node scripts/deploy-node.js
 * Требования: npm install --save-dev ssh2-sftp-client
 *
 * Переменные окружения (опционально): DEPLOY_HOST, DEPLOY_USER, DEPLOY_REMOTE_DIR, DEPLOY_PORT
 */

import { readFileSync, readdirSync, statSync, existsSync } from 'fs';
import { join, relative } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { homedir } from 'os';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env file into process.env
const envPath = join(__dirname, '..', '.env');
if (existsSync(envPath)) {
  const envContent = readFileSync(envPath, 'utf8');
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIndex = trimmed.indexOf('=');
    if (eqIndex === -1) continue;
    const key = trimmed.slice(0, eqIndex).trim();
    const value = trimmed.slice(eqIndex + 1).trim();
    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

// SEC-007: IP-адрес сервера не захардкожен — обязательно задать в .env
if (!process.env.DEPLOY_HOST) {
  console.error('❌ DEPLOY_HOST не задан в .env. Укажите IP-адрес или домен сервера.');
  process.exit(1);
}

const CONFIG = {
  host: process.env.DEPLOY_HOST,
  username: process.env.DEPLOY_USER || 'root',
  remoteDir: process.env.DEPLOY_REMOTE_DIR || '/var/www/elenafitmagic.ru',
  port: parseInt(process.env.DEPLOY_PORT || '22', 10),
};

// SEC-015: Предупреждение при деплое от root
if (CONFIG.username === 'root') {
  console.warn('⚠️  Деплой от имени root. Рекомендуется создать отдельного пользователя (DEPLOY_USER в .env).');
  console.warn('   См. инструкцию: doc/SECURITY_AUDIT.md → SEC-015');
}

// Функция для поиска SSH ключа
function findSSHKey() {
  const homeDir = homedir();
  const possibleKeys = [
    join(homeDir, '.ssh', 'id_ed25519'),
    join(homeDir, '.ssh', 'id_rsa'),
    join(homeDir, '.ssh', 'id_ecdsa'),
  ];

  for (const keyPath of possibleKeys) {
    if (existsSync(keyPath)) {
      return keyPath;
    }
  }
  
  throw new Error('SSH ключ не найден. Убедитесь, что у вас настроен SSH ключ в ~/.ssh/');
}

/** Удаляет содержимое удалённой директории (саму папку не трогает). */
async function clearRemoteDir(client, remotePath) {
  const list = await client.list(remotePath);
  for (const entry of list) {
    if (entry.name === '.' || entry.name === '..') continue;
    const fullPath = `${remotePath}/${entry.name}`;
    if (entry.type === 'd') {
      await client.rmdir(fullPath, true);
    } else {
      await client.delete(fullPath);
    }
  }
}

async function deploy() {
  const Client = (await import('ssh2-sftp-client')).default;
  let client = null;

  try {
    console.log('🔨 Сборка проекта...');
    execSync('npm run build', { stdio: 'inherit', cwd: join(__dirname, '..') });

    console.log('📦 Подготовка к загрузке...');
    console.log(`📡 Подключение к ${CONFIG.username}@${CONFIG.host}`);
    console.log(`📁 Удаленная директория: ${CONFIG.remoteDir}`);

    const keyPath = findSSHKey();
    console.log(`🔑 Используется SSH ключ: ${keyPath}`);
    const privateKey = readFileSync(keyPath, 'utf8');

    console.log('📤 Подключение к серверу...');
    client = new Client();
    await client.connect({
      host: CONFIG.host,
      username: CONFIG.username,
      privateKey: privateKey,
      port: CONFIG.port,
    });

    console.log('✅ Подключено.');

    try {
      await client.mkdir(CONFIG.remoteDir, true);
    } catch {
      // директория уже есть
    }

    // Сохраняем серверные данные перед очисткой (секреты + контент из админки)
    let savedEnvPhp = null;
    const remoteEnvPhpPath = `${CONFIG.remoteDir}/api/.env.php`;
    const savedJsonFiles = {};
    const jsonFilesToPreserve = ['testimonials.json', 'screenshots.json', 'services.json', 'site-content.json'];

    try {
      savedEnvPhp = await client.get(remoteEnvPhpPath);
      console.log('🔐 .env.php сохранён перед очисткой');
    } catch {
      // файла ещё нет — нормально
    }

    for (const jsonFile of jsonFilesToPreserve) {
      try {
        const remotePath = `${CONFIG.remoteDir}/api/data/${jsonFile}`;
        savedJsonFiles[jsonFile] = await client.get(remotePath);
        console.log(`📋 ${jsonFile} сохранён перед очисткой`);
      } catch {
        // файла нет — используем дефолт из билда
      }
    }

    console.log('�  Очистка старого содержимого на сервере...');
    await clearRemoteDir(client, CONFIG.remoteDir);

    const distPath = join(__dirname, '..', 'dist');
    console.log('📤 Загрузка файлов...');

    async function uploadDir(localPath, remotePath) {
      const items = readdirSync(localPath);
      for (const item of items) {
        const localItemPath = join(localPath, item);
        const remoteItemPath = `${remotePath}/${item}`;
        const stat = statSync(localItemPath);
        if (stat.isDirectory()) {
          await client.mkdir(remoteItemPath, true);
          await uploadDir(localItemPath, remoteItemPath);
        } else {
          console.log(`  📄 ${relative(distPath, localItemPath)}`);
          await client.put(localItemPath, remoteItemPath);
        }
      }
    }

    await uploadDir(distPath, CONFIG.remoteDir);

    // Восстановление / создание .env.php
    if (savedEnvPhp) {
      // Восстанавливаем сохранённый .env.php (с ручными правками, включая ADMIN_PASSWORD_HASH)
      console.log('🔐 Восстановление .env.php с сервера...');
      const envContent = typeof savedEnvPhp === 'string' ? savedEnvPhp : savedEnvPhp.toString('utf8');
      await client.put(Buffer.from(envContent, 'utf8'), remoteEnvPhpPath);
      console.log('  🔑 api/.env.php восстановлен');
    } else {
      // Первый деплой — создаём новый .env.php
      // SEC-008: Переменные без префикса VITE_ — не попадают в клиентский бандл
      const telegramToken = process.env.TELEGRAM_BOT_TOKEN || '';
      const telegramChatId = process.env.TELEGRAM_CHAT_ID || '';

      if (telegramToken && telegramChatId) {
        console.log('🔐 Создание серверной конфигурации...');
        const adminHash = process.env.ADMIN_PASSWORD_HASH || '$2y$10$REPLACE_WITH_REAL_BCRYPT_HASH';
        const envPhpContent = `<?php\ndefine('TELEGRAM_BOT_TOKEN', '${telegramToken}');\ndefine('TELEGRAM_CHAT_ID', '${telegramChatId}');\ndefine('ADMIN_PASSWORD_HASH', '${adminHash}');\n`;
        await client.put(Buffer.from(envPhpContent, 'utf8'), remoteEnvPhpPath);
        console.log('  🔑 api/.env.php создан на сервере');
      } else {
        console.warn('⚠️  TELEGRAM_BOT_TOKEN или TELEGRAM_CHAT_ID не заданы в .env — серверная конфигурация не создана.');
      }
    }

    // Восстанавливаем JSON-данные из админки (если были сохранены)
    for (const [jsonFile, content] of Object.entries(savedJsonFiles)) {
      if (content) {
        const remotePath = `${CONFIG.remoteDir}/api/data/${jsonFile}`;
        const buf = typeof content === 'string' ? Buffer.from(content, 'utf8') : content;
        await client.put(buf, remotePath);
        console.log(`  📋 ${jsonFile} восстановлен`);
      }
    }

    // Создаём директории и устанавливаем права для PHP-FPM (www-data)
    console.log('🔧 Установка прав для PHP-FPM...');
    const { Client: SSHClient } = await import('ssh2');
    await new Promise((resolve, reject) => {
      const ssh = new SSHClient();
      ssh.on('ready', () => {
        const cmds = [
          `mkdir -p ${CONFIG.remoteDir}/api/data/backups ${CONFIG.remoteDir}/uploads/screenshots`,
          `chown -R www-data:www-data ${CONFIG.remoteDir}/api/data ${CONFIG.remoteDir}/uploads`,
          `chmod -R 775 ${CONFIG.remoteDir}/api/data ${CONFIG.remoteDir}/uploads`,
        ].join(' && ');
        ssh.exec(cmds, (err, stream) => {
          if (err) { ssh.end(); return reject(err); }
          stream.on('close', () => { ssh.end(); resolve(); });
          stream.on('data', () => {});
          stream.stderr.on('data', () => {});
        });
      });
      ssh.on('error', reject);
      ssh.connect({
        host: CONFIG.host,
        username: CONFIG.username,
        privateKey: readFileSync(findSSHKey(), 'utf8'),
        port: CONFIG.port,
      });
    });
    console.log('  ✅ Права установлены');

    console.log('');
    console.log('✅ Деплой завершен успешно!');
    console.log('🌐 Откройте https://elenafitmagic.ru для проверки');
  } catch (error) {
    console.error('❌ Ошибка при деплое:', error.message);
    if (error.stack) console.error(error.stack);
    process.exit(1);
  } finally {
    if (client) {
      try {
        await client.end();
      } catch {
        // игнорируем при закрытии
      }
    }
  }
}

deploy();

