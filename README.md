# Color Match - Competitive Stroop Effect Stress Trainer

A real-time multiplayer web application built with Next.js that implements a competitive version of the Stroop Effect test - a psychological phenomenon where processing color names interferes with identifying color.

## Features

### Core Gameplay
- **Stroop Effect Testing**: Players identify ink colors while ignoring conflicting color words
- **Multiple Difficulty Levels**:
  - Easy: 3 colors, 10 base points
  - Medium: 5 colors, 20 base points  
  - Hard: 6 colors, 30 base points

- **Multiplayer Sessions**: 2-4 players compete simultaneously
- **Real-time Synchronization**: All players see the same cards at the same time using WebSocket
- **Penalty System**: Incorrect answers apply visual penalties (blur, hidden buttons) to distract opponents
- **Scoring System**:
  - Base points depend on difficulty
  - Speed bonus: (remaining time / total time) × base points
  - Order multiplier: 1st answer (100%), 2nd (50%), 3rd (25%), 4th (0%)
  - Penalty for incorrect answers: -5 points

### Advanced Features
- **Authentication**: User registration and login with email/password
- **Ranking System**: Global player ratings based on win/loss records
- **Match History**: Detailed statistics for each completed game
- **Player Statistics**:
  - Correct/incorrect answer counts
  - Average reaction time
  - Fastest reaction time
  - First answer count
  - Total score and rating

### Future Enhancements
- **Bot Mode**: Play against AI opponents with configurable difficulty
- **Tournament System**: Multi-round tournaments with bracket system
- **Achievements**: Unlockable badges for various milestones

## Tech Stack

### Frontend
- **React 19.2** with Next.js 16 App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **React Hook Form** for form management
- **Socket.IO Client** for real-time communication
- **tRPC** for type-safe API calls
- **TanStack Query** for data management
- **Zustand** for state management

### Backend
- **Next.js 16** API Routes
- **tRPC** for type-safe backend procedures
- **Socket.IO** for WebSocket management
- **Drizzle ORM** for database queries
- **PostgreSQL** for persistent data storage
- **Better-auth** for authentication
- **Zod** for input validation

### Testing & Tools
- **Vitest** for unit testing game logic
- **ESLint** for code linting
- **TypeScript** for static type checking

## Getting Started

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd color-match
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
# .env.local
DATABASE_URL=postgresql://user:password@localhost:5432/color_match
NEXT_PUBLIC_API_URL=http://localhost:3000
```

4. Set up the database (requires PostgreSQL running)
```bash
npm run db:push
```

5. Run the development server
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Running Tests

```bash
npm run test
```

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/
│   │   ├── trpc/          # tRPC API endpoint
│   │   └── socket/        # Socket.IO WebSocket handler
│   ├── game/              # Game pages
│   └── page.tsx           # Home page
├── components/
│   ├── game/              # Game UI components
│   │   ├── Lobby.tsx      # Game lobby
│   │   ├── GameCard.tsx   # Card display component
│   │   └── Scoreboard.tsx # Live scoreboard
│   └── auth/              # Authentication components
├── server/
│   ├── db/
│   │   ├── index.ts       # Database connection
│   │   └── schema.ts      # Drizzle schema
│   ├── trpc/
│   │   ├── index.ts       # tRPC setup
│   │   ├── root.ts        # Router root
│   │   └── routes/        # Individual routers
│   ├── services/
│   │   ├── gameLogic.ts   # Game logic functions
│   │   └── sessionService.ts # Session management
│   └── socket/            # Socket.IO handlers
├── lib/
│   ├── trpc.ts           # tRPC client setup
│   └── trpc-provider.tsx # tRPC provider
├── hooks/
│   ├── useSocket.ts      # Socket.IO hook
│   └── useGameLogic.ts   # Game logic hook
└── types/
    ├── game.ts           # Game types
    └── auth.ts           # Auth types

tests/
└── gameLogic.test.ts     # Game logic unit tests
```

## API Endpoints (tRPC Routers)

### Course Router
- `course.getCourses()` - Get all available courses
- `course.getCourseById(id)` - Get course details with cards
- `course.createCourse(data)` - Create a new course (protected)

### Game Router
- `game.createSession(courseId, playerCount)` - Create a game session (protected)
- `game.getSession(sessionId)` - Get session details
- `game.submitAnswer(data)` - Submit player answer (protected)
- `game.endSession(sessionId)` - End the game session (protected)

## WebSocket Events

### Client → Server
- `join-session` - Player joins a game session
- `submit-answer` - Player submits an answer
- `next-card` - Move to next card
- `end-session` - End the current session

### Server → Client
- `player-joined` - A player joined the session
- `answer-submitted` - A player submitted an answer
- `card-changed` - Current card changed
- `penalty-applied` - Visual penalty applied
- `session-ended` - Session has ended
- `player-left` - A player left the session

## Scoring Formula

```
Score = BasePoints + SpeedBonus × OrderMultiplier

BasePoints = 10 (easy) / 20 (medium) / 30 (hard)
SpeedBonus = (TimeRemaining / TotalTime) × BasePoints
OrderMultiplier = 1.0 (1st) / 0.5 (2nd) / 0.25 (3rd) / 0.0 (4th)

For incorrect answer: Score -= 5
```

## Rating System

Uses a modified Elo rating system:
- K-factor: 32
- Expected score based on opponent rating
- Updates after each game session

## Game Rules

1. Players vote on selecting a course before starting
2. Server generates a set of cards from the selected course
3. Cards are presented one at a time, synchronized for all players
4. Each player has a limited time to answer
5. First correct answer gives maximum bonus
6. Incorrect answer applies visual penalty to other players
7. Game ends when all cards are answered
8. Winner is determined by highest score

## Development

### Adding New Features

1. **New Game Router**: Add route to `src/server/trpc/routes/`
2. **New Component**: Create in `src/components/`
3. **New Test**: Add test file in `tests/`
4. **New Type**: Define in `src/types/`

## License

MIT

## Contributing

Contributions are welcome! Please follow the existing code style and add tests for new features.
