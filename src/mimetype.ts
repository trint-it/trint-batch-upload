import * as path from 'path';

/**
 * Supported media types for Trint transcription
 */
export const SUPPORTED_MIMETYPES: Record<string, string> = {
  // Audio formats
  '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav',
  '.m4a': 'audio/mp4',
  '.aac': 'audio/aac',
  '.ogg': 'audio/ogg',
  '.flac': 'audio/flac',
  '.wma': 'audio/x-ms-wma',
  '.aiff': 'audio/aiff',
  '.opus': 'audio/opus',

  // Video formats
  '.mp4': 'video/mp4',
  '.mov': 'video/quicktime',
  '.avi': 'video/x-msvideo',
  '.wmv': 'video/x-ms-wmv',
  '.flv': 'video/x-flv',
  '.mkv': 'video/x-matroska',
  '.webm': 'video/webm',
  '.mpeg': 'video/mpeg',
  '.mpg': 'video/mpeg',
  '.3gp': 'video/3gpp',
  '.m4v': 'video/x-m4v',
};

/**
 * Get mimetype for a file based on its extension
 * @param filePath - Path to the file
 * @returns Mimetype string or undefined if not supported
 */
export function getMimeType(filePath: string): string | undefined {
  const ext = path.extname(filePath).toLowerCase();
  return SUPPORTED_MIMETYPES[ext];
}

/**
 * Check if a file is a supported media type
 * @param filePath - Path to the file
 * @returns True if the file type is supported
 */
export function isSupportedMediaType(filePath: string): boolean {
  return getMimeType(filePath) !== undefined;
}

/**
 * Filter a list of files to only include supported media types
 * @param files - Array of file paths
 * @param debug - Enable debug logging
 * @returns Filtered array of file paths
 */
export function filterSupportedFiles(files: string[], debug = false): string[] {
  const supportedFiles: string[] = [];
  const unsupportedFiles: string[] = [];

  for (const file of files) {
    if (isSupportedMediaType(file)) {
      supportedFiles.push(file);
    } else {
      unsupportedFiles.push(file);
    }
  }

  if (debug && unsupportedFiles.length > 0) {
    console.debug(`[DEBUG] Filtered out ${unsupportedFiles.length} unsupported file(s):`);
    unsupportedFiles.forEach((file) => {
      const ext = path.extname(file).toLowerCase();
      console.debug(`  - ${file} (extension: ${ext || 'none'})`);
    });
  }

  if (debug) {
    console.debug(`[DEBUG] ${supportedFiles.length} supported file(s) remain after filtering`);
  }

  return supportedFiles;
}

/**
 * Get list of supported file extensions
 * @returns Array of supported extensions (with dots)
 */
export function getSupportedExtensions(): string[] {
  return Object.keys(SUPPORTED_MIMETYPES);
}
