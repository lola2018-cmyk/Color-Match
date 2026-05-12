import { calculateScore, applyIncorrectPenalty, getBasePoints } from '../src/server/services/gameLogic.js';
import assert from 'assert';

// Since we are importing from .js but the source is .ts, we need to use a loader.
// This test is intended to be run with a TypeScript loader (e.g., tsx, ts-node).
// For simplicity, we'll just test with static values if the import fails.

try {
  // Test calculateScore
  const score1 = calculateScore(20, 2000, 4000, 1);
  assert.strictEqual(score1, 30, `Expected 30, got ${score1}`);

  const score2 = calculateScore(20, 2000, 4000, 2);
  assert.strictEqual(score2, 25, `Expected 25, got ${score2}`);

  const score3 = calculateScore(20, 2000, 4000, 3);
  assert.strictEqual(score3, 22, `Expected 22, got ${score3}`);

  const score4 = calculateScore(20, 2000, 4000, 4);
  assert.strictEqual(score4, 20, `Expected 20, got ${score4}`);

  // Test applyIncorrectPenalty
  const penalty1 = applyIncorrectPenalty(3);
  assert.strictEqual(penalty1, 0, `Expected 0, got ${penalty1}`);

  const penalty2 = applyIncorrectPenalty(19);
  assert.strictEqual(penalty2, 14, `Expected 14, got ${penalty2}`);

  // Test getBasePoints
  const easyPoints = getBasePoints('easy');
  assert.strictEqual(easyPoints, 10, `Expected 10, got ${easyPoints}`);

  const mediumPoints = getBasePoints('medium');
  assert.strictEqual(mediumPoints, 20, `Expected 20, got ${mediumPoints}`);

  const hardPoints = getBasePoints('hard');
  assert.strictEqual(hardPoints, 30, `Expected 30, got ${hardPoints}`);

  console.log('✅ All tests passed!');
} catch (error) {
  console.error('❌ Test failed:', error.message);
  process.exit(1);
}