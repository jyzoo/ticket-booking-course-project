# Спецификация API

Базовый URL backend: `http://127.0.0.1:8000`

## Аутентификация и профиль

| Метод | Endpoint | Назначение | Доступ |
|---|---|---|---|
| POST | `/api/auth/register/` | Регистрация пользователя | Все |
| POST | `/api/auth/login/` | Получение `access` и `refresh` токенов | Все |
| POST | `/api/auth/token/refresh/` | Обновление `access` токена | Все |
| GET | `/api/auth/profile/` | Просмотр профиля | Авторизованный |
| PATCH | `/api/auth/profile/` | Обновление профиля | Авторизованный |

## Категории

| Метод | Endpoint | Назначение | Доступ |
|---|---|---|---|
| GET | `/api/categories/` | Список категорий | Все |
| POST | `/api/categories/` | Создание категории | Администратор |
| GET | `/api/categories/{id}/` | Детали категории | Все |
| PUT/PATCH | `/api/categories/{id}/` | Изменение категории | Администратор |
| DELETE | `/api/categories/{id}/` | Удаление категории | Администратор |

## События

| Метод | Endpoint | Назначение | Доступ |
|---|---|---|---|
| GET | `/api/events/` | Список событий, пагинация, поиск | Все |
| POST | `/api/events/` | Создание события | Авторизованный |
| GET | `/api/events/{id}/` | Детальная карточка события | Все |
| PUT/PATCH | `/api/events/{id}/` | Изменение своего события | Автор или администратор |
| DELETE | `/api/events/{id}/` | Удаление своего события | Автор или администратор |

### Параметры списка событий

- `search` - поиск по `title`, `description`, `city`, `venue_name`
- `ordering` - сортировка по `event_date`, `price`, `created_at`

## Бронирования

| Метод | Endpoint | Назначение | Доступ |
|---|---|---|---|
| GET | `/api/bookings/` | Список своих бронирований | Авторизованный |
| POST | `/api/bookings/` | Создание бронирования | Авторизованный |
| GET | `/api/bookings/{id}/` | Получение бронирования | Владелец или администратор |
| PUT/PATCH | `/api/bookings/{id}/` | Обновление бронирования | Владелец или администратор |
| DELETE | `/api/bookings/{id}/` | Удаление бронирования | Владелец или администратор |

## Комментарии

| Метод | Endpoint | Назначение | Доступ |
|---|---|---|---|
| GET | `/api/comments/` | Список комментариев | Все |
| POST | `/api/comments/` | Добавление комментария | Авторизованный |
| GET | `/api/comments/{id}/` | Детали комментария | Все |
| PUT/PATCH | `/api/comments/{id}/` | Изменение комментария | Автор или администратор |
| DELETE | `/api/comments/{id}/` | Удаление комментария | Автор или администратор |

### Пример JWT-login

```json
POST /api/auth/login/
{
  "username": "organizer",
  "password": "organizer12345"
}
```

Ответ:

```json
{
  "access": "<jwt-access-token>",
  "refresh": "<jwt-refresh-token>"
}
```
