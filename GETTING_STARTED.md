# Getting Started - Complete Guide

Welcome to KMTC Student Bookshop! This guide will help you get everything up and running in minutes.

## 📋 Quick Links

- **Quick Start:** See QUICKSTART.md (2 minutes)
- **Installation:** See INSTALLATION.md (detailed setup)
- **Full Docs:** See README.md (complete documentation)
- **Configuration:** See CONFIG.md (system configuration)
- **Project Info:** See PROJECT_SUMMARY.md (what's included)

---

## ⚡ 60-Second Quick Start

1. Open terminal/command prompt
2. Navigate to project folder
3. Run: `npm install`
4. Run: `npm start`
5. Open: http://localhost:3000

**Done!** Your website is live! 🎉

---

## 🎯 What You Can Do Now

### ✅ For Administrators/Setup

1. **Install the application**
   - Follow INSTALLATION.md

2. **Configure settings**
   - Edit server.js for custom port
   - Edit CONFIG.md for system settings

3. **Test the system**
   - Use test account credentials
   - Try all features

4. **Deploy online**
   - See deployment section in README.md

### ✅ For Students

1. **Register an account**
   - Use student ID (e.g., KMTC20260001)
   - Select course and campus

2. **Login to dashboard**
   - Access all study materials
   - View your profile

3. **Browse materials**
   - Search and download notes
   - Filter by course/semester

4. **Upload resources**
   - Share your notes with classmates
   - Help other students

---

## 📁 Important Files to Know

| File | Purpose | Edit If... |
|------|---------|------------|
| server.js | Backend server | Need to change port or JWT secret |
| CONFIG.md | System settings | Need to understand configuration |
| public/index.html | Homepage | Want to change homepage content |
| public/css/styles.css | Styling | Want to change colors or layout |
| package.json | Dependencies | Want to add new features |

---

## 🎨 Customization Tips

### Change Website Colors
Edit `public/css/styles.css`, look for `:root` variables:
```css
:root {
    --primary-color: #2c5282;      /* Change this */
    --secondary-color: #38a169;    /* And this */
    --accent-color: #ed8936;       /* And this */
}
```

### Change Port Number
Edit `server.js`, line 5:
```javascript
const PORT = process.env.PORT || 3000;  // Change 3000 here
```

### Change Courses/Campuses
Edit the HTML select options in:
- `register.html` - Registration form
- `public/js/dashboard.js` - Dashboard filters

### Change Footer Text
Edit footer sections in:
- `public/index.html`
- `public/register.html`
- `public/login.html`
- `public/dashboard.html`

---

## 🔍 Understanding the File Structure

```
Project Root
    ├── server.js .......................... Main backend server
    ├── package.json ....................... Project settings & dependencies
    ├── public/ ............................ Website files (hosted by server)
    │   ├── *.html ......................... Web pages
    │   ├── css/
    │   │   └── styles.css ................ All styling
    │   ├── js/
    │   │   ├── auth.js ................... Authentication helper functions
    │   │   ├── dashboard.js .............. Dashboard page logic
    │   │   ├── login.js .................. Login page logic
    │   │   ├── register.js ............... Registration page logic
    │   │   └── main.js ................... Homepage logic
    │   └── images/ ....................... Place images here
    ├── data/ .............................. Data files
    │   ├── users.json .................... User accounts (auto-created)
    │   └── files.json .................... File metadata (auto-created)
    └── uploads/ ........................... User uploaded files
```

---

## 🔄 How the Application Works

```
User (Browser)
    ↓
Frontend (HTML/CSS/JavaScript)
    ↓
API Requests (HTTP)
    ↓
Backend (Node.js/Express)
    ↓
Data Storage (JSON files)
    ↓
Response back to User
```

### User Registration Flow
1. Student fills registration form
2. Frontend validates input
3. Sends to `/api/register` endpoint
4. Backend hashes password with bcryptjs
5. Saves user to `data/users.json`
6. Redirects to login page

### Login Flow
1. Student enters credentials
2. Sends to `/api/login` endpoint
3. Backend checks password hash
4. Creates JWT token
5. Stores token in browser (localStorage)
6. Redirects to dashboard

### File Upload Flow
1. Student selects file
2. Fills file details
3. Sends to `/api/upload` endpoint
4. Backend saves file to `uploads/` folder
5. Saves metadata to `data/files.json`
6. Shows success message

### File Download Flow
1. Student clicks download button
2. Sends request to `/api/download/:fileId`
3. Backend retrieves file from `uploads/` folder
4. Sends file to browser
5. Browser downloads file

---

## 🆘 Common Issues & Solutions

### **Problem 1: Server won't start**
```
Error: listen EADDRINUSE: address already in use :::3000
```
**Solution:** Change port number
```bash
PORT=3001 npm start
```

### **Problem 2: npm install fails**
```
npm ERR! code ERESOLVE
```
**Solution:** Use npm 8+
```bash
npm install -g npm@latest
npm install
```

### **Problem 3: Login/registration redirect loops**
**Solution:** 
- Clear browser cache/cookies
- Clear localStorage (F12 → Application → Clear)
- Verify user was registered in `data/users.json`

### **Problem 4: Can't upload files**
**Solution:**
- Check file size < 50MB
- Ensure `uploads/` folder exists and is writable
- Check `data/files.json` has write permissions

### **Problem 5: Styling looks wrong**
**Solution:**
- Hard refresh browser (Ctrl+F5 or Cmd+Shift+R)
- Clear browser cache
- Check `public/css/styles.css` exists

---

## 📊 Database Files

### users.json Format
Auto-created, contains registered students:
```json
[
  {
    "id": "1707551200000",
    "studentId": "KMTC20260001",
    "password": "$2a$10$hashed...",
    "fullName": "John Doe",
    "email": "john@kmtc.ac.ke",
    "course": "Information Technology - Diploma",
    "campus": "Nairobi",
    "createdAt": "2026-02-10T10:00:00.000Z"
  }
]
```

### files.json Format
Auto-created, contains file metadata:
```json
[
  {
    "id": "1707551200000",
    "filename": "1707551200000-notes.pdf",
    "originalName": "Math Notes.pdf",
    "fileType": "notes",
    "description": "Complete math course notes",
    "course": "Information Technology - Diploma",
    "semester": "Semester 1",
    "uploadedBy": "user_id",
    "uploadedAt": "2026-02-10T10:00:00.000Z",
    "size": 2097152,
    "path": "uploads/1707551200000-notes.pdf"
  }
]
```

---

## 🔐 Security Features (Already Implemented)

✅ **Password Security**
- Passwords hashed with bcryptjs
- Original password never stored
- Minimum 6 character requirement

✅ **Authentication**
- JWT token-based
- 24-hour expiration
- Token stored in browser localStorage

✅ **Data Protection**
- User can only delete own files
- Files require login to access
- Input validation on all forms

✅ **File Handling**
- File size limited to 50MB
- Only specific file types allowed
- Files renamed on upload
- Separate from public folder

---

## 📱 Responsive Design Testing

The website works on:
- **Desktop:** 1200px+ width
- **Tablet:** 768px - 1199px width
- **Mobile:** Below 768px width
- **Very Mobile:** Below 480px width

Test responsive design:
1. Press F12 to open DevTools
2. Click device icon (top-left)
3. Choose different devices
4. Website should adapt

---

## 🚀 Production Deployment

When deploying online:

1. **Security Updates**
   - Change JWT_SECRET in server.js
   - Update password requirements
   - Enable HTTPS

2. **Environment Variables**
   ```env
   NODE_ENV=production
   PORT=80 or 443
   JWT_SECRET=strong-secret-here
   ```

3. **Database Backup**
   - Regularly backup `data/` folder
   - Implement database server
   - Set up monitoring

4. **Server Setup**
   - Use PM2 for process management
   - Set up nginx/Apache reverse proxy
   - Enable SSL/TLS

---

## 📈 Feature Roadmap

### Currently Implemented
✅ Student registration & login
✅ File upload/download
✅ Search & filtering
✅ User profile
✅ Dashboard with statistics
✅ Responsive design
✅ Professional styling

### Great Additions (Future)
- [ ] Email verification
- [ ] Password reset
- [ ] Admin dashboard
- [ ] File commenting
- [ ] Student groups
- [ ] Notifications
- [ ] Advanced analytics
- [ ] Database integration (MongoDB/PostgreSQL)

---

## 🎓 Learning Resources

### For Beginners
- JavaScript: https://javascript.info - Free JS tutorial
- HTML/CSS: https://web.dev - Google's web fundamentals
- Express: https://expressjs.com - Official docs

### For Developers
- Node.js: https://nodejs.org/docs
- npm: https://docs.npmjs.com
- Postman: Test APIs at postman.com

### YouTube Channels
- Programming with Mosh
- Traversy Media
- The Net Ninja

---

## 📞 Support

### If something doesn't work:

1. **Check the logs**
   - Terminal output for server errors
   - Browser console (F12) for frontend errors

2. **Read documentation**
   - README.md - Full documentation
   - INSTALLATION.md - Setup help
   - CONFIG.md - Settings reference

3. **Verify setup**
   - Node.js version 14+
   - npm/node working
   - All files present
   - Port 3000 available

4. **Test manually**
   - Create test account
   - Try upload/download
   - Check data files

---

## ✨ Tips for Success

1. **Start Simple**
   - Get it running first
   - Test all features
   - Then customize

2. **Backup Your Data**
   - Keep copies of `data/` folder
   - Keep uploaded files backup
   - Keep deployment notes

3. **Keep It Secure**
   - Don't share credentials
   - Use strong passwords
   - Keep Node.js updated

4. **Get Help**
   - Read all documentation
   - Check error messages carefully
   - Try troubleshooting steps
   - Ask for help if stuck

---

## 🎉 You're Ready!

You now have a complete, professional, interactive student bookshop website!

**Next Steps:**
1. Run `npm install && npm start`
2. Test with sample account
3. Customize colors/content
4. Invite students to register
5. Help them share materials!

---

**Happy Learning! 📚**

*KMTC Student Bookshop v1.0*
*Created February 2026*
