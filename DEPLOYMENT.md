# Color Match - Setup & Deployment Guide

## Quick Start

### Prerequisites
- **Node.js**: 18.0 or higher
- **PostgreSQL**: 14.0 or higher (for production)
- **npm**: 9.0 or higher

### Development Setup

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd color-match
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   Create `.env.local` in the project root:
   ```env
   # Database
   DATABASE_URL=postgresql://user:password@localhost:5432/color_match
   
   # API
   NEXT_PUBLIC_API_URL=http://localhost:3000
   
   # Environment
   NODE_ENV=development
   ```

4. **Set up the database**
   ```bash
   npm run db:push
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Open in browser**
   ```
   http://localhost:3000
   ```

## Database Setup

### PostgreSQL Installation

#### macOS (using Homebrew):
```bash
brew install postgresql@14
brew services start postgresql@14
```

#### Linux (Ubuntu/Debian):
```bash
sudo apt-get install postgresql-14 postgresql-contrib
sudo systemctl start postgresql
```

#### Windows:
Download from [postgresql.org](https://www.postgresql.org/download/windows/)

### Create Database

```bash
createdb color_match
```

Or using psql:
```sql
CREATE DATABASE color_match;
```

## Project Scripts

```bash
npm run dev          # Start development server
npm run build        # Create production build
npm run start        # Start production server
npm run lint         # Run ESLint
npm run test         # Run unit tests
npm run test:ui      # Run tests with UI

npm run db:generate  # Generate database migration
npm run db:migrate   # Run database migrations
npm run db:push      # Push schema to database
```

## Deployment

### Vercel (Recommended for Next.js)

1. **Connect GitHub repository**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repo

2. **Set environment variables**
   - Add `DATABASE_URL` and `NEXT_PUBLIC_API_URL` in Vercel dashboard

3. **Deploy**
   - Vercel will automatically build and deploy

### Docker Deployment

1. **Create Dockerfile**
   ```dockerfile
   FROM node:20-alpine
   
   WORKDIR /app
   
   COPY package*.json ./
   RUN npm ci --only=production
   
   COPY . .
   RUN npm run build
   
   EXPOSE 3000
   CMD ["npm", "start"]
   ```

2. **Build and run**
   ```bash
   docker build -t color-match .
   docker run -p 3000:3000 -e DATABASE_URL=... color-match
   ```

### Manual Server Deployment (Linux/Ubuntu)

1. **Install Node.js and npm**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

2. **Clone repository**
   ```bash
   git clone <repo-url>
   cd color-match
   ```

3. **Install dependencies**
   ```bash
   npm install --production
   ```

4. **Build application**
   ```bash
   npm run build
   ```

5. **Set up PM2 for process management**
   ```bash
   npm install -g pm2
   pm2 start npm --name "color-match" -- start
   pm2 startup
   pm2 save
   ```

6. **Set up Nginx reverse proxy**
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

7. **Enable SSL with Let's Encrypt**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d yourdomain.com
   ```

## Environment Variables

### Required
- `DATABASE_URL`: PostgreSQL connection string
- `NEXT_PUBLIC_API_URL`: Base URL for API calls

### Optional
- `NODE_ENV`: Set to `production` or `development`
- `NEXT_PUBLIC_SOCKET_URL`: Socket.IO server URL (defaults to API_URL)

## Performance Optimization

### Database
- Create indexes on frequently queried columns:
  ```sql
  CREATE INDEX idx_game_sessions_user ON game_sessions(owner_user_id);
  CREATE INDEX idx_player_stats_user ON player_game_stats(player_id);
  CREATE INDEX idx_game_answers_session ON game_answers(session_id);
  ```

### Caching
- Use Redis for session caching (future enhancement)
- Enable Next.js ISR for static pages

### CDN
- Deploy static assets to CloudFront or similar CDN
- Configure image optimization in Next.js

## Monitoring

### Logging
- Logs are printed to stdout
- Set up centralized logging with ELK stack or similar

### Metrics
- Use New Relic, Datadog, or similar for APM
- Monitor database query performance

## Troubleshooting

### Database connection error
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```
- Ensure PostgreSQL is running
- Verify DATABASE_URL is correct

### Socket.IO connection fails
- Check NEXT_PUBLIC_API_URL matches deployed URL
- Enable CORS in Socket.IO configuration
- Check firewall/network settings

### Build fails with TypeScript errors
```bash
npm run build -- --swcTrace
```

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Socket.IO Documentation](https://socket.io/docs/)
- [tRPC Documentation](https://trpc.io/docs)
- [Drizzle ORM Documentation](https://orm.drizzle.team)
