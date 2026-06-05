# Схема JWT-аутентификации

```mermaid
sequenceDiagram
    participant U as Пользователь
    participant FE as React SPA
    participant API as Django REST API

    U->>FE: Ввод логина и пароля
    FE->>API: POST /api/auth/login/
    API-->>FE: access + refresh
    FE->>FE: Сохранение токенов в localStorage
    FE->>API: Запрос с Authorization: Bearer access
    API-->>FE: Данные ресурса

    Note over FE,API: access истёк
    FE->>API: POST /api/auth/token/refresh/ с refresh
    API-->>FE: Новый access (+ refresh при ротации)
    FE->>FE: Обновление localStorage
    FE->>API: Повтор исходного запроса
    API-->>FE: Успешный ответ
```

## Ключевые правила

- `access` используется для авторизации запросов
- `refresh` нужен для автоматического обновления `access`
- оба токена хранятся в `localStorage`
- если обновление не удалось, фронтенд очищает токены и завершает сессию
