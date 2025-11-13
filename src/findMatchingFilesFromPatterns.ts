import { glob } from 'glob';
import * as os from 'os';
import * as path from 'path';

export interface FindFilesFromPatternsOptions {
  patterns: string[];
  debug?: boolean;
}

/**
 * Get a list of files from glob patterns
 * @param options - Options including patterns array
 * @returns Promise with array of file paths
 */
export async function findMatchingFilesFromPatterns(
  options: FindFilesFromPatternsOptions
): Promise<string[]> {
  const { patterns, debug = false } = options;
  const allFiles: string[] = [];

  for (const pattern of patterns) {
    // Expand tilde to home directory
    const expandedPattern = pattern.startsWith('~')
      ? path.join(os.homedir(), pattern.slice(1))
      : pattern;

    if (debug) {
      console.debug(`[DEBUG] Processing pattern: ${pattern}`);
      if (expandedPattern !== pattern) {
        console.debug(`[DEBUG] Expanded to: ${expandedPattern}`);
      }
    }

    // Find matching files using callback version for glob v8
    const matchedFiles = await new Promise<string[]>((resolve, reject) => {
      glob(
        expandedPattern,
        {
          nodir: true, // Only return files, not directories
          absolute: true, // Return absolute paths
          dot: false, // Don't match hidden files
        },
        (err, files) => {
          if (err) {
            reject(err);
          } else {
            resolve(files);
          }
        }
      );
    });

    if (debug) {
      console.debug(`[DEBUG] Found ${matchedFiles.length} files for pattern: ${pattern}`);
    }

    allFiles.push(...matchedFiles);
  }

  if (debug) {
    console.debug(`[DEBUG] Total files found from patterns: ${allFiles.length}`);
  }

  return allFiles;
}
