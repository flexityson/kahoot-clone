# API Documentation

## Endpoints

### Generate QR Code for Session

`GET /api/sessions/:pin/qr.png`

Generates a PNG QR code image that encodes the join URL for the specified session PIN.

#### Parameters
- `:pin` (string, required): The 4-6 character alphanumeric session PIN

#### Response
- 200 OK: PNG image with QR code
  - Content-Type: image/png
  - Cache-Control: public, max-age=3600 (cached for 1 hour)
- 400 Bad Request: Invalid PIN format
- 404 Not Found: Session not found or inactive
- 500 Internal Server Error: Internal generation error

#### Example

Request: `GET /api/sessions/ABC123/qr.png`

Response: PNG image with QR code encoding: `https://kahoot.yourdomain.com/play/ABC123`

> Note: This endpoint provides QR codes for compatibility. Frontend clients generate QR codes client-side using react-qr-code for better performance and responsiveness.