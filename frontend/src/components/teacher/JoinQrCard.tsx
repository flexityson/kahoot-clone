import React, { useState, useRef } from 'react';
import QRCode from 'react-qr-code';
import toast from 'react-hot-toast';
import { buildJoinUrl } from '@/utils/joinUrl';
import styles from './JoinQrCard.module.css';

interface JoinQrCardProps {
  pin: string;
}

const JoinQrCard: React.FC<JoinQrCardProps> = ({ pin }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);
  const qrFullscreenRef = useRef<HTMLDivElement>(null);
  const joinUrl = buildJoinUrl(pin);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(joinUrl);
      toast.success('Join link copied to clipboard!');
    } catch {
      const textArea = document.createElement('textarea');
      textArea.value = joinUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      toast.success('Join link copied to clipboard!');
    }
  };

  const downloadQR = () => {
    const svgEl = qrRef.current?.querySelector('svg');
    if (!svgEl) return;

    const canvas = document.createElement('canvas');
    canvas.width = 300;
    canvas.height = 300;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const svgString = svgEl.outerHTML;
    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const svgUrl = URL.createObjectURL(svgBlob);

    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(svgUrl);

      const downloadLink = document.createElement('a');
      downloadLink.href = canvas.toDataURL('image/png');
      downloadLink.download = `join-${pin}.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    };

    img.src = svgUrl;
  };

  return (
    <div className={styles.container}>
      <div className={styles.pin}>{pin}</div>

      <div className={styles.qrContainer}>
        <div ref={qrRef} className={styles.qrcode}>
          <QRCode
            size={200}
            value={joinUrl}
            fgColor="#000"
            bgColor="#ffffff"
            level="H"
          />
        </div>
        <div className={styles.qrLabel}>Use this link to join</div>
      </div>

      <div className={styles.buttonGroup}>
        <button className={styles.button} onClick={copyToClipboard}>
          Copy Join Link
        </button>
        <button className={styles.button} onClick={downloadQR}>
          Download QR PNG
        </button>
        <button
          className={styles.button}
          onClick={() => setIsFullscreen(!isFullscreen)}
        >
          {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen QR'}
        </button>
      </div>

      {isFullscreen && (
        <div className={styles.fullscreenOverlay} onClick={() => setIsFullscreen(false)}>
          <div className={styles.fullscreenContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.pin} style={{ fontSize: '40px' }}>{pin}</div>
            <div className={styles.qrContainer}>
              <div ref={qrFullscreenRef} className={styles.qrcode}>
                <QRCode
                  size={400}
                  value={joinUrl}
                  fgColor="#000"
                  bgColor="#ffffff"
                  level="H"
                />
              </div>
              <div className={styles.qrLabel}>Use this link to join</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JoinQrCard;
