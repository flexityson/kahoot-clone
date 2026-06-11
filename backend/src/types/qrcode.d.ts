declare module 'qrcode' {
  export interface QRCodeToBufferOptions {
    type?: 'png' | 'utf8' | 'svg';
    quality?: number;
    margin?: number;
    width?: number;
    errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H';
  }

  export function toBuffer(text: string, options?: QRCodeToBufferOptions): Promise<Buffer>;

  const qrcode: {
    toBuffer: typeof toBuffer;
  };

  export default qrcode;
}
