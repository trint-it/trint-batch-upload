# AI Agent Information

## Project Context

This document provides context and guidelines for AI agents working with this codebase.

## Project Overview

**Project Name:** batch-upload

**Purpose:** This package uploads one or more files to the Trint platform using the public API

**Tech Stack:** typescript

## Code Style Guidelines

- Package names use the prefix `@trint/`
- Directory names are lowercase-kebab-case
- File names are camelCase.
- Use TypeScript
- Use 2 spaces for indentation
- Follow existing patterns in the codebase

## Key Files and Directories

- `/src` - Source code
- `/tests` - Test files

## Development Workflow

1. Install dependencies: `yarn install`
2. Run development: `yarn dev {params}`
3. Run tests: `yarn test`
4. Build: `yarn build`

## Common Tasks

### Adding a New Feature

1. Create feature branch
2. Implement feature with tests
3. Update documentation
4. Submit pull request

### Testing

- Write unit tests for new functionality
- Ensure all tests pass before committing
- Maintain test coverage

## Important Notes

- Always follow the TypeScript strict mode settings
- Keep dependencies up to date
- Document all public APIs
- Follow semantic versioning for releases

## AI Agent Instructions

- Read existing code patterns before making changes
- Maintain consistency with the established codebase style
- Ask for clarification when requirements are ambiguous
- Provide clear explanations for significant changes
- Consider edge cases and error handling

## Resources

- [Project Documentation](./README.md)
- [Changelog](./CHANGELOG.md)
- [License](./LICENSE)
