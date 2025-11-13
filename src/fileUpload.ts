import * as fs from 'fs';
import * as path from 'path';
import * as https from 'https';
import * as http from 'http';
import { getMimeType } from './mimetype';

export interface FileUploadOptions {
  filePath: string;
  apiKeyId: string;
  apiKeySecret: string;
  uploadServer?: string;
  language?: string;
  uploadId?: string;
  debug?: boolean;
}

export interface UploadResponse {
  success: boolean;
  trintId?: string;
  message?: string;
  statusCode?: number;
}

/**
 * Uploads a file to the Trint upload server
 * @param options - Upload options including file path and authentication
 * @returns Promise with upload response
 */
export async function fileUpload(options: FileUploadOptions): Promise<UploadResponse> {
  const {
    filePath,
    apiKeyId,
    apiKeySecret,
    uploadServer = 'https://upload.trint.com/',
    language,
    uploadId,
    debug = false,
  } = options;

  // Validate file exists
  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }

  const fileName = path.basename(filePath);
  const fileStats = fs.statSync(filePath);

  // Get mime type for the file
  const mimeType = getMimeType(filePath);
  if (!mimeType) {
    throw new Error(`Unsupported file type: ${filePath}`);
  }

  const idPrefix = uploadId ? `[${uploadId}] ` : '';

  if (debug) {
    console.debug(`${idPrefix}[DEBUG] Uploading file: ${fileName}`);
    console.debug(`${idPrefix}[DEBUG] File size: ${fileStats.size} bytes`);
    console.debug(`${idPrefix}[DEBUG] MIME type: ${mimeType}`);
    console.debug(`${idPrefix}[DEBUG] Upload server: ${uploadServer}`);
    if (language) {
      console.debug(`${idPrefix}[DEBUG] Language: ${language}`);
    }
  }

  // Create Basic Auth header
  const credentials = Buffer.from(`${apiKeyId}:${apiKeySecret}`).toString('base64');
  const authHeader = `Basic ${credentials}`;

  // Create a read stream for the file content
  const fileStream = fs.createReadStream(filePath);

  return new Promise((resolve, reject) => {
    const url = new URL(uploadServer);
    const isHttps = url.protocol === 'https:';
    const httpModule = isHttps ? https : http;

    // Add query parameters
    url.searchParams.set('filename', encodeURIComponent(fileName));
    if (language) {
      url.searchParams.set('language', language);
    }

    const requestOptions = {
      hostname: url.hostname,
      port: url.port || (isHttps ? 443 : 80),
      path: url.pathname + url.search,
      method: 'POST',
      headers: {
        'Content-Type': mimeType,
        'Content-Length': fileStats.size,
        Authorization: authHeader,
        Accept: 'application/json',
      },
    };

    if (debug) {
      console.debug(
        `${idPrefix}[DEBUG] Request options:`,
        JSON.stringify(
          {
            ...requestOptions,
            headers: {
              ...requestOptions.headers,
              Authorization: `Basic ${apiKeyId}:[REDACTED]`,
            },
          },
          null,
          2
        )
      );
    }

    const request = httpModule.request(requestOptions, (response) => {
      let responseData = '';

      response.on('data', (chunk) => {
        responseData += chunk;
      });

      response.on('end', () => {
        const statusCode = response.statusCode || 0;

        if (debug) {
          console.debug(`${idPrefix}[DEBUG] Response status: ${statusCode}`);
          console.debug(`${idPrefix}[DEBUG] Response body: ${responseData}`);
        }

        if (statusCode >= 200 && statusCode < 300) {
          try {
            const jsonResponse = JSON.parse(responseData) as {
              trintId?: string;
            };
            if (!jsonResponse.trintId) throw new Error('Bad response: missing trintId');

            resolve({
              success: true,
              trintId: jsonResponse.trintId,
              message: 'Upload successful',
              statusCode,
            });
          } catch (error) {
            // If response is not JSON, still consider it success based on status code
            resolve({
              success: false,
              message: (error as Error).message,
              statusCode,
            });
          }
        } else {
          resolve({
            success: false,
            message: `Upload failed with status ${statusCode}: ${responseData}`,
            statusCode,
          });
        }
      });
    });

    request.on('error', (error) => {
      if (debug) {
        console.debug(`${idPrefix}[DEBUG] Request error:`, error);
      }
      reject(new Error(`Upload request failed: ${error.message}`));
    });

    // Pipe the file stream to the request
    fileStream.pipe(request);
  });
}
