# @trint/batch-upload

A cross-platform command-line tool for batch uploading files to Trint.

## Overview

This CLI tool provides a convenient way to upload multiple files to Trint for batch processing. It supports Linux, macOS, and Windows operating systems.

## Installation

### Global Installation

```bash
npm install -g @trint/batch-upload
```
or (yarn v1.x)
```bash
yarn global add @trint/batch-upload
```

### Local Development

Build:
```bash
yarn
yarn build
```

Dev Run:
```bash
yarn dev {params}
```

## Usage

After installation, you can use either command:

```bash
batch-upload [options]
# or
trint-batch-upload [options]
```

### Command Line Options

#### Authentication (Required)

- `-k, --api-key-id <id>` - API key ID (or set `TRINT_API_KEY_ID` environment variable)
- `-s, --api-key-secret <secret>` - API key secret (or set `TRINT_API_KEY_SECRET` environment variable)

#### Server Configuration

- `-u, --server <url>` - Server URL (default: https://upload.trint.com, use https://upload.eu.trint.com for the EU tenant)

#### File Selection

- `-f, --file <path>` - File to upload (can be specified multiple times)
- `-p, --pattern <glob>` - Glob pattern for files (e.g., `"~/Videos/*.mp3"`, `"./audio/**/*.wav"`) (can be specified multiple times)
- `-P, --pattern-file <path>` - File containing glob patterns (one per line, # for comments) (can be specified multiple times)

#### Processing Options

- `-l, --language <code>` - Language code for transcription (e.g., `en-GB`, `en`, `fr`, `es`, `de`)

#### Performance

- `-c, --concurrent <number>` - Number of concurrent uploads (default: 1, max: 6)

#### Debugging

- `-D, --debug` - Enable debug mode
- `--dry-run` - List files that would be uploaded without actually uploading

### Important Notes

- The `--pattern` option follows .gitignore-style glob syntax:
  - `*.mp3` - Matches files recursively in all subdirectories
  - `**/*.mp3` - Explicitly matches files in any subdirectory
  - `audio/*.mp3` - Matches files only in the `audio` subdirectory
  - `*.{mp3,wav}` - Matches multiple extensions
  - Hidden files (starting with `.`) are not matched by default
- Only supported media file types are uploaded. Files are filtered based on their extension:
  - **Audio formats**: `.mp3`, `.wav`, `.m4a`, `.aac`, `.ogg`, `.flac`, `.wma`, `.aiff`, `.opus`
  - **Video formats**: `.mp4`, `.mov`, `.avi`, `.wmv`, `.flv`, `.mkv`, `.webm`, `.mpeg`, `.mpg`, `.3gp`, `.m4v`
  - Unsupported files are automatically filtered out (use `--debug` to see which files are excluded)

### Examples

```bash
# Upload single file with API credentials
batch-upload --api-key-id YOUR_ID --api-key-secret YOUR_SECRET --file ./audio.mp3

# Using environment variables for credentials
export TRINT_API_KEY_ID=your_key_id
export TRINT_API_KEY_SECRET=your_key_secret
batch-upload --file ./audio.mp3

# Upload multiple files
batch-upload --file ./file1.mp3 --file ./file2.wav --file ./file3.m4a

# Upload with glob patterns
batch-upload --pattern "./recordings/**/*.mp3"
batch-upload --pattern "~/Videos/*.mp4" --pattern "~/Music/**/*.wav"

# Upload with pattern from file
batch-upload --pattern-file patterns.txt

# Multiple patterns with specific file types
batch-upload --pattern "./audio/**/*.{mp3,wav}" --pattern "./video/**/*.mp4"

# Upload with language specification
batch-upload --pattern "./recordings/**/*.mp3" --language en-GB

# Upload with concurrent uploads
batch-upload --pattern "./recordings/**/*.mp3" --concurrent 5

# Dry run - list files without uploading
batch-upload --pattern "./recordings/**/*.mp3" --dry-run

# Debug mode - see detailed information
batch-upload --pattern "./recordings/**/*.mp3" --debug

# Show help
batch-upload --help

# Show version
batch-upload --version
```

## Features

- Cross-platform support (Linux, macOS, Windows)
- Batch file upload capability
- Multiple file selection
- Glob pattern matching for files
- Pattern file support (load patterns from text files)
- Language specification for transcription
- Concurrent upload support
- Environment variable configuration
- Dry run mode for testing
- Debug mode for troubleshooting
- Command-line interface
- TypeScript implementation

## Configuration

### Environment Variables

Using the environment variables for credentials is generally more convenient and usually
considered safer than adding credentials to the commandline. To create credentials see
the API page in the Trint web application:

- US: <https://app.trint.com/account/api>
- EU: <https://app.eu.trint.com/account/api>

Available environment variables:

- `TRINT_API_KEY_ID` - Default API key ID (command-line option takes precedence)
- `TRINT_API_KEY_SECRET` - Default API key secret (command-line option takes precedence)

## Development

### Build the project

```bash
yarn build
```

### Watch mode for development

```bash
yarn dev
```

## Testing

```bash
yarn test
```

## Linting

```bash
yarn lint
```

## Formatting

```bash
yarn format
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
