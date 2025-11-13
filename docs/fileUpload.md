# File Upload Implementation

## Overview

The `fileUpload` function uploads files to the Trint API using the documented endpoint at dev.trint.com.

## Implementation Details

### Authentication
Uses Basic Authentication as documented at https://dev.trint.com/docs/trint-api-keys:
- Combines API Key ID and API Key Secret with a colon
- Base64 encodes the credentials
- Sends as `Authorization: Basic <encoded>` header

### Endpoint
- Default: `https://upload.trint.com/`
- Configurable via `--server` option
- Uses POST method with file content as request body
- Filename passed as query parameter
- Language (optional) passed as query parameter

### Function Signature

```typescript
fileUpload(options: FileUploadOptions): Promise<UploadResponse>
```

**FileUploadOptions:**
- `filePath: string` - Path to file to upload
- `apiKeyId: string` - API Key ID
- `apiKeySecret: string` - API Key Secret
- `uploadServer?: string` - Optional server URL (default: https://upload.trint.com/)
- `language?: string` - Optional language code for transcription
- `uploadId?: string` - Optional upload ID for debug logging
- `debug?: boolean` - Enable debug logging

**UploadResponse:**
- `success: boolean` - Upload success status
- `trintId?: string` - Trint ID of uploaded file
- `message?: string` - Status message
- `statusCode?: number` - HTTP status code

## Usage Example

```typescript
import { fileUpload } from './file-upload';

const result = await fileUpload({
  filePath: './audio.mp3',
  apiKeyId: 'AK-12345ABCDE',
  apiKeySecret: 'your-secret-here',
  debug: true
});

if (result.success) {
  console.log('Uploaded! Trint ID:', result.trintId);
}
```

## Dependencies

- Node.js built-in modules: `fs`, `path`, `https`, `http`, `crypto`
- `getMimeType` from `./mimetype` - For determining file MIME types

## Features

- ✓ Basic Authentication with API Key ID/Secret
- ✓ Direct file streaming upload
- ✓ MIME type detection
- ✓ HTTPS and HTTP support
- ✓ Query parameter support (filename, language)
- ✓ Debug logging with upload ID tracking
- ✓ Error handling
- ✓ File validation
- ✓ Response parsing
