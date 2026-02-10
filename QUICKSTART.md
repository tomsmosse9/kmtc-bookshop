# KMTC Bookshop - Quick Start Guide

## 🚀 Fast Setup (2 minutes)

### Step 1: Install Dependencies
Open terminal/command prompt in the project folder and run:
```
npm install
```

### Step 2: Start the Server
```
npm start
```

You should see:
```
KMTC Bookshop server running on http://localhost:3000
```

### Step 3: Open in Browser
Open your web browser and go to:
```
http://localhost:3000
```

## ✅ Test the Application

### Create a Test Account
1. Click "Register" on homepage
2. Fill in test data:
   - Full Name: John Doe
   - Student ID: KMTC20260001
   - Email: john@kmtc.ac.ke
   - Course: Information Technology
   - Level: Diploma
   - Campus: Nairobi
   - Semester: Semester 1
   - Password: TestPass123
3. Click "Create Account"

### Login
1. Click "Login"
2. Enter:
   - Student ID: KMTC20260001
   - Password: TestPass123
3. Click "Login to Account"

### Test Upload
1. Go to "Upload Files" in dashboard
2. Select any file from your computer
3. Fill in details and click "Upload File"

### Test Download
1. Go to "Browse Files"
2. Click "⬇️ Download" on any file

## 📁 Project Files Overview

| File | Purpose |
|------|---------|
| `index.html` | Homepage with features |
| `register.html` | Student registration page |
| `login.html` | Student login page |
| `dashboard.html` | Main student dashboard |
| `css/styles.css` | All styling (professional colors) |
| `js/auth.js` | Authentication utilities |
| `js/dashboard.js` | Dashboard functionality |
| `server.js` | Backend server |
| `package.json` | Dependencies |

## 🎨 Professional Design Features

- ✅ Modern UI with professional colors (Blue #2c5282, Green #38a169)
- ✅ Responsive design for all devices
- ✅ Smooth animations and transitions
- ✅ Professional cards and layouts
- ✅ Clear typography and spacing
- ✅ Accessible form fields
- ✅ Interactive navigation
- ✅ Dashboard with sidebar menu

## 🔑 Key Features

### 1. Registration & Login
- Student ID-based accounts
- Secure password hashing
- Course and campus selection
- Quick login with "Remember me"

### 2. Dashboard
- Overview Statistics
  - Total materials count
  - Files uploaded
  - Files downloaded
  - Current course display
- Recent materials display
- Quick action cards

### 3. Browse & Download
- Search functionality
- Filter by file type and semester
- Download materials
- File metadata display

### 4. Upload & Share
- Drag-and-drop file upload
- File type selection
- Description and metadata
- User-specific uploads tracking

### 5. User Profile
- View account information
- See registration date
- Account deletion option

## ⚙️ Technical Details

- **Server Port**: 3000 (configurable)
- **Storage**: JSON files in `data/` folder
- **Uploads**: Stored in `uploads/` folder
- **Authentication**: JWT tokens
- **Password Security**: bcryptjs hashing

## 🔗 Available Routes

**Frontend:**
- `http://localhost:3000/` - Homepage
- `http://localhost:3000/register.html` - Registration
- `http://localhost:3000/login.html` - Login
- `http://localhost:3000/dashboard.html` - Dashboard (requires login)

**API:**
- `POST http://localhost:3000/api/register` - Register
- `POST http://localhost:3000/api/login` - Login
- `GET http://localhost:3000/api/files` - Get files
- `POST http://localhost:3000/api/upload` - Upload file
- `GET http://localhost:3000/api/download/:fileId` - Download

## 📱 Browser Compatibility

- ✅ Chrome (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ Mobile browsers

## 🎓 Sample Courses & Campuses

**Courses:**
- Information Technology
  - Diploma
  - Certificate
- Health Records & IT
  - Diploma
  - Certificate

**Campuses:**
- Nairobi
- Mombasa
- Kisumu
- Nakuru

**Semesters:**
- Semester 1 through 6

## 🔒 Security Notes

1. Use strong passwords (minimum 6 characters)
2. Change default JWT_SECRET in production
3. Implement HTTPS in production
4. Regular backups of `data/` folder
5. Don't upload copyrighted material

## 📞 Troubleshooting

**Issue**: Port 3000 already in use
**Solution**: Kill the process or change PORT in server.js

**Issue**: Cannot upload files
**Solution**: Check file size (max 50MB), ensure write permissions

**Issue**: Login not working
**Solution**: Clear localStorage, check student ID spelling, verify password

## 🎉 You're All Set!

The KMTC Bookshop is now running and ready to use. Start registering students and uploading study materials!

For more details, see README.md
