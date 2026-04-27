# Contributing to Color Match

## Code Style

- Use TypeScript for all code
- Follow ESLint rules (run `npm run lint`)
- Use descriptive variable and function names
- Add comments for complex logic

## Development Workflow

1. **Create feature branch**
   ```bash
   git checkout -b feature/feature-name
   ```

2. **Make changes and test**
   ```bash
   npm run test
   npm run lint
   ```

3. **Commit with clear message**
   ```bash
   git commit -m "feat: add new feature description"
   ```

4. **Push and create pull request**
   ```bash
   git push origin feature/feature-name
   ```

## Testing

- Write unit tests for game logic
- Use Vitest for testing
- Aim for >80% coverage on critical functions

```bash
npm run test
npm run test:ui
```

## Adding New Features

### New Game Router
Create file: `src/server/trpc/routes/featureName.ts`

```typescript
import { publicProcedure, router } from '@/server/trpc';
import { z } from 'zod';

export const featureRouter = router({
  action: publicProcedure
    .input(z.object({ /* input validation */ }))
    .query(async ({ input }) => {
      // Implementation
    }),
});
```

### New Component
Create file: `src/components/feature/ComponentName.tsx`

```typescript
'use client';

export function ComponentName() {
  return <div>{/* JSX */}</div>;
}
```

### New tRPC Procedure
Add to appropriate router in `src/server/trpc/routes/`

```typescript
newProcedure: protectedProcedure
  .input(z.object({ /* validation */ }))
  .mutation(async ({ input, ctx }) => {
    // Implementation
  }),
```

## Performance Guidelines

- Minimize re-renders in React components
- Optimize database queries (use indexes)
- Cache expensive computations
- Lazy load components when possible

## Issues & Bugs

Report issues with:
- Clear title describing the problem
- Steps to reproduce
- Expected vs actual behavior
- Environment details (OS, Node version, etc.)

## Pull Request Guidelines

- Link related issues
- Describe changes made
- Include screenshots for UI changes
- Ensure all tests pass
- Update documentation if needed

## Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

Example:
```
feat(game): add penalty system for wrong answers

Implement visual penalties when players answer incorrectly.
Adds blur and button hiding effects for 3 seconds.

Closes #123
```

## Questions?

- Check existing GitHub issues
- Read the documentation
- Ask in discussions or email
