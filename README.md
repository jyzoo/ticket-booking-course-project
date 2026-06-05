# TicketFlow

Курсовой проект по теме: **"Разработка веб-приложения для бронирования билетов"**.

Стек проекта соответствует траектории Б из методических указаний:

- backend: `Django + Django REST Framework`
- frontend: `React SPA + React Router + Axios`
- аутентификация: `JWT access + refresh`
- хранение токенов: `localStorage` с автоматическим обновлением `access`
- без Docker

## Структура

- [backend](/D:/kursovaya2kurs/backend) - REST API, JWT, роли доступа, admin-панель
- [frontend](/D:/kursovaya2kurs/frontend) - клиентское SPA-приложение
- [docs](/D:/kursovaya2kurs/docs) - архитектура, API, JWT, БД

## Роли доступа

- `Гость` - просмотр списка событий, деталей, категорий и комментариев
- `Авторизованный пользователь` - профиль, комментарии, бронирования, управление своими событиями
- `Администратор` - полный доступ к категориям, всем событиям и стандартной Django admin panel

## Запуск backend

```bash
cd backend
python manage.py migrate
python manage.py seed_demo
python manage.py runserver
```

API будет доступен по адресу `http://127.0.0.1:8000/`.

Демо-учётные записи после `seed_demo`:

- `admin / admin12345`
- `organizer / organizer12345`

## Запуск frontend

```bash
cd frontend
npm install
npm run dev
```

SPA будет доступно по адресу `http://127.0.0.1:5173/`.

## Основные возможности

- регистрация и вход по JWT
- автоматическое обновление access-токена через refresh-токен
- список событий, поиск и фильтрация по категориям
- просмотр карточки события
- бронирование билетов
- комментарии к событиям
- управление своими событиями
- управление категориями для администратора

## Документация

- [Компонентная архитектура](/D:/kursovaya2kurs/docs/architecture.md)
- [Спецификация API](/D:/kursovaya2kurs/docs/api-spec.md)
- [Схема JWT](/D:/kursovaya2kurs/docs/jwt-flow.md)
- [Проектирование БД](/D:/kursovaya2kurs/docs/database-design.md)
