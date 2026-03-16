# Lemur

## Описание

Lemur - это веб-приложение для аналитики и управления данными, построенное с использованием FastAPI и PostgreSQL. Оно включает админ-панель, сбор событий и визуализацию метрик.

## Функциональность

- Авторизация администраторов
- Сбор и анализ событий (входы на сайт, устройства, геолокация)
- Веб-интерфейс для просмотра данных

## Установка

1. Клонируйте репозиторий:
   ```bash
   git clone <url>
   cd Lemur
   ```

2. Установите зависимости:
   ```bash
   cd server
   pip install -r requirements.txt
   ```

3. Настройте конфигурацию PostgreSQL в `config.json`:
   - `database.host`
   - `database.port`
   - `database.user`
   - `database.password`
   - `database.name`

4. Создайте базу данных и таблицы (из корня проекта):
   ```bash
   psql -U <db_user> -h <db_host> -p <db_port> -f db_setup.txt
   ```
   В `db_setup.txt` ожидается:
   - `CREATE DATABASE lemur_db;`
   - `\c lemur_db;`
   - создание таблиц `admins` и `events`

5. Убедитесь, что `config.json` содержит `database.name` = `lemur_db` (или другое имя базы из шага 4).

6. Настройка сайта:
   - Откройте файл `config.json` и внесите URL вашего сайта в раздел `site`.

7. Установка скрипта трекера на сайт:
   - Найдите файл `module/lemur-tracker.js`.
   - Добавьте его подключение на страницах вашего сайта через `<script src="Путь к lemur-tracker"></script>`.
   - Убедитесь, что в скрипте настроен адрес API сервера.

8. Запуск сервера:
   - Из корня `Lemur`:
   ```powershell
   .\launch.ps1
   ```
   - Или вручную из папки `server`:
   ```bash
   uvicorn main:app --reload
   ```

## Структура проекта

- `app/` - Основное веб-приложение
- `entrance/` - Страница входа
- `server/` - Серверная часть (FastAPI)

## Конфигурация

Настройки находятся в `config.json`:
- `uvicorn`: Конфигурация сервера
- `database`: Параметры подключения к PostgreSQL
- `site`: URL привязываемого сайта

## Запуск

Для запуска сервера используйте:
```
.\launch.ps1
```

## Лицензия

The MIT License (MIT)

Copyright © 2026 


Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the “Software”), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
