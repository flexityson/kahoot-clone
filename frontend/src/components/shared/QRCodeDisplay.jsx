const React = require('react');
const QRCode = require('qrcode');

// QRCodeDisplay renders a canvas element that can be used to draw a QR code.
// For now it simply renders an empty canvas with appropriate accessibility attributes.
// In a real implementation you would use the `qrcode` library to draw onto the canvas.
function QRCodeDisplay({ url }) {
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
    width: 256,
    height: 256,
  });
}

module.exports = QRCodeDisplay;
