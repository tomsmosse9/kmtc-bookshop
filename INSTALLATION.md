# Installation & Setup Guide

## 🖥️ System Requirements

- **Operating System:** Windows, Mac, or Linux
- **Node.js:** Version 14.0.0 or higher
- **npm:** Version 6.0.0 or higher (comes with Node.js)
- **RAM:** Minimum 512MB
- **Storage:** 200MB for project
- **Internet:** Required for npm install

## ✅ Pre-Installation Checklist

Before you begin, ensure:
- [ ] Node.js is installed and accessible
- [ ] npm is working correctly
- [ ] You have at least 200MB free disk space
- [ ] Port 3000 is available (or you can change it)
- [ ] You have read/write permissions for the project folder

## 📥 Step-by-Step Installation

### Step 1: Verify Node.js Installation

**On Windows (Command Prompt or PowerShell):**
```cmd
node --version
npm --version
```

**On Mac/Linux (Terminal):**
```bash
node --version
npm --version
```

**Expected Output:**
```
v14.0.0 (or higher)
6.0.0 (or higher)
```

If you don't have Node.js installed:
1. Go to https://nodejs.org
2. Download LTS version
3. Run installer and follow instructions
4. Restart your terminal/computer

### Step 2: Navigate to Project Directory

**On Windows:**
```cmd
cd C:\Users\Student\Desktop\TOMS\deep\kmtc-bookshop
```

**On Mac/Linux:**
```bash
cd /path/to/kmtc-bookshop
```

### Step 3: Install Dependencies

Run this command in the project folder:
```bash
npm install
```

This will:
- Create `node_modules` folder
- Install Express.js
- Install multer (file upload)
- Install bcryptjs (password encryption)
- Install jsonwebtoken (authentication)
- Install CORS (security)
- Install nodemon (optional, for development)

**Expected Duration:** 2-5 minutes (depending on internet speed)

### Step 4: Verify Installation

Check if installation was successful:
```bash
npm list
```

You should see:
```
kmtc-bookshop@1.0.0
├── body-parser@1.20.2
├── bcryptjs@2.4.3
├── cors@2.8.5
├── express@4.18.2
├── jsonwebtoken@9.1.0
└── multer@1.4.5-lts.1
```

### Step 5: Start the Server

```bash
npm start
```

**Expected Output:**
```
KMTC Bookshop server running on http://localhost:3000
```

🎉 **Success!** Your server is running!

### Step 6: Open in Browser

Go to: `http://localhost:3000`

You should see the KMTC Bookshop homepage.

---

## 🧪 Testing the Installation

### Test 1: Check Homepage
1. Open http://localhost:3000
2. You should see the homepage with features
3. All buttons should be clickable

### Test 2: Register Account
1. Click "Register"
2. Fill in test data (see below)
3. Click "Create Account"
4. Should redirect to login page

**Test Data:**
```
Full Name: Test Student
Student ID: KMTC20260001
Email: test@kmtc.ac.ke
Course: Information Technology
Level: Diploma
Campus: Nairobi
Semester: Semester 1
Password: TestPass123
```

### Test 3: Login
1. Click "Login"
2. Enter Student ID: KMTC20260001
3. Enter Password: TestPass123
4. Click "Login to Account"
5. Should redirect to dashboard

### Test 4: Upload File
1. In dashboard, click "Upload Files"
2. Click file upload area or select file
3. Fill in file details
4. Click "Upload File"
5. Should show success message

### Test 5: Download File
1. Click "Browse Files"
2. Find a file
3. Click "Download" button
4. File should download to your Downloads folder

---

## 🛑 Troubleshooting Installation

### Issue: npm command not found
**Solution:**
- Node.js not installed properly
- Restart your computer
- Install Node.js again from nodejs.org
- Add Node.js to PATH manually

### Issue: Port 3000 already in use
**Solution:**

**Option 1 - Find and kill the process:**

On Windows (PowerShell as Administrator):
```powershell
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue).OwningProcess | Stop-Process
```

On Mac/Linux:
```bash
lsof -i :3000
kill -9 <PID>
```

**Option 2 - Use different port:**
```bash
PORT=3001 npm start
```

### Issue: npm install fails
**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Remove node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

### Issue: Cannot read property of undefined
**Solution:**
- Check that you're in the correct directory
- Verify all files are present
- Ensure Node.js version is 14+
- Clear browser cache and restart server

### Issue: Database error (users.json not found)
**Solution:**
- Files should be created automatically
- If not, create manually:
  - Create `data` folder
  - Create `data/users.json` with `[]`
  - Create `data/files.json` with `[]`

### Issue: Cannot upload files
**Solution:**
- Create `uploads` folder if missing
- Check disk space
- Verify file size < 50MB
- Ensure write permissions on uploads folder

### Issue: Login fails with valid credentials
**Solution:**
- Clear browser localStorage:
  1. Open DevTools (F12)
  2. Go to Application tab
  3. Clear LocalStorage
- Verify user was registered successfully
- Check users.json file has the account data

---

## 📋 Directory Structure After Installation

After successful installation, your project should look like:

```
kmtc-bookshop/
├── node_modules/          (Created by npm install)
├── public/
│   ├── css/
│   ├── js/
│   ├── images/
│   ├── index.html
│   ├── register.html
│   ├── login.html
│   └── dashboard.html
├── data/
│   ├── users.json
│   └── files.json
├── uploads/
│   └── (uploaded files here)
├── server.js
├── package.json
├── package-lock.json
├── README.md
├── QUICKSTART.md
├── CONFIG.md
├── PROJECT_SUMMARY.md
└── INSTALLATION.md
```

---

## 🔧 Configuration Options

### Change Port
Edit `server.js`, line 5:
```javascript
const PORT = process.env.PORT || 3000;  // Change 3000 to your port
```

Or use environment variable:
```bash
PORT=3001 npm start
```

### Change JWT Secret
Edit `server.js`, line 6:
```javascript
const JWT_SECRET = 'your-new-secret-key';
```

### Change Upload Folder
Edit `server.js`, around line 20:
```javascript
destination: function (req, file, cb) {
    const uploadDir = 'your-new-folder';  // Change folder name
    // ...
}
```

---

## 🚀 Running in Different Environments

### Development Mode
```bash
npm start
```

### Production Mode
```bash
NODE_ENV=production npm start
```

---

## 📦 Environment Variables

Create `.env` file in project root:

```env
PORT=3000
NODE_ENV=development
JWT_SECRET=kmtc-secret-key-2026
```

Then use in server.js:
```javascript
require('dotenv').config();
const PORT = process.env.PORT || 3000;
```

---

## ☁️ Deployment Options

### Local Network Access
Run on your machine and access from other computers:
```bash
npm start
```

Access from other computers using:
```
http://your-machine-ip:3000
```

### Online Deployment
Recommended platforms:
- Heroku (free tier)
- Railway.app
- Render.com
- Vercel (frontend only)
- AWS
- DigitalOcean

---

## 🔐 Production Checklist

Before going live:
- [ ] Change JWT_SECRET to something strong
- [ ] Set NODE_ENV=production
- [ ] Enable HTTPS
- [ ] Set up database backup
- [ ] Configure environment variables
- [ ] Add rate limiting
- [ ] Add logging
- [ ] Set up monitoring
- [ ] Enable CORS properly
- [ ] Add input sanitization
- [ ] Regular security updates

---

## 📞 Getting Help

If you encounter issues:

1. **Check the error message** - It usually tells you what's wrong
2. **Check troubleshooting section** above
3. **Review README.md** for full documentation
4. **Check server terminal** for error logs
5. **Check browser console** (F12 → Console tab)
6. **Check Application tab** for stored data

---

## ✨ Next Steps

After successful installation:

1. **Test the application** using the test steps above
2. **Read README.md** for full feature documentation
3. **Explore the code** - all files are well-commented
4. **Customize** colors, text, and features as needed
5. **Deploy** to share with students

---

## 📚 Additional Resources

- Node.js Documentation: https://nodejs.org/docs
- Express.js Guides: https://expressjs.com
- JavaScript MDN Docs: https://developer.mozilla.org/en-US/docs/Web/JavaScript
- npm Registry: https://www.npmjs.com

---

**Installation Complete! Ready to use the KMTC Student Bookshop 🎉**
