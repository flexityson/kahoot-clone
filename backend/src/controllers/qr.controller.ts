// backend/src/controllers/qr.controller.ts
import { Request, Response } from 'express';
import qr, { QRCodeToBufferOptions } from 'qrcode';
import { getSessionByPin } from '../services/session.service';
import { env } from '../config/env';

export const generateQR = async (req: Request, res: Response) => {
  try {
    const rawPin = req.params.pin;
    const pin = Array.isArray(rawPin) ? rawPin[0] : rawPin;

    // Validate pin format
    if (!pin || !/^\d{6}$/.test(pin)) {
      return res.status(400).json({ error: 'Invalid PIN format' });
    }

    // Get session (this will validate session exists and is active)
    const session = await getSessionByPin(pin);
    if (!session || session.status === 'ENDED') {
      return res.status(404).json({ error: 'Session not found' });
    }

    // Construct join URL
    const joinUrl = `${env.PUBLIC_BASE_URL}/play/${pin}`;

    // Generate QR code as PNG
    // Options for high quality and error correction
    const qrOptions: QRCodeToBufferOptions = {
      type: 'png',
      quality: 0.9,
      margin: 0,
      width: 500,
      errorCorrectionLevel: 'H'
    };

    // Generate QR code
    const qrCodeBuffer = await qr.toBuffer(joinUrl, qrOptions);

    // Set headers for caching and content type
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Cache-Control', 'public, max-age=3600'); // Cache for 1 hour
    res.setHeader('Content-Length', qrCodeBuffer.length);

    // Send QR code buffer
    res.send(qrCodeBuffer);
  } catch (error) {
    console.error('Error generating QR code:', error);
    res.status(500).json({ error: 'Failed to generate QR code' });
  }
};
