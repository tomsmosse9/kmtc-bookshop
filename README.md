# 📚 KMTC Student Bookshop - Study Materials Repository

A comprehensive online platform for Kenya Medical Training College (KMTC) students to access, share, and manage study materials including notes, past papers, and final qualifying exams.

## 🎯 Features

### Student Management
- ✅ User registration with student ID, course, and campus selection
- ✅ Secure login with authentication
- ✅ User profile management
- ✅ Password-protected account system

### Study Materials
- ✅ Browse and search study materials by course and semester
- ✅ Download notes, past papers, and exam materials
- ✅ Upload and share your study materials with other students
- ✅ Filter materials by type and semester

### Supported Courses
- 📖 Information Technology (Diploma & Certificate)
- 🏥 Health Records & Information Technology (Diploma & Certificate)

### Campus Support
- 🏛️ Nairobi Campus
- 🏛️ Mombasa Campus
- 🏛️ Kisumu Campus
- 🏛️ Nakuru Campus

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm (Node Package Manager)
- A modern web browser

### Installation

1. **Clone/Extract the project**
```bash
cd kmtc-bookshop
```

2. **Install dependencies**
```bash
npm install
```

3. **Start the server**
```bash
npm start
```

The server will start on `http://localhost:3000`

4. **Open in browser**
Navigate to `http://localhost:3000` in your web browser

## 📂 Project Structure

```
kmtc-bookshop/
├── public/                 # Frontend files
│   ├── index.html         # Homepage
│   ├── register.html      # Registration page
│   ├── login.html         # Login page
│   ├── dashboard.html     # Main dashboard
│   ├── css/
│   │   └── styles.css     # Global styles
│   ├── js/
│   │   ├── auth.js        # Authentication utilities
│   │   ├── main.js        # Homepage logic
│   │   ├── register.js    # Registration logic
│   │   ├── login.js       # Login logic
│   │   └── dashboard.js   # Dashboard logic
│   └── images/            # Image assets
├── server.js              # Express.js server
├── package.json           # Project dependencies
├── data/                  # Data storage
│   ├── users.json         # User accounts
│   └── files.json         # File metadata
└── uploads/               # Uploaded files directory
```

## 🔐 Security Features

- Password hashing with bcryptjs
- JWT token-based authentication
- Secure file upload validation
- User-specific file permissions
- Protected routes and API endpoints

## 💾 Data Storage

The application uses JSON files for storage:
- `data/users.json` - Stores user account information
- `data/files.json` - Stores file metadata
- `uploads/` - Stores uploaded study materials

## 🎓 Usage Guide

### For Students

**1. Registration**
- Click "Register" on the homepage
- Fill in your details:
  - Full Name
  - Student ID (e.g., KMTC20260001)
  - Email address
  - Select your Course (IT or Health Records & IT)
  - Select Program Level (Diploma or Certificate)
  - Select your Campus
  - Select Current Semester
  - Create a password
- Accept terms and complete registration

**2. Login**
- Use your Student ID and password
- Optional: Check "Remember me" to save your ID

**3. Access Study Materials**
- Go to "Browse Files" section
- Search for specific materials
- Filter by course, file type, and semester
- Download materials you need

**4. Upload Materials**
- Go to "Upload Files" section
- Select a file from your computer
- Add file details:
  - File name
  - File type (Notes/Past Paper/Exam/Other)
  - Semester
  - Description
- Click "Upload File"

**5. Manage Profile**
- View your profile information
- See upload and download statistics

## 📋 File Types Supported

- **Notes** - Course notes and study guides
- **Past Papers** - Previous examination papers
- **Final Exams** - Final qualifying exam materials
- **Other** - Additional study resources

## ⚙️ Technical Stack

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Backend**: Node.js, Express.js
- **Database**: JSON files
- **Authentication**: JWT (JSON Web Tokens)
- **Password Security**: bcryptjs
- **File Upload**: multer

## 🔍 API Endpoints

### Authentication
- `POST /api/register` - Register new student
- `POST /api/login` - Student login

### User
- `GET /api/user-profile` - Get user profile

### Files
- `GET /api/files` - Get all files (with optional filters)
- `POST /api/upload` - Upload new file
- `GET /api/download/:fileId` - Download file
- `DELETE /api/files/:fileId` - Delete file
- `GET /api/search` - Search files

## 💡 Tips for Best Experience

1. **Upload Guidelines**
   - Maximum file size: 50MB
   - Use clear, descriptive file names
   - Include semester and course information in descriptions
   - Only upload materials you have permission to share

2. **Finding Materials**
   - Use the search feature for quick access
   - Filter by semester for relevant materials
   - Check file descriptions before downloading

3. **Account Security**
   - Don't share your password
   - Log out when using shared computers
   - Use a strong, unique password

## 🐛 Troubleshooting

**Port Already in Use**
- Change the PORT in server.js or set environment variable
- Example: `PORT=3001 npm start`

**Cannot Connect to Server**
- Ensure Node.js is installed correctly
- Check that the server is running
- Try accessing http://localhost:3000

**File Upload Issues**
- Check file size (must be under 50MB)
- Ensure file format is supported
- Check write permissions on uploads folder

**Login Issues**
- Verify student ID spelling
- Ensure password is correct
- Clear browser cache and try again

## 📧 Support & Contact

For issues or questions regarding the KMTC Bookshop platform, contact:
- Your course instructor
- Student IT Support
- KMTC Administration

## 📜 License

© 2026 Kenya Medical Training College. All rights reserved.

---

**Happy Learning! 📚**
