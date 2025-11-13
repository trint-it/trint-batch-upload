import { getMimeType, isSupportedMediaType, getSupportedExtensions } from '../src/mimetype';

describe('getMimeType', () => {
  test('returns correct mime type for .mp3', () => {
    expect(getMimeType('audio.mp3')).toBe('audio/mpeg');
    expect(getMimeType('/path/to/file.mp3')).toBe('audio/mpeg');
  });

  test('returns correct mime type for .wav', () => {
    expect(getMimeType('audio.wav')).toBe('audio/wav');
  });

  test('returns correct mime type for .mp4', () => {
    expect(getMimeType('video.mp4')).toBe('video/mp4');
  });

  test('returns correct mime type for .m4a', () => {
    expect(getMimeType('audio.m4a')).toBe('audio/mp4');
  });

  test('returns correct mime type for .flac', () => {
    expect(getMimeType('audio.flac')).toBe('audio/flac');
  });

  test('returns correct mime type for .mov', () => {
    expect(getMimeType('video.mov')).toBe('video/quicktime');
  });

  test('handles uppercase extensions', () => {
    expect(getMimeType('audio.MP3')).toBe('audio/mpeg');
    expect(getMimeType('video.MOV')).toBe('video/quicktime');
  });

  test('returns undefined for unsupported extension', () => {
    expect(getMimeType('document.pdf')).toBeUndefined();
    expect(getMimeType('image.jpg')).toBeUndefined();
    expect(getMimeType('text.txt')).toBeUndefined();
  });

  test('returns undefined for file without extension', () => {
    expect(getMimeType('filename')).toBeUndefined();
  });
});

describe('isSupportedMediaType', () => {
  test('returns true for supported audio formats', () => {
    expect(isSupportedMediaType('audio.mp3')).toBe(true);
    expect(isSupportedMediaType('audio.wav')).toBe(true);
    expect(isSupportedMediaType('audio.flac')).toBe(true);
    expect(isSupportedMediaType('audio.m4a')).toBe(true);
  });

  test('returns true for supported video formats', () => {
    expect(isSupportedMediaType('video.mp4')).toBe(true);
    expect(isSupportedMediaType('video.mov')).toBe(true);
    expect(isSupportedMediaType('video.avi')).toBe(true);
  });

  test('returns false for unsupported formats', () => {
    expect(isSupportedMediaType('document.pdf')).toBe(false);
    expect(isSupportedMediaType('image.jpg')).toBe(false);
    expect(isSupportedMediaType('text.txt')).toBe(false);
  });

  test('handles uppercase extensions', () => {
    expect(isSupportedMediaType('audio.MP3')).toBe(true);
    expect(isSupportedMediaType('video.AVI')).toBe(true);
  });
});

describe('getSupportedExtensions', () => {
  test('returns array of supported extensions', () => {
    const extensions = getSupportedExtensions();
    expect(Array.isArray(extensions)).toBe(true);
    expect(extensions.length).toBeGreaterThan(0);
  });

  test('includes common audio formats', () => {
    const extensions = getSupportedExtensions();
    expect(extensions).toContain('.mp3');
    expect(extensions).toContain('.wav');
    expect(extensions).toContain('.flac');
  });

  test('includes common video formats', () => {
    const extensions = getSupportedExtensions();
    expect(extensions).toContain('.mp4');
    expect(extensions).toContain('.mov');
    expect(extensions).toContain('.avi');
  });
});
