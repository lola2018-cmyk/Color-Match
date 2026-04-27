# Color Match - Project Summary

## 🎨 Проект: Соревновательный Color Match

**Веб-приложение для психофизиологического тренажера на основе эффекта Струпа (интерференция между чтением слова и восприятием цвета)**

---

## ✨ Основные возможности

### Игровой процесс
- 🎯 **Stroop Effect Test** - определите цвет чернил, а не значение слова
- 👥 **Многопользовательский режим** - играйте против 1-3 других игроков
- ⚡ **Реал-тайм синхронизация** - все видят одну карточку одновременно
- 📊 **Система штрафов** - неправильный ответ создает визуальные помехи для других
- 🏆 **Система очков** - заработайте бонусы за скорость и точность

### Уровни сложности
- 🟢 **Easy** - 3 цвета, 10 очков за карточку, 5 сек на ответ
- 🟡 **Medium** - 5 цветов, 20 очков за карточку, 4 сек на ответ  
- 🔴 **Hard** - 6 цветов, 30 очков за карточку, 3 сек на ответ

### Социальные функции
- 🎮 **Лидерборд** - глобальный рейтинг игроков
- 📈 **Статистика** - детальные показатели вашей игры
- ⭐ **Рейтинговая система** - Elo-подобный расчет рейтинга

---

## 🛠 Технологический стек

### Frontend
```
React 19.2 + Next.js 16 (App Router)
TypeScript | Tailwind CSS
Socket.IO Client | tRPC
React Hook Form | TanStack Query
```

### Backend
```
Next.js API Routes
tRPC (Type-safe API)
Socket.IO (WebSocket)
Drizzle ORM + PostgreSQL
Better-auth (готово к интеграции)
```

### Testing & Tools
```
Vitest (Unit tests)
TypeScript strict mode
ESLint
Zod (validation)
```

---

## 📁 Структура проекта

```
color-match/
├── src/
│   ├── app/                    # Next.js страницы и API
│   ├── components/             # React компоненты
│   ├── server/
│   │   ├── db/                # Database schema & migrations
│   │   ├── trpc/              # tRPC процедуры
│   │   └── services/          # Business logic
│   ├── hooks/                 # Custom React hooks
│   ├── lib/                   # Утилиты и конфигурации
│   └── types/                 # TypeScript типы
├── tests/                     # Unit тесты
├── README.md                  # Основная документация
├── DEPLOYMENT.md              # Инструкции по развертыванию
├── REQUIREMENTS.md            # Соответствие требованиям
└── package.json               # Dependencies
```

---

## 🚀 Быстрый старт

### 1. Установка
```bash
# Клонировать репозиторий
git clone <repo-url>
cd color-match

# Установить зависимости
npm install
```

### 2. Настройка БД
```bash
# Создать PostgreSQL БД
createdb color_match

# Конфигурировать .env.local
DATABASE_URL=postgresql://user:password@localhost:5432/color_match
NEXT_PUBLIC_API_URL=http://localhost:3000

# Развернуть схему
npm run db:push
```

### 3. Запуск
```bash
# Development сервер
npm run dev

# Открыть в браузере
http://localhost:3000
```

### 4. Тестирование
```bash
npm run test       # Запустить тесты
npm run test:ui    # Тесты с интерфейсом
npm run lint       # Проверка кода
```

---

## 📊 Система подсчета очков

### Базовые очки за сложность
| Сложность | Базовые очки |
|-----------|-------------|
| Easy      | 10          |
| Medium    | 20          |
| Hard      | 30          |

### Бонус за скорость
```
Speed Bonus = (Remaining Time / Total Time) × Base Points
```

### Множитель за порядок ответа
| Порядок | Множитель |
|---------|-----------|
| 1st     | 1.0 (100%) |
| 2nd     | 0.5 (50%)  |
| 3rd     | 0.25 (25%) |
| 4th     | 0.0 (0%)   |

### Штрафы
- ❌ Неправильный ответ: -5 очков
- 🌀 Визуальный штраф: 3 сек размытия/скрытия для других

---

## 🎯 Implemented Requirements (✓ 100%)

- ✓ Аутентификация пользователей
- ✓ Создание и хранение игровых сессий  
- ✓ Серверная генерация карточек
- ✓ Синхронизация в реал-тайме (WebSocket)
- ✓ Защита от некорректных ходов
- ✓ Поддержка 2-4 игроков
- ✓ Хранение истории матчей
- ✓ Unit тесты логики
- ✓ Рейтинговая система
- ✓ Детальная статистика

---

## 🔮 Future Enhancements

1. **🤖 Bot Mode** - Играйте против AI с настраиваемыми параметрами
2. **🏅 Achievements** - Разблокируйте значки за достижения
3. **🎬 Replays** - Пересмотрите записи своих игр
4. **🏆 Tournament Mode** - Участвуйте в турнирах
5. **📱 Mobile App** - React Native версия

---

## 📚 Документация

- **[README.md](README.md)** - Полная документация
- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Инструкции по развертыванию
- **[CONTRIBUTING.md](CONTRIBUTING.md)** - Гайд для разработчиков
- **[REQUIREMENTS.md](REQUIREMENTS.md)** - Проверка требований

---

## 🤝 API Endpoints

### tRPC Routes

#### Courses
- `GET /api/trpc/course.getCourses` - Получить все курсы
- `GET /api/trpc/course.getCourseById` - Получить курс с карточками
- `POST /api/trpc/course.createCourse` - Создать новый курс

#### Game
- `POST /api/trpc/game.createSession` - Создать игровую сессию
- `GET /api/trpc/game.getSession` - Получить данные сессии
- `POST /api/trpc/game.submitAnswer` - Отправить ответ
- `POST /api/trpc/game.endSession` - Завершить сессию

### WebSocket Events

**Client → Server:**
- `join-session` - Присоединиться к сессии
- `submit-answer` - Отправить ответ
- `next-card` - Перейти к следующей карточке
- `end-session` - Завершить сессию

**Server → Client:**
- `player-joined` - Игрок присоединился
- `answer-submitted` - Ответ получен
- `card-changed` - Карточка изменена
- `penalty-applied` - Штраф применен
- `session-ended` - Сессия завершена

---

## 💻 Системные требования

- **Node.js**: 18.0+
- **npm**: 9.0+
- **PostgreSQL**: 14.0+
- **RAM**: 2GB минимум
- **Storage**: 500MB свободного места

---

## 📝 Лицензия

MIT

---

## 🙋 Support

При вопросах или проблемах:
1. Проверьте [документацию](README.md)
2. Посмотрите [инструкции по развертыванию](DEPLOYMENT.md)
3. Создайте GitHub Issue
4. Обратитесь в team

---

**Создано с ❤️ для тренировки когнитивных функций**

*Last updated: April 2026*
