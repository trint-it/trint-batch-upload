import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { parsePatternsFromFile } from '../src/parsePatternsFromFile';

describe('parsePatternsFromFile', () => {
  let tempDir: string;
  let tempFilePath: string;

  beforeEach(() => {
    // Create a temporary directory for test files
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'pattern-test-'));
    tempFilePath = path.join(tempDir, 'patterns.txt');
  });

  afterEach(() => {
    // Clean up temporary files
    if (fs.existsSync(tempFilePath)) {
      fs.unlinkSync(tempFilePath);
    }
    if (fs.existsSync(tempDir)) {
      fs.rmdirSync(tempDir);
    }
  });

  test('parses simple patterns from file', () => {
    const content = `~/Videos/*.mp3
~/Music/*.wav
./audio/**/*.flac`;
    fs.writeFileSync(tempFilePath, content, 'utf-8');

    const patterns = parsePatternsFromFile(tempFilePath);
    expect(patterns).toEqual([
      '~/Videos/*.mp3',
      '~/Music/*.wav',
      './audio/**/*.flac',
    ]);
  });

  test('ignores blank lines', () => {
    const content = `~/Videos/*.mp3

~/Music/*.wav


./audio/**/*.flac`;
    fs.writeFileSync(tempFilePath, content, 'utf-8');

    const patterns = parsePatternsFromFile(tempFilePath);
    expect(patterns).toEqual([
      '~/Videos/*.mp3',
      '~/Music/*.wav',
      './audio/**/*.flac',
    ]);
  });

  test('ignores comment lines starting with #', () => {
    const content = `# This is a comment
~/Videos/*.mp3
# Another comment
~/Music/*.wav`;
    fs.writeFileSync(tempFilePath, content, 'utf-8');

    const patterns = parsePatternsFromFile(tempFilePath);
    expect(patterns).toEqual([
      '~/Videos/*.mp3',
      '~/Music/*.wav',
    ]);
  });

  test('removes inline comments after #', () => {
    const content = `~/Videos/*.mp3 # Video audio files
~/Music/*.wav # Music files
./audio/**/*.flac # All FLAC files`;
    fs.writeFileSync(tempFilePath, content, 'utf-8');

    const patterns = parsePatternsFromFile(tempFilePath);
    expect(patterns).toEqual([
      '~/Videos/*.mp3',
      '~/Music/*.wav',
      './audio/**/*.flac',
    ]);
  });

  test('trims leading and trailing whitespace', () => {
    const content = `  ~/Videos/*.mp3  
    ~/Music/*.wav    
./audio/**/*.flac`;
    fs.writeFileSync(tempFilePath, content, 'utf-8');

    const patterns = parsePatternsFromFile(tempFilePath);
    expect(patterns).toEqual([
      '~/Videos/*.mp3',
      '~/Music/*.wav',
      './audio/**/*.flac',
    ]);
  });

  test('handles complex file with all features', () => {
    const content = `# Pattern file for batch upload
# Audio files
~/Videos/*.mp3

  ~/Music/**/*.wav  # Recursive search

# Video files
~/Videos/*.mp4  # MP4 videos only

  # This is an indented comment


./recordings/**/*.flac
`;
    fs.writeFileSync(tempFilePath, content, 'utf-8');

    const patterns = parsePatternsFromFile(tempFilePath);
    expect(patterns).toEqual([
      '~/Videos/*.mp3',
      '~/Music/**/*.wav',
      '~/Videos/*.mp4',
      './recordings/**/*.flac',
    ]);
  });

  test('returns empty array for file with only comments and blank lines', () => {
    const content = `# Comment 1
# Comment 2

# Comment 3

`;
    fs.writeFileSync(tempFilePath, content, 'utf-8');

    const patterns = parsePatternsFromFile(tempFilePath);
    expect(patterns).toEqual([]);
  });

  test('handles empty file', () => {
    fs.writeFileSync(tempFilePath, '', 'utf-8');

    const patterns = parsePatternsFromFile(tempFilePath);
    expect(patterns).toEqual([]);
  });

  test('throws error for non-existent file', () => {
    const nonExistentPath = path.join(tempDir, 'non-existent.txt');
    expect(() => parsePatternsFromFile(nonExistentPath)).toThrow();
  });
});
