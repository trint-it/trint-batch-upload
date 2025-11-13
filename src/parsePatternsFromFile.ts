import * as fs from 'fs';

/**
 * Parse patterns from a text file
 * - One pattern per line
 * - Leading/trailing whitespace is ignored
 * - Blank lines are ignored
 * - Lines starting with # or text after # are treated as comments
 */
export function parsePatternsFromFile(filePath: string): string[] {
  const content = fs.readFileSync(filePath, 'utf-8');
  const patterns: string[] = [];

  for (const line of content.split('\n')) {
    // Remove comments (everything after #)
    const lineWithoutComment = line.split('#')[0];

    // Trim whitespace
    const trimmed = lineWithoutComment.trim();

    // Skip empty lines
    if (trimmed.length === 0) {
      continue;
    }

    patterns.push(trimmed);
  }

  return patterns;
}
