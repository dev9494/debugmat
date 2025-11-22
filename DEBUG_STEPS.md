# Debug Steps for Black Screen Issue

## What to Check in Your Browser

1. **Open Developer Console** (F12 or Right-click → Inspect)
2. **Go to Console tab** and look for any red error messages
3. **Check Network tab** - are all files loading (index.css, main.tsx, etc.)?
4. **Check Elements tab** - is there any HTML being rendered?

## Common Causes:
- JavaScript error preventing React from mounting
- CSS not loading (Tailwind not processing)
- Component rendering error caught by ErrorBoundary
- Store initialization issue

## Please share:
1. Any error messages from the browser console
2. Screenshot of what you see (even if it's just black)
