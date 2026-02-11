# Fix cPanel Deployment Issues

## Problem 1: Out of Memory Error
Your hosting has memory limits (Max resident set: 8GB, Max address space: 8GB) but Next.js dev mode uses too much memory.

## Problem 2: Running in Dev Mode
The error shows `next dev` is running instead of production mode.

---

## SOLUTION: Configure for Production Mode

### Step 1: Update Node.js App Settings in cPanel

1. Go to cPanel → "Setup Node.js App"
2. Find your application
3. Click "Edit" or "Stop App" first

### Step 2: Set Environment Variables

In the Node.js App interface, set these environment variables:

```
NODE_ENV=production
PORT=3000
```

**IMPORTANT**: Make sure `NODE_ENV` is exactly `production` (lowercase, no extra spaces)

### Step 3: Change Application Startup

Make sure your app is configured to use:
- **Application startup file**: `server.js`
- **NOT** using `next dev` command

### Step 4: Restart the Application

1. Click "Restart" in the Node.js App interface
2. Monitor the logs for errors

---

## Alternative: Use Standalone Output (Recommended for cPanel)

This creates a smaller, more memory-efficient build.

### Step 1: Update next.config.ts

Replace the content with:

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  // Reduce memory usage
  experimental: {
    // Disable some features that use more memory
    optimizePackageImports: ['react', 'react-dom'],
  },
};

export default nextConfig;
```

### Step 2: Rebuild Locally

```bash
npm run build
```

This creates a `.next/standalone` folder with everything needed.

### Step 3: Upload These Files to cPanel

Upload to your application directory:
- `.next/standalone/` folder contents (extract to root)
- `.next/static/` folder → place in `.next/static/`
- `public/` folder

### Step 4: Update server.js for Standalone

Replace `server.js` with:

```javascript
const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const path = require('path');

const dev = false; // Always production
const hostname = process.env.HOSTNAME || '0.0.0.0';
const port = process.env.PORT || 3000;

// For standalone build
process.env.NODE_ENV = 'production';

const app = next({ 
  dev, 
  hostname, 
  port,
  dir: __dirname,
});

const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('internal server error');
    }
  })
    .once('error', (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
      console.log(`> Environment: ${process.env.NODE_ENV}`);
    });
});
```

### Step 5: Restart Application

Restart the Node.js app in cPanel.

---

## If Memory Issues Persist

### Option 1: Increase Memory Limits (Contact Hosting)

Ask your hosting provider to increase:
- LVE memory limits
- Max resident set
- Max address space

### Option 2: Optimize Next.js Configuration

Add to `next.config.ts`:

```typescript
const nextConfig: NextConfig = {
  output: 'standalone',
  compress: true,
  poweredByHeader: false,
  
  // Reduce build memory
  experimental: {
    optimizePackageImports: ['react', 'react-dom', 'clsx'],
  },
  
  // Disable features you don't need
  swcMinify: true,
};
```

### Option 3: Use Static Export (Loses API Routes)

If you can't run Node.js properly, export as static:

```typescript
const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
};
```

Then upload only the `out/` folder to `public_html`.

**WARNING**: This removes all API routes and server-side features!

---

## Verify Production Mode is Running

After restart, check the logs. You should see:
```
> Ready on http://0.0.0.0:3000
> Environment: production
```

NOT:
```
> next dev
```

---

## Quick Checklist

- [ ] Set `NODE_ENV=production` in cPanel environment variables
- [ ] Use `server.js` as startup file (not `next dev`)
- [ ] Build with `output: 'standalone'` in next.config.ts
- [ ] Upload `.next/standalone/` contents
- [ ] Restart the application
- [ ] Check logs for "production" mode

---

## Still Having Issues?

1. **Check your hosting plan** - Shared hosting may not have enough resources
2. **Consider upgrading** to VPS or dedicated hosting
3. **Use Vercel** - Free hosting optimized for Next.js (recommended)
4. **Contact hosting support** - Ask about Node.js memory limits
