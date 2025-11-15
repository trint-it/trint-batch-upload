#!/usr/bin/env node

/**
 * CLI entry point for @trint/batch-upload
 * Cross-platform command-line tool for batch uploading files to Trint
 */

import { Command } from 'commander';
import { runUpload } from './runUpload';
import { parsePatternsFromFile } from './parsePatternsFromFile';
import type { UploadOptions } from './types';
import { version } from '../package.json';

const program = new Command();

program
  .name('batch-upload')
  .description('Cross-platform batch upload utility for Trint')
  .version(version)
  .addHelpText(
    'after',
    `
Examples:
  $ batch-upload -k KEY_ID -s SECRET -f audio.mp3
  $ batch-upload -k KEY_ID -s SECRET -p "./recordings/**/*.mp3" -c 5
  $ batch-upload -k KEY_ID -s SECRET -p "~/Videos/*.mp3" -p "~/Music/**/*.wav"
  $ batch-upload -k KEY_ID -s SECRET -P patterns.txt -c 3

Pattern File Format (-P option):
  One glob pattern per line
  # Lines starting with # are comments
  Blank lines are ignored
  Leading/trailing whitespace is ignored

Environment Variables:
  TRINT_API_KEY_ID      Default API key ID (overridden by -k/--api-key-id)
  TRINT_API_KEY_SECRET  Default API key secret (overridden by -s/--api-key-secret)

Supported Languages:
  en-GB   English (British spelling)
  en      English (American spelling)
  es      Spanish
  de      German
  ar      Arabic
  bg      Bulgarian
  bn      Bengali
  ca      Catalan
  cmn     Chinese Mandarin
  hr      Croatian
  cs      Czech
  da      Danish
  nl      Dutch
  fa      Farsi (Persian)
  fi      Finnish
  fr      French
  el      Greek
  he      Hebrew
  hi      Hindi
  hu      Hungarian
  it      Italian
  ja      Japanese
  ko      Korean
  lv      Latvian
  lt      Lithuanian
  ms      Malay
  no      Norwegian
  pl      Polish
  pt      Portugese
  ro      Romanian
  ru      Russian
  sk      Slovakian
  sl      Slovenian
  sv      Swedish
  sw      Swahili
  tr      Turkish
  id      Indonesian
  uk      Ukrainian
  yue     Cantonese
  cy      Welsh
  ba      Bashkir
  eu      Basque
  be      Belarusian
  et      Estonian
  ga      Irish
  gl      Galician
  mn      Mongolian
  mr      Marathi
  mt      Maltese
  ta      Tamil
  th      Thai
  ug      Uyghur
  ur      Urdu
  vi      Vietnamese
`
  );

program
  .option('-k, --api-key-id <id>', 'API key ID (required)', process.env.TRINT_API_KEY_ID)
  .option(
    '-s, --api-key-secret <secret>',
    'API key secret (required)',
    process.env.TRINT_API_KEY_SECRET
  )
  .option('-u, --server <url>', 'server URL to upload to')
  .option(
    '-f, --file <path>',
    'file to upload (repeatable)',
    (value, previous: string[] = []) => {
      return previous.concat([value]);
    },
    []
  )
  .option(
    '-p, --pattern <glob>',
    'glob pattern for files (e.g., "~/Videos/*.mp3", "./audio/**/*.wav") (repeatable)',
    (value, previous: string[] = []) => {
      return previous.concat([value]);
    },
    []
  )
  .option(
    '-P, --pattern-file <path>',
    'file containing glob patterns (one per line, # for comments) (repeatable)',
    (value, previous: string[] = []) => {
      return previous.concat([value]);
    },
    []
  )
  .option('-l, --language <code>', 'language code for transcription (e.g., en-US, fr-FR, es-ES)')
  .option(
    '-c, --concurrent <number>',
    'number of concurrent uploads (default: 1, max: 6)',
    (value) => {
      const num = parseInt(value, 10);
      if (num < 1 || num > 6) {
        throw new Error('Concurrent uploads must be between 1 and 6');
      }
      return num;
    },
    1
  )
  .option('-D, --debug', 'enable debug output', false)
  .option('--dry-run', 'list files that would be uploaded without uploading', false)
  .action(async (options: UploadOptions) => {
    try {
      // Load patterns from pattern files if specified
      if (options.patternFile && options.patternFile.length > 0) {
        for (const patternFilePath of options.patternFile) {
          const patternsFromFile = parsePatternsFromFile(patternFilePath);
          options.pattern.push(...patternsFromFile);

          if (options.debug) {
            console.debug(
              `[DEBUG] Loaded ${patternsFromFile.length} patterns from ${patternFilePath}`
            );
          }
        }
      }

      await runUpload(options);
    } catch (error) {
      console.error('Error:', error instanceof Error ? error.message : String(error));
      process.exit(1);
    }
  });

program.parse(process.argv);
