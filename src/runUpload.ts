import { createHash } from 'crypto';
import Bluebird from 'bluebird';
import type { UploadOptions } from './types';
import { fileUpload } from './fileUpload';
import { findMatchingFilesFromPatterns } from './findMatchingFilesFromPatterns';
import { filterSupportedFiles, getSupportedExtensions } from './mimetype';

/**
 * Generate a 6-character hex ID from a file path using SHA1 hash
 */
function generateUploadId(filePath: string): string {
  return createHash('sha1').update(filePath).digest('hex').substring(0, 6);
}

export async function runUpload(options: UploadOptions): Promise<void> {
  console.log('Trint Batch Upload Tool');
  console.log('=========================\n');

  // Validate required options
  if (!options.apiKeyId) {
    throw new Error(
      'API Key ID is required. Provide via --api-key-id or TRINT_API_KEY_ID environment variable'
    );
  }

  if (!options.apiKeySecret) {
    throw new Error(
      'API Key Secret is required. Provide via --api-key-secret or TRINT_API_KEY_SECRET environment variable'
    );
  }

  console.log('Configuration:');
  console.log('  API Key ID:', options.apiKeyId);
  console.log('  API Key Secret:', '***' + options.apiKeySecret.slice(-4));
  if (options.server) {
    console.log('  Server:', options.server);
  }
  if (options.language) {
    console.log('  Language:', options.language);
  }
  console.log('  Concurrent uploads:', options.concurrent);
  console.log('  Debug mode:', options.debug);
  console.log('  Dry run mode:', options.dryRun);

  if (options.file.length > 0) {
    console.log('  Files:', options.file);
  }

  if (options.pattern.length > 0) {
    console.log('  Patterns:', options.pattern);
  }

  if (options.debug) {
    console.debug('[DEBUG] Supported file extensions:', getSupportedExtensions().join(', '));
  }

  // Collect all files to upload
  const allFiles: string[] = [];

  // Add explicitly specified files
  if (options.file.length > 0) {
    allFiles.push(...options.file);
  }

  // Get files from glob patterns
  if (options.pattern.length > 0) {
    const patternFiles = await findMatchingFilesFromPatterns({
      patterns: options.pattern,
      debug: options.debug,
    });
    allFiles.push(...patternFiles);
  }

  if (options.debug) {
    console.debug(`[DEBUG] Total files collected before filtering: ${allFiles.length}`);
  }

  // Filter files by supported media types
  const filesToUpload = filterSupportedFiles(allFiles, options.debug);

  if (allFiles.length > 0 && filesToUpload.length === 0) {
    console.log(
      '\nNo supported media files found. Supported extensions:',
      getSupportedExtensions().join(', ')
    );
    return;
  }

  // Upload or list files
  if (filesToUpload.length > 0) {
    if (options.dryRun) {
      console.log(`\nDry run: Would upload ${filesToUpload.length} file(s):`);
      filesToUpload.forEach((file, index) => {
        const fileId = generateUploadId(file);
        console.log(`  ${index + 1}. [${fileId}] ${file}`);
      });
      console.log('\nNo files were uploaded (dry run mode).');
    } else {
      console.log(
        `\nUploading ${filesToUpload.length} file(s) with concurrency ${options.concurrent}...`
      );

      let successCount = 0;
      let failCount = 0;

      // Use bluebird's Promise.map with concurrency control
      await Bluebird.map(
        filesToUpload,
        async (filePath: string) => {
          const fileId = generateUploadId(filePath);
          try {
            console.log(`  [${fileId}] Uploading: ${filePath}`);
            const result = await fileUpload({
              filePath,
              apiKeyId: options.apiKeyId!,
              apiKeySecret: options.apiKeySecret!,
              uploadServer: options.server,
              language: options.language,
              uploadId: fileId,
              debug: options.debug,
            });

            if (result.success) {
              successCount++;
              console.log(
                `  [${fileId}] ✓ Success: "${filePath}"${result.trintId ? ` => [TrintId=${result.trintId}]` : ''}`
              );
            } else {
              failCount++;
              console.error(`  [${fileId}] ✗ Failed: "${filePath}", ${result.message}`);
            }
          } catch (error) {
            failCount++;
            console.error(
              `  [${fileId}] ✗ Error: "${filePath}" ${error instanceof Error ? error.message : String(error)}\n`
            );
          }
        },
        { concurrency: options.concurrent }
      );

      console.log(`\nUpload complete: ${successCount} succeeded, ${failCount} failed`);
    }
  } else {
    console.log('\nNo files to upload.');
  }
}
