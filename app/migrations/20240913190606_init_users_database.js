/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema
      // Создание таблицы пользователей
      .createTable('Users', function(table) {
        table.increments('user_id').primary(); // автоинкрементный первичный ключ
        table.string('email').unique().notNullable(); // уникальный и не нулевой
        table.text('password_hash').notNullable(); // хэш пароля, не может быть нулевым
        table.string('name', 100); // имя пользователя, до 100 символов
        table.date('birthdate'); // дата рождения
        table.string('gender', 10); // пол
        table.text('bio'); // биография
        table.specificType('location', 'point'); // географическое местоположение
        table.integer('subscription_id');
        table.timestamp('created_at').defaultTo(knex.fn.now()); // дата создания
        table.timestamp('updated_at').defaultTo(knex.fn.now()); // дата последнего обновления
      })
      // Создание таблицы предпочтений пользователей
      .createTable('UserPreferences', function(table) {
        table.increments('preference_id').primary(); // автоинкрементный первичный ключ
        table.integer('user_id').references('user_id').inTable('Users'); // внешний ключ на таблицу Users
        table.string('preferred_gender', 10); // предпочитаемый пол
        table.specificType('preferred_age_range', 'integer[]'); // предпочитаемый диапазон возраста (массив целых чисел)
        table.integer('preferred_location_radius'); // радиус предпочтительного местоположения
        table.timestamp('updated_at').defaultTo(knex.fn.now()); // дата последнего обновления
      })
      // Создание таблицы фотографий пользователей
      .createTable('UserPhotos', function(table) {
        table.increments('photo_id').primary(); // автоинкрементный первичный ключ
        table.integer('user_id').references('user_id').inTable('Users'); // внешний ключ на таблицу Users
        table.text('photo_url').notNullable(); // URL фотографии
        table.boolean('is_primary'); // основное фото
      })
      // Создание таблицы свайпов
      .createTable('Swipes', function(table) {
        table.increments('swipe_id').primary(); // автоинкрементный первичный ключ
        table.integer('swiper_id').references('user_id').inTable('Users'); // внешний ключ на таблицу Users
        table.integer('target_id').references('user_id').inTable('Users'); // внешний ключ на таблицу Users
        table.boolean('is_like'); // лайк или дизлайк
        table.timestamp('swiped_at').defaultTo(knex.fn.now()); // дата свайпа
      })
      // Создание таблицы матчей
      .createTable('Matches', function(table) {
        table.increments('match_id').primary(); // автоинкрементный первичный ключ
        table.integer('user1_id').references('user_id').inTable('Users'); // первый пользователь
        table.integer('user2_id').references('user_id').inTable('Users'); // второй пользователь
        table.timestamp('matched_at').defaultTo(knex.fn.now()); // дата матча
        table.boolean('is_active').defaultTo(true); // активен ли матч
      })
      // Создание таблицы жалоб
      .createTable('Reports', function(table) {
        table.increments('report_id').primary(); // автоинкрементный первичный ключ
        table.integer('reporter_id').references('user_id').inTable('Users'); // внешний ключ на таблицу Users
        table.integer('reported_id').references('user_id').inTable('Users'); // внешний ключ на таблицу Users
        table.text('reason'); // причина жалобы
        table.timestamp('created_at').defaultTo(knex.fn.now()); // дата создания жалобы
      });
  };
  
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
return knex.schema
    .dropTableIfExists('Reports') // удаление таблицы жалоб
    .dropTableIfExists('Matches') // удаление таблицы матчей
    .dropTableIfExists('Swipes') // удаление таблицы свайпов
    .dropTableIfExists('UserPhotos') // удаление таблицы фотографий пользователей
    .dropTableIfExists('UserPreferences') // удаление таблицы предпочтений пользователей
    .dropTableIfExists('Users'); // удаление таблицы пользователей
};
  