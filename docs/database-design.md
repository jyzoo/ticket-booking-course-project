# Проектирование БД

## Основные сущности

### `users_user`

| Поле | Тип | Описание |
|---|---|---|
| id | BigAutoField | Первичный ключ |
| username | CharField | Логин пользователя |
| email | EmailField | Email |
| password | CharField | Хэш пароля |
| first_name | CharField | Имя |
| last_name | CharField | Фамилия |
| phone | CharField | Телефон |
| bio | TextField | Краткая информация |
| avatar_url | URLField | URL аватара |
| is_staff | BooleanField | Признак администратора |

### `users_profile`

| Поле | Тип | Описание |
|---|---|---|
| id | BigAutoField | Первичный ключ |
| user_id | OneToOne | Связь с пользователем |
| city | CharField | Город |
| preferred_event_type | CharField | Любимый тип события |
| notification_email | EmailField | Email для уведомлений |
| about | TextField | Дополнительная информация |

### `tickets_event_category`

| Поле | Тип | Описание |
|---|---|---|
| id | BigAutoField | Первичный ключ |
| name | CharField | Название категории |
| description | TextField | Описание |
| icon | CharField | Иконка |
| color | CharField | Цвет |
| age_limit | PositiveIntegerField | Возрастное ограничение |

### `tickets_event`

| Поле | Тип | Описание |
|---|---|---|
| id | BigAutoField | Первичный ключ |
| category_id | ForeignKey | Категория |
| author_id | ForeignKey | Автор события |
| title | CharField | Название события |
| slug | SlugField | URL-идентификатор |
| description | TextField | Описание |
| event_date | DateTimeField | Дата и время |
| city | CharField | Город |
| venue_name | CharField | Название площадки |
| venue_address | CharField | Адрес площадки |
| organizer_name | CharField | Организатор |
| total_tickets | PositiveIntegerField | Общее число билетов |
| available_tickets | PositiveIntegerField | Доступные билеты |
| price | DecimalField | Цена |
| image_url | URLField | Изображение |
| status | CharField | Статус |

### `tickets_booking`

| Поле | Тип | Описание |
|---|---|---|
| id | BigAutoField | Первичный ключ |
| event_id | ForeignKey | Событие |
| user_id | ForeignKey | Покупатель |
| ticket_quantity | PositiveIntegerField | Количество билетов |
| total_price | DecimalField | Итоговая сумма |
| contact_phone | CharField | Контактный телефон |
| attendee_name | CharField | Имя посетителя |
| status | CharField | Статус брони |
| booked_at | DateTimeField | Дата бронирования |

### `tickets_comment`

| Поле | Тип | Описание |
|---|---|---|
| id | BigAutoField | Первичный ключ |
| event_id | ForeignKey | Событие |
| author_id | ForeignKey | Автор комментария |
| text | TextField | Текст |
| rating | PositiveIntegerField | Оценка |
| created_at | DateTimeField | Дата создания |
| updated_at | DateTimeField | Дата обновления |

## Особенность схемы

БД спроектирована **без нормализации**, как было отдельно указано в требованиях пользователя:

- информация о площадке хранится прямо в `Event`
- информация об организаторе хранится прямо в `Event`
- это упрощает демонстрационную реализацию и уменьшает число таблиц предметной области
