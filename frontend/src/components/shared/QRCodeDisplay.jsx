import React from 'react';

// QRCodeDisplay renders a canvas element that can be used to draw a QR code.
// For now it simply renders an empty canvas with appropriate accessibility attributes.
// In a real implementation you would use the `qrcode` library to draw onto the canvas.
export default function QRCodeDisplay() {
  return React.createElement('canvas', {
    role: 'img',
    'aria-label': 'QR code',
    'data-testid': 'qr-canvas',
    width: 256,
    height: 256,
  });
}
