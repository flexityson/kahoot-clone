const React = require('react');
const ReactDOMServer = require('react-dom/server');
const QRCodeDisplay = require('../QRCodeDisplay.jsx');

test('renders a canvas element with role img and aria-label QR code', () => {
  const html = ReactDOMServer.renderToStaticMarkup(React.createElement(QRCodeDisplay));
  // Expect the rendered markup to contain a canvas with the correct attributes
  expect(html).toMatch(/<canvas[^>]*role="img"[^>]*aria-label="QR code"[^>]*>/);
});
