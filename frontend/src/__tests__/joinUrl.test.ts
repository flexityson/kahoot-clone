import { buildJoinUrl, buildJoinUrlWithPinParam, extractPinFromUrl } from '@/utils/joinUrl';

// Mock @/env so the module resolves VITE_PUBLIC_BASE_URL
jest.mock('@/env', () => ({
  VITE_PUBLIC_BASE_URL: 'https://demo.kahoot.com',
}));

describe('joinUrl utilities', () => {
  it('builds correct join URL', () => {
    const pin = 'ABC123';
    const url = buildJoinUrl(pin);
    expect(url).toBe('https://demo.kahoot.com/play/ABC123');
  });

  it('builds correct join URL with pin parameter', () => {
    const pin = 'XYZ789';
    const url = buildJoinUrlWithPinParam(pin);
    expect(url).toBe('https://demo.kahoot.com/join?pin=XYZ789');
  });

  it('extracts PIN from /play/:pin format', () => {
    const url = 'https://demo.kahoot.com/play/ABC123';
    const extracted = extractPinFromUrl(url);
    expect(extracted).toBe('ABC123');
  });

  it('extracts PIN from /join/:pin format', () => {
    const url = 'https://demo.kahoot.com/join/XYZ789';
    const extracted = extractPinFromUrl(url);
    expect(extracted).toBe('XYZ789');
  });

  it('extracts PIN from /join?pin={PIN} format', () => {
    const url = 'https://demo.kahoot.com/join?pin=XYZ789';
    const extracted = extractPinFromUrl(url);
    expect(extracted).toBe('XYZ789');
  });

  it('returns null for invalid URLs', () => {
    const invalidUrls = [
      'https://demo.kahoot.com/',
      'https://demo.kahoot.com/play',
      'https://demo.kahoot.com/join',
      'https://demo.kahoot.com/join?pin=',
      'https://demo.kahoot.com/unknown/path',
    ];

    invalidUrls.forEach((url) => {
      expect(extractPinFromUrl(url)).toBeNull();
    });
  });
});
