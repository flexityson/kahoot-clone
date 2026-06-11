// frontend/src/utils/joinUrl.ts
import { VITE_PUBLIC_BASE_URL } from '@/env';

export const buildJoinUrl = (pin: string): string => {
  // Use VITE_PUBLIC_BASE_URL from environment variable
  // Ensure base URL ends with / for proper concatenation
  const base = VITE_PUBLIC_BASE_URL.endsWith('/')
    ? VITE_PUBLIC_BASE_URL
    : `${VITE_PUBLIC_BASE_URL}/`;

  // Return both URL formats for compatibility
  return `${base}play/${pin}`;
};

export const buildJoinUrlWithPinParam = (pin: string): string => {
  const base = VITE_PUBLIC_BASE_URL.endsWith('/')
    ? VITE_PUBLIC_BASE_URL
    : `${VITE_PUBLIC_BASE_URL}/`;

  return `${base}join?pin=${encodeURIComponent(pin)}`;
};

export const extractPinFromUrl = (url: string): string | null => {
  // Extract PIN from /play/:pin format
  const playRegex = /\/play\/([^/]+)$/;
  const playMatch = url.match(playRegex);
  if (playMatch) return playMatch[1];

  // Extract PIN from /join/:pin format
  const joinPathRegex = /\/join\/([^/?]+)/;
  const joinPathMatch = url.match(joinPathRegex);
  if (joinPathMatch) return joinPathMatch[1];

  // Extract PIN from /join?pin={PIN} format
  const joinQueryRegex = /\/join\?pin=([^&]+)/;
  const joinQueryMatch = url.match(joinQueryRegex);
  if (joinQueryMatch) return joinQueryMatch[1];

  return null;
};