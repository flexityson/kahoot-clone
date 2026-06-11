# QR-Code Based Joining Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement QR-code based joining for Kahoot-style sessions with dual URL formats (play/{PIN} and join?pin={PIN}) across frontend, backend, and documentation

**Architecture:** 
- Frontend generates QR codes client-side using react-qr-code library for instant display
- Backend provides optional QR PNG endpoint (/api/sessions/:pin/qr.png) for compatibility
- Join URL construction unified via frontend utility module (joinUrl.ts)
- All URL building respects X-Forwarded-Proto/Host headers for reverse proxy support
- Teacher interface includes: PIN display, Copy link button, Download QR PNG button, Fullscreen QR mode
- Student flow: Direct /play/:pin auto-joins, /join?pin={PIN} prefills form
- QR codes contain only public join URLs (no tokens)
- Rate limiting already in place at backend for join attempts

**Tech Stack:** 
- Frontend: React, react-qr-code, TypeScript, Vite
- Backend: Node.js, Express, Prisma, JWT
- QR: react-qr-code (frontend), qrcode (backend)
- Environment variables: VITE_PUBLIC_BASE_URL (frontend), PUBLIC_BASE_URL (backend)
---

### Task 1: Create URL utilities for consistent join URL construction
**Files:**
- Create: `frontend/src/utils/joinUrl.ts`
- Modify: `frontend/src/.env.example`
- Modify: `backend/.env.example`

- [ ] **Step 1: Create joinUrl.ts utility**
```typescript
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
  
  // Extract PIN from /join?pin={PIN} format
  const joinRegex = /\/join\?pin=([^&]+)/;
  const joinMatch = url.match(joinRegex);
  if (joinMatch) return joinMatch[1];
  
  return null;
};
```

- [ ] **Step 2: Add environment variables to frontend .env.example**
```
# frontend/src/.env.example
VITE_PUBLIC_BASE_URL=https://yourdomain.com
```

- [ ] **Step 3: Add environment variables to backend .env.example**
```
# backend/.env.example
PUBLIC_BASE_URL=https://yourdomain.com
```

- [ ] **Step 4: Verify environment variables load correctly**
Run: `npm run dev` in frontend and `npm start` in backend to verify env vars are loaded
Expected: No errors, base URL accessible in console

- [ ] **Step 5: Commit**
```bash
git add frontend/src/utils/joinUrl.ts frontend/src/.env.example backend/.env.example
git commit -m "feat: add URL utilities for consistent join URL construction"
```

### Task 2: Implement frontend QR code component for teacher host interface
**Files:**
- Create: `frontend/src/components/teacher/JoinQrCard.tsx`
- Modify: `frontend/src/pages/teacher/HostPage.tsx`
- Modify: `frontend/src/components/teacher/HostPage.module.css`

- [ ] **Step 1: Create JoinQrCard component**
```tsx
// frontend/src/components/teacher/JoinQrCard.tsx
import React, { useState } from 'react';
import QRCode from 'react-qr-code';
import { buildJoinUrl } from '@/utils/joinUrl';
import styles from './JoinQrCard.module.css';

interface JoinQrCardProps {
  pin: string;
}

const JoinQrCard: React.FC<JoinQrCardProps> = ({ pin }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const joinUrl = buildJoinUrl(pin);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(joinUrl);
      alert('Join link copied to clipboard!');
    } catch (err) {
      // Fallback for browsers without clipboard API
      const textArea = document.createElement('textarea');
      textArea.value = joinUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('Join link copied to clipboard!');
    }
  };

  const downloadQR = () => {
    // Create canvas to generate PNG
    const canvas = document.createElement('canvas');
    const qrCode = document.querySelector('.qrcode svg');
    
    if (!qrCode) return;
    
    canvas.width = 300;
    canvas.height = 300;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    const svgString = qrCode.outerHTML;
    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const svgUrl = URL.createObjectURL(svgBlob);
    
    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(svgUrl);
      
      // Add text under QR code
      ctx.font = '16px Arial';
      ctx.fillStyle = '#000000';
      ctx.textAlign = 'center';
      ctx.fillText('Use this link to join', canvas.width / 2, canvas.height + 30);
      
      // Create download link
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
        <div className={styles.qrcode}>
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
          <div className={styles.fullscreenContent}>
            <div className={styles.pin} style={{ fontSize: '40px' }}>{pin}</div>
            <div className={styles.qrContainer}> 
              <div className={styles.qrcode}>
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
```

- [ ] **Step 2: Create CSS module for JoinQrCard**
```css
/* frontend/src/components/teacher/JoinQrCard.module.css */
.container {
  padding: 2rem;
  text-align: center;
  border-radius: 12px;
  background: #f9f9f9;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.pin {
  font-size: 3rem;
  font-weight: 700;
  margin: 1rem 0;
  color: #333;
}

.qrContainer {
  margin: 1.5rem auto;
  display: inline-flex;
  flex-direction: column;
  align-items: center;
}

.qrLabel {
  margin-top: 0.5rem;
  font-size: 1rem;
  color: #555;
}

.buttonGroup {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 2rem;
}

.button {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.button.primary {
  background-color: #10b981;
  color: white;
}

.button.secondary {
  background-color: #6b7280;
  color: white;
}

.fullscreenOverlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0,0,0,0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.fullscreenContent {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
}

.qrcode {
  background-color: white;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

@media (max-width: 768px) {
  .pin {
    font-size: 2.5rem;
  }
}
```

- [ ] **Step 3: Update HostPage to use JoinQrCard component**
```tsx
// frontend/src/pages/teacher/HostPage.tsx
import React, { useState, useEffect } from 'react';
import JoinQrCard from '@/components/teacher/JoinQrCard';
import { useNavigate } from 'react-router-dom';

interface HostPageProps {
  pin: string;
}

const HostPage: React.FC<HostPageProps> = ({ pin }) => {
  const navigate = useNavigate();
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    // If we have a pin, we're on the host page
    // In a real implementation, we would fetch session details
    // but for now we're using the pin from route params
  }, [pin]);

  return (
    <div className="host-page">
      <h1>Host Session</h1>
      <JoinQrCard pin={pin} />
    </div>
  );
};

export default HostPage;
```

- [ ] **Step 4: Update frontend route for /teacher/host/:pin**
```tsx
// frontend/src/App.tsx (or route configuration file)
<Route path="/teacher/host/:pin" element={<HostPage />} />
```

- [ ] **Step 5: Install react-qr-code dependency**
Run: `npm install react-qr-code`
Expected: Dependency added to package.json and node_modules

- [ ] **Step 6: Commit**
```bash
git add frontend/src/components/teacher/JoinQrCard.tsx frontend/src/components/teacher/JoinQrCard.module.css frontend/src/pages/teacher/HostPage.tsx frontend/src/App.tsx package.json
git commit -m "feat: implement QR code component for teacher host interface"
```

### Task 3: Implement backend QR code endpoint
**Files:**
- Create: `backend/src/controllers/qr.controller.ts`
- Modify: `backend/src/routes/api.routes.ts`

- [ ] **Step 1: Create QR controller**
```typescript
// backend/src/controllers/qr.controller.ts
import { Request, Response } from 'express';
import qr from 'qrcode';
import { getSessionById } from '../services/session.service';
import { PUBLIC_BASE_URL } from '../config';

export const generateQR = async (req: Request, res: Response) => {
  try {
    const { pin } = req.params;
    
    // Validate pin format
    if (!pin || !/^[a-zA-Z0-9]{4,6}$/.test(pin)) {
      return res.status(400).json({ error: 'Invalid PIN format' });
    }
    
    // Get session (this will validate session exists and is active)
    const session = await getSessionById(pin);
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }
    
    // Construct join URL
    const joinUrl = `${PUBLIC_BASE_URL}play/${pin}`;
    
    // Generate QR code as PNG
    // Options for high quality and error correction
    const qrOptions = {
      type: 'image/png',
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
```

- [ ] **Step 2: Update API routes to include QR endpoint**
```typescript
// backend/src/routes/api.routes.ts
import { Router } from 'express';
import { generateQR } from '../controllers/qr.controller';

const router = Router();

// QR code generation endpoint
router.get('/sessions/:pin/qr.png', generateQR);

// Add other API routes...

export default router;
```

- [ ] **Step 3: Install qrcode dependency for backend**
Run: `cd backend && npm install qrcode`
Expected: Dependency added to backend/package.json and node_modules

- [ ] **Step 4: Test QR endpoint**
Run server and test:
1. Start backend server: `npm run dev`
2. Visit: `http://localhost:4000/api/sessions/ABC123/qr.png`
Expected: PNG image of QR code with correct URL

- [ ] **Step 5: Commit**
```bash
cd backend
git add src/controllers/qr.controller.ts src/routes/api.routes.ts package.json
git commit -m "feat: implement backend QR code endpoint"
```

### Task 4: Implement student join flow
**Files:**
- Modify: `frontend/src/pages/student/JoinPage.tsx`
- Modify: `frontend/src/pages/student/LobbyPage.tsx`
- Modify: `frontend/src/App.tsx`

- [ ] **Step 1: Update JoinPage to handle /join?pin={PIN} format**
```tsx
// frontend/src/pages/student/JoinPage.tsx
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { extractPinFromUrl } from '@/utils/joinUrl';
import { useAppSelector } from '@/store';

const JoinPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [pin, setPin] = useState('');
  const [nickname, setNickname] = useState('');
  const [avatar, setAvatar] = useState('');
  const [error, setError] = useState('');
  
  const { user } = useAppSelector(state => state.auth);

  useEffect(() => {
    // Extract pin from URL when page loads
    const url = location.pathname + location.search;
    const extractedPin = extractPinFromUrl(url);
    
    if (extractedPin) {
      setPin(extractedPin);
    }
  }, [location]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!pin.trim()) {
      setError('Please enter a valid PIN');
      return;
    }
    
    // Validate PIN format
    if (!/^[a-zA-Z0-9]{4,6}$/.test(pin.trim())) {
      setError('Invalid PIN format');
      return;
    }
    
    // Navigate to lobby with pin
    navigate(`/lobby/${pin}`, { 
      state: { 
        nickname: nickname.trim() || user?.name || 'Player', 
        avatar: avatar.trim() || '' 
      } 
    });
  };

  return (
    <div className="join-page">
      <h2>Join Session</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="pin">Session PIN</label>
          <input
            type="text"
            id="pin"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            placeholder="Enter 4-6 digit PIN"
            required
            autoFocus
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="nickname">Your Name</label>
          <input
            type="text"
            id="nickname"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="Your nickname"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="avatar">Avatar (optional)</label>
          <input
            type="text"
            id="avatar"
            value={avatar}
            onChange={(e) => setAvatar(e.target.value)}
            placeholder="Avatar URL or identifier"
          />
        </div>
        
        {error && <div className="error">{error}</div>}
        
        <button type="submit" className="btn-primary">
          Join Session
        </button>
      </form>
    </div>
  );
};

export default JoinPage;
```

- [ ] **Step 2: Update LobbyPage to handle auto-join from /play/:pin**
```tsx
// frontend/src/pages/student/LobbyPage.tsx
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { extractPinFromUrl } from '@/utils/joinUrl';

const LobbyPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { pin } = useParams<{ pin: string }>();
  const [sessionId, setSessionId] = useState<string | null>(pin || null);
  const [nickname, setNickname] = useState('');
  const [avatar, setAvatar] = useState('');
  
  useEffect(() => {
    // If we're on /play/:pin, extract pin from URL
    if (!pin) {
      const extractedPin = extractPinFromUrl(location.pathname);
      if (extractedPin) {
        setSessionId(extractedPin);
      }
    }
    
    // If we have state from JoinPage, use it
    if (location.state && location.state.nickname) {
      setNickname(location.state.nickname);
      setAvatar(location.state.avatar || '');
    }
  }, [pin, location]);

  const handleJoin = () => {
    if (!sessionId) return;
    
    // Navigate to game or lobby with session details
    navigate(`/game/${sessionId}`, {
      state: { nickname, avatar }
    });
  };

  return (
    <div className="lobby-page">
      <h2>Waiting for Session to Start</h2>
      {sessionId && <h3>Session ID: {sessionId}</h3>}
      
      <button onClick={handleJoin} className="btn-primary">
        Start Game
      </button>
      
      <p>Connected as: {nickname || 'Anonymous Player'}</p>

      {/* Show QR code for students to join others if needed */}
      {/* <JoinQrCard pin={sessionId || ''} /> */}
    </div>
  );
};

export default LobbyPage;
```

- [ ] **Step 3: Update frontend routes for student flows**
```tsx
// frontend/src/App.tsx (or route configuration file)
<Route path="/play/:pin" element={<LobbyPage />} />
<Route path="/join" element={<JoinPage />} />
<Route path="/join/:pin" element={<JoinPage />} />
```

- [ ] **Step 4: Update tests for URL utilities**
This will be handled in Task 5

- [ ] **Step 5: Commit**
```bash
git add frontend/src/pages/student/JoinPage.tsx frontend/src/pages/student/LobbyPage.tsx frontend/src/App.tsx
git commit -m "feat: implement student join flow for QR code system"
```

### Task 5: Write tests for join URL utilities and route behavior
**Files:**
- Create: `frontend/src/__tests__/joinUrl.test.ts`

- [ ] **Step 1: Write tests for joinUrl.ts utility**
```typescript
// frontend/src/__tests__/joinUrl.test.ts
import { buildJoinUrl, buildJoinUrlWithPinParam, extractPinFromUrl } from '@/utils/joinUrl';

// Mock environment variable
Object.defineProperty(window, 'VITE_PUBLIC_BASE_URL', {
  value: 'https://demo.kahoot.com',
  writable: true
});

describe('joinUrl utilities', () => {
  it('builds correct join URL', () => {
    const pin = "ABC123";
    const url = buildJoinUrl(pin);
    expect(url).toBe('https://demo.kahoot.com/play/ABC123');
  });

  it('builds correct join URL with pin parameter', () => {
    const pin = "XYZ789";
    const url = buildJoinUrlWithPinParam(pin);
    expect(url).toBe('https://demo.kahoot.com/join?pin=XYZ789');
  });

  it('extracts PIN from /play/:pin format', () => {
    const url = 'https://demo.kahoot.com/play/ABC123';
    const extracted = extractPinFromUrl(url);
    expect(extracted).toBe('ABC123');
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
    
    invalidUrls.forEach(url => {
      expect(extractPinFromUrl(url)).toBeNull();
    });
  });

  it('handles trailing slashes in base URL', () => {
    // Mock base URL with trailing slash
    Object.defineProperty(window, 'VITE_PUBLIC_BASE_URL', {
      value: 'https://demo.kahoot.com/',
      writable: true
    });
    
    const pin = "DEF456";
    const url = buildJoinUrl(pin);
    expect(url).toBe('https://demo.kahoot.com/play/DEF456');
  });

  it('handles base URL without trailing slash', () => {
    // Mock base URL without trailing slash
    Object.defineProperty(window, 'VITE_PUBLIC_BASE_URL', {
      value: 'https://demo.kahoot.com',
      writable: true
    });
    
    const pin = "GHI789";
    const url = buildJoinUrl(pin);
    expect(url).toBe('https://demo.kahoot.com/play/GHI789');
  });
});
```

- [ ] **Step 2: Run tests to verify they fail initially**
Run: `npm run test frontend/src/__tests__/joinUrl.test.ts`
Expected: All tests fail with "ReferenceError: VITE_PUBLIC_BASE_URL is not defined"

- [ ] **Step 3: Implement missing functionality**
We already implemented the functionality in Task 1, but we need to ensure the test environment properly mocks the environment variable

- [ ] **Step 4: Run tests again to verify they pass**
Run: `npm run test frontend/src/__tests__/joinUrl.test.ts`
Expected: All tests pass

- [ ] **Step 5: Commit**
```bash
git add frontend/src/__tests__/joinUrl.test.ts
git commit -m "test: add tests for join URL utilities"
```

### Task 6: Update documentation
**Files:**
- Modify: `docs/DEPLOYMENT.md`
- Modify: `docs/API.md`

- [ ] **Step 1: Update DEPLOYMENT.md with environment variables and reverse proxy notes**
```markdown
# Deployment Documentation

## Environment Variables

### Frontend (Vite)
- `VITE_PUBLIC_BASE_URL`: The public URL of your application (e.g., `https://kahoot.yourdomain.com`). This is used to construct join URLs for QR codes and direct joining. Ensure this value matches your production URL when deploying behind a reverse proxy.

### Backend (Node.js)
- `PUBLIC_BASE_URL`: The public URL of your application (e.g., `https://kahoot.yourdomain.com`). Used to construct join URLs for the backend QR code endpoint. This must match what clients see when accessing your site.

## Reverse Proxy Configuration

When deploying behind a reverse proxy like Nginx or Cloudflare, ensure proper headers are forwarded:

1. Forward `X-Forwarded-Host` header
2. Forward `X-Forwarded-Proto` header (HTTP/HTTPS) 
3. Configure your proxy to pass through WebSocket connections for real-time game features

Example Nginx configuration:

```
location / {
    proxy_pass http://localhost:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_set_header X-Forwarded-Host $host;
}
```

## Docker Compose

Your `docker-compose.yml` should include environment variables for both frontend and backend:

```yaml
version: "3"
services:
  frontend:
    build: ./frontend
    ports:
      - "5173:5173"
    environment:
      - VITE_PUBLIC_BASE_URL=https://kahoot.yourdomain.com
    depends_on:
      - backend

  backend:
    build: ./backend
    ports:
      - "4000:4000"
    environment:
      - PUBLIC_BASE_URL=https://kahoot.yourdomain.com
    depends_on:
      - database
```

Remember: For production, use a secure HTTPS connection for `VITE_PUBLIC_BASE_URL` and `PUBLIC_BASE_URL`. The QR codes must contain the correct public URL, not localhost IP addresses.
```

- [ ] **Step 2: Update API.md with QR endpoint documentation**
```markdown
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
```

- [ ] **Step 3: Commit documentation updates**
```bash
git add docs/DEPLOYMENT.md docs/API.md
git commit -m "docs: update documentation for QR code joining system"
```

### Task 7: Implementation verification steps

- [ ] **Step 1: Verify QR generation on frontend**
1. Start frontend: `npm run dev`
2. Navigate to `/teacher/host/ABC123`
3. Verify PIN displays correctly
4. Verify QR code displays correctly and encodes correct URL
5. Verify "Copy Join Link" button copies correct URL to clipboard
6. Verify "Download QR PNG" generates and downloads proper PNG file
7. Verify "Fullscreen QR" mode shows large QR code

- [ ] **Step 2: Verify student join flow**
1. Start frontend: `npm run dev`
2. Visit `/join?pin=ABC123`
3. Verify PIN is prefilled in form
4. Enter nickname and click "Join Session"
5. Verify redirected to `/lobby/ABC123`
6. Visit `/play/ABC123` directly
7. Verify redirected directly to `/lobby/ABC123`
8. Verify nickname from form is passed to lobby

- [ ] **Step 3: Verify backend QR endpoint functionality**
1. Start backend: `npm run dev`
2. Visit `http://localhost:4000/api/sessions/ABC123/qr.png`
3. Verify PNG image loads with QR code
4. Scan QR code on mobile device and verify it opens `https://kahoot.yourdomain.com/play/ABC123`

- [ ] **Step 4: Verify reverse proxy behavior**
1. Set `VITE_PUBLIC_BASE_URL=https://kahoot.mycompany.com` in frontend 
2. Set `PUBLIC_BASE_URL=https://kahoot.mycompany.com` in backend
3. Start both services
4. Visit frontend locally and verify URLs show `kahoot.mycompany.com` not localhost
5. Verify QR codes generated show correct public domain, not internal IP

- [ ] **Step 5: Verify rate limiting is unaffected**
1. Create a script that attempts to join with multiple different PINs
2. Verify rate limiting still applies based on IP, not QR code generation method

- [ ] **Step 6: Final testing in Docker-compose**
1. Build images: `docker-compose build`
2. Start services: `docker-compose up`
3. Verify all functionality works with environment variables set
4. Verify reverse proxy functionality when configured with Nginx

- [ ] **Step 7: Commit final verification**
```bash
git add .
git commit -m "feat: implement fully verified QR code joining system"
```

### Task 8: Final review and cleanup

- [ ] **Step 1: Review code for security**
- Verify no sensitive information is embedded in QR codes (only public URLs)
- Verify PIN validation is consistent across frontend and backend
- Verify no authentication tokens are included in QR codes

- [ ] **Step 2: Check error messages**
- Ensure all error messages are user-friendly and don't reveal system internals
- Use generic error messages like "Invalid PIN" instead of "Session not found"

- [ ] **Step 3: Verify code quality and style**
- All code follows existing codebase style
- No console.log statements remain
- TypeScript types are properly defined and used
- All functions have appropriate error handling

- [ ] **Step 4: Verify documentation matches implementation**
- Double-check that all environment variables, endpoints, and behaviors described in documentation match the implemented code

- [ ] **Step 5: Final commit**
```bash
git add .
git commit -m "refactor: final review and cleanup for QR code joining system"
```

### Task 9: Plan completion and handoff

Plan complete and saved to `docs/superpowers/plans/2026-06-09-qr-code-joining.md`. Two execution options:

**1. Subagent-Driven (recommended)**
- I dispatch a fresh subagent per task, review between tasks, fast iteration

**2. Inline Execution**
- Execute tasks in this session using executing-plans, batch execution with checkpoints

Which approach?