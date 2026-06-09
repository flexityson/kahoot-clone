import React from 'react';
import QRCode from 'qrcode';

// QRCodeDisplay renders a canvas element that can be used to draw a QR code.
// For now it simply renders an empty canvas with appropriate accessibility attributes.
// In a real implementation you would use the `qrcode` library to draw onto the canvas.
function QRCodeDisplay({ url, size = 256 }) {
  const canvasRef = React.useRef(null);

  React.useEffect(() => {
    if (url && canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, url);
    }
  }, [url]);

  return React.createElement('canvas', {
    ref: canvasRef,
    role: 'img',
    'aria-label': 'QR code',
    'data-testid': 'qr-canvas',
    width: size,
    height: size,
  });
}

export default QRCodeDisplay;
module.exports = QRCodeDisplay;
