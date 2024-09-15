// routes/userRoutes.js
const express = require('express');
const db = require('../knex');
const router = express.Router();
const bcrypt = require('bcrypt');

const saltRounds = 10; // Количество раундов соли для bcrypt


// Получение всех пользователей
router.get('/users', async (req, res) => {
  try {
    const users = await db('Users').select('*');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Создание нового пользователя
router.post('/users', async (req, res) => {
  const { email, password, name, birthdate, gender, bio, location, subscription_id } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    // Генерация хэша пароля
    const password_hash = await bcrypt.hash(password, saltRounds);

    // Вставка нового пользователя в базу данных
    const [user_id] = await db('Users').insert({
      email,
      password_hash,
      name,
      birthdate,
      gender,
      bio,
      location,
      subscription_id
    }).returning('user_id');
    console.log(user_id);
    res.status(201).json({ user_id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Проверка аутентификации пользователя[not public]
router.post('/users/login', async (req, res) => {
    const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    // Поиск пользователя по email
    const user = await db('Users').where({ email }).first();

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Сравнение пароля с хэшем
    const match = await bcrypt.compare(password, user.password_hash);

    if (match) {
      res.status(200).json(user);
    } else {
      res.status(401).json({ error: 'Invalid email or password' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
module.exports = router;
