# 🔑 Gemini API Setup Guide

This guide will help you set up the Google Gemini API for the AI Assistant feature in DebugMate.

---

## 📋 Prerequisites

- A Google account
- Internet connection
- Text editor

---

## 🚀 Step-by-Step Setup

### 1. Get Your Gemini API Key

1. **Visit Google AI Studio**
   - Go to: https://makersuite.google.com/app/apikey
   - Or search for "Google AI Studio API Key"

2. **Sign in with your Google account**

3. **Create an API Key**
   - Click "Create API Key"
   - Select "Create API key in new project" (or choose an existing project)
   - Copy the generated API key (it looks like: `AIzaSyC...`)

⚠️ **Important**: Keep this key secret! Don't share it or commit it to Git.

---

### 2. Create `.env` File

1. **Navigate to your project root**
   ```
   c:/Users/matan/OneDrive/Desktop/project/
   ```

2. **Create a new file named `.env`** (exactly, with the dot at the start)

3. **Add your API key to the file:**
   ```env
   VITE_GEMINI_API_KEY=your_api_key_here
   ```

   Replace `your_api_key_here` with your actual API key from step 1.

   **Example:**
   ```env
   VITE_GEMINI_API_KEY=AIzaSyC1234567890abcdefghijklmnopqrstuvwxyz
   ```

4. **Save the file**

---

### 3. Restart Development Server

1. **Stop the current dev server** (press `Ctrl + C` in the terminal)

2. **Start it again:**
   ```bash
   npm run dev
   ```

3. **Refresh your browser** (`Ctrl + Shift + R`)

---

## ✅ Verify It's Working

1. **Go to the Dashboard**
2. **Paste an error in the code editor**
3. **Click "Analyze Error"**
4. **You should see AI analysis appear** in the right panel
5. **Try typing a follow-up question** in the input at the bottom
6. **Press Enter** - you should get a response!

---

## 🔧 Troubleshooting

### "API key not found" error

**Problem**: The `.env` file is not being loaded.

**Solutions**:
- Make sure the file is named exactly `.env` (not `.env.txt`)
- Make sure it's in the project root directory
- Restart the dev server after creating the file
- Check that the variable name is exactly `VITE_GEMINI_API_KEY`

### "Invalid API key" error

**Problem**: The API key is incorrect or expired.

**Solutions**:
- Double-check you copied the entire key
- Make sure there are no extra spaces
- Try generating a new API key
- Verify the key works at: https://makersuite.google.com/

### "Quota exceeded" error

**Problem**: You've used up your free quota.

**Solutions**:
- Gemini API has a free tier with limits
- Wait 24 hours for the quota to reset
- Or upgrade to a paid plan at: https://ai.google.dev/pricing

### Chat not responding

**Problem**: The follow-up chat doesn't work.

**Solutions**:
- Make sure you've analyzed an error first
- Check your internet connection
- Open browser console (F12) to see error messages
- Verify the API key is correct

---

## 📊 API Limits (Free Tier)

- **60 requests per minute**
- **1,500 requests per day**
- **1 million tokens per month**

For most debugging use cases, this is plenty!

---

## 🔒 Security Best Practices

1. ✅ **Never commit `.env` to Git**
   - The `.gitignore` file already excludes it

2. ✅ **Don't share your API key**
   - Treat it like a password

3. ✅ **Rotate keys regularly**
   - Generate new keys every few months

4. ✅ **Use environment variables**
   - Never hardcode keys in your source code

---

## 🎯 What the AI Assistant Can Do

Once set up, you can:

- ✨ **Analyze errors** - Get instant explanations
- 🔍 **Find root causes** - Understand what went wrong
- 💡 **Get solutions** - Receive step-by-step fixes
- 💬 **Ask follow-ups** - Chat about the error
- 📚 **Learn best practices** - Get coding advice

---

## 🆘 Still Having Issues?

1. Check the browser console (F12) for error messages
2. Verify your `.env` file format
3. Make sure you restarted the dev server
4. Try a different browser
5. Check your internet connection

---

## 📚 Additional Resources

- **Gemini API Docs**: https://ai.google.dev/docs
- **API Key Management**: https://makersuite.google.com/app/apikey
- **Pricing**: https://ai.google.dev/pricing
- **Community**: https://discuss.ai.google.dev/

---

**Happy Debugging! 🐛✨**
