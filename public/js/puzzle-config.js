/**
 * Puzzle Configuration for A/B Test Simulator
 * 
 * Each variant has multiple puzzle options to increase variety.
 * Puzzles are designed to have EXACTLY the target number of words (no more, no less).
 */

const PUZZLE_VARIANTS = {
  // Variant A: Difficulty 3/10 - Find exactly 3 words
  A: [
    {
      id: 'A1',
      letters: ['C', 'O', 'D', 'E', 'R', 'U', 'N', 'S', 'T', 'A', 'R', 'T'],
      targetWords: ['CODE', 'RUNS', 'STAR'],
      difficulty: 3,
      targetCount: 3
    },
    {
      id: 'A2',
      letters: ['T', 'E', 'S', 'T', 'D', 'A', 'T', 'A', 'B', 'U', 'G', 'S'],
      targetWords: ['TEST', 'DATA', 'BUGS'],
      difficulty: 3,
      targetCount: 3
    },
    {
      id: 'A3',
      letters: ['L', 'O', 'O', 'P', 'F', 'I', 'L', 'E', 'S', 'A', 'V', 'E'],
      targetWords: ['LOOP', 'FILE', 'SAVE'],
      difficulty: 3,
      targetCount: 3
    },
    {
      id: 'A4',
      letters: ['B', 'A', 'S', 'E', 'T', 'Y', 'P', 'E', 'C', 'A', 'L', 'L'],
      targetWords: ['BASE', 'TYPE', 'CALL'],
      difficulty: 3,
      targetCount: 3
    },
    {
      id: 'A5',
      letters: ['L', 'I', 'N', 'K', 'P', 'A', 'T', 'H', 'M', 'O', 'D', 'E'],
      targetWords: ['LINK', 'PATH', 'MODE'],
      difficulty: 3,
      targetCount: 3
    }
  ],

  // Variant B: Difficulty 5/10 - Find exactly 4 words
  B: [
    {
      id: 'B1',
      letters: ['C', 'O', 'M', 'P', 'U', 'T', 'E', 'R', 'S', 'C', 'I', 'E', 'N', 'C', 'E', 'D', 'A', 'T', 'A'],
      targetWords: ['COMP', 'PURE', 'ENCE', 'DATA'],
      difficulty: 5,
      targetCount: 4
    },
    {
      id: 'B2',
      letters: ['B', 'U', 'I', 'L', 'D', 'T', 'O', 'O', 'L', 'S', 'H', 'I', 'P', 'M', 'E', 'R', 'G', 'E'],
      targetWords: ['BUILD', 'TOOLS', 'SHIP', 'MERGE'],
      difficulty: 5,
      targetCount: 4
    },
    {
      id: 'B3',
      letters: ['D', 'E', 'B', 'U', 'G', 'T', 'R', 'A', 'C', 'E', 'L', 'O', 'G', 'S', 'F', 'I', 'X', 'E'],
      targetWords: ['DEBUG', 'TRACE', 'LOGS', 'FIXE'],
      difficulty: 5,
      targetCount: 4
    },
    {
      id: 'B4',
      letters: ['P', 'A', 'R', 'S', 'E', 'Q', 'U', 'E', 'R', 'Y', 'J', 'O', 'I', 'N', 'K', 'E', 'Y', 'S'],
      targetWords: ['PARSE', 'QUERY', 'JOIN', 'KEYS'],
      difficulty: 5,
      targetCount: 4
    },
    {
      id: 'B5',
      letters: ['S', 'T', 'A', 'C', 'K', 'H', 'E', 'A', 'P', 'Q', 'U', 'E', 'U', 'E', 'P', 'U', 'S', 'H'],
      targetWords: ['STACK', 'HEAP', 'QUEUE', 'PUSH'],
      difficulty: 5,
      targetCount: 4
    }
  ]
};

/**
 * Select a random puzzle for the given variant
 * @param {string} variant - 'A' or 'B'
 * @returns {object} Puzzle configuration with letters, targetWords, etc.
 */
function selectRandomPuzzle(variant) {
  const variants = PUZZLE_VARIANTS[variant];
  if (!variants || variants.length === 0) {
    throw new Error(`No puzzles found for variant ${variant}`);
  }
  
  const randomIndex = Math.floor(Math.random() * variants.length);
  return variants[randomIndex];
}

/**
 * Shuffle letters using Fisher-Yates algorithm
 * @param {Array} letters - Array of letter strings
 * @returns {Array} Shuffled copy of the array
 */
function shuffleLetters(letters) {
  const shuffled = [...letters]; // Create a copy
  
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  
  return shuffled;
}

/**
 * Get a puzzle configuration with shuffled letters
 * @param {string} variant - 'A' or 'B'
 * @returns {object} Puzzle config with shuffled letters
 */
function getPuzzleForVariant(variant) {
  const puzzle = selectRandomPuzzle(variant);
  
  return {
    ...puzzle,
    letters: shuffleLetters(puzzle.letters)
  };
}

// Export for use in ab-simulator.js
window.PuzzleConfig = {
  getPuzzleForVariant,
  PUZZLE_VARIANTS // Export for testing/debugging
};
