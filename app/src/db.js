const { Pool } = require('pg');

// Настройки подключения к базе данных
const pool = new Pool({
  user: 'your_db_user', // Имя пользователя базы данных
  host: 'localhost',    // Хост базы данных
  database: 'your_db_name', // Имя базы данных
  password: 'your_db_password', // Пароль к базе данных
  port: 5432,           // Порт подключения (обычно 5432)
});

// Экспортируем pool для использования в других файлах
module.exports = pool;
