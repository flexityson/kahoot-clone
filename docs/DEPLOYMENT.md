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