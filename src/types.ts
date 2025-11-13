export interface UploadOptions {
  apiKeyId?: string;
  apiKeySecret?: string;
  server?: string;
  file: string[];
  pattern: string[];
  patternFile: string[];
  language?: string;
  concurrent: number;
  debug: boolean;
  dryRun: boolean;
}
