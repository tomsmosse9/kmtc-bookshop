# KMTC Bookshop Configuration

## Color Scheme
```
Primary Color: #2c5282 (Professional Blue)
Secondary Color: #38a169 (Healthy Green)
Accent Color: #ed8936 (Warm Orange)
Light Background: #edf2f7 (Light Gray)
Text Dark: #2d3748 (Dark Gray)
Text Light: #718096 (Medium Gray)
Error Color: #e53e3e (Red)
Success Color: #38a169 (Green)
```

## Typography
- Font Family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif
- H1: 2.5rem (bold)
- H2: 2rem (bold)
- H3: 1.5rem (semi-bold)
- Body: 1rem (regular)
- Line Height: 1.6

## Features Included
1. ✅ Full authentication system (Register/Login)
2. ✅ User profile management
3. ✅ File upload functionality
4. ✅ File download functionality
5. ✅ Search and filter materials
6. ✅ Dashboard with statistics
7. ✅ Course and campus selection
8. ✅ Multi-level programs (Diploma & Certificate)
9. ✅ Professional styling
10. ✅ Responsive design
11. ✅ Security features (JWT, password hashing)
12. ✅ Data persistence (JSON storage)

## Responsive Breakpoints
- Desktop: 1200px+
- Tablet: 768px - 1199px
- Mobile: Below 768px
- Small Mobile: Below 480px

## User Roles
- Student (default): Can register, login, upload, download, and manage files

## Data Model

### User Object
```json
{
  "id": "timestamp_string",
  "studentId": "KMTC20260001",
  "password": "hashed_password",
  "fullName": "John Doe",
  "email": "john@kmtc.ac.ke",
  "course": "Information Technology - Diploma",
  "campus": "Nairobi",
  "createdAt": "2026-02-10T10:00:00Z"
}
```

### File Object
```json
{
  "id": "timestamp_string",
  "filename": "1707551200000-notes.pdf",
  "originalName": "Mathematical Methods Notes.pdf",
  "fileType": "notes",
  "description": "Complete notes for mathematical methods course",
  "course": "Information Technology - Diploma",
  "semester": "Semester 1",
  "uploadedBy": "user_id",
  "uploadedAt": "2026-02-10T10:00:00Z",
  "size": 2097152,
  "path": "uploads/1707551200000-notes.pdf"
}
```

## Environment Variables
```
PORT=3000
NODE_ENV=development
JWT_SECRET=kmtc-secret-key-2026
```

## API Rate Limiting (Future Enhancement)
- 100 requests per 15 minutes per IP

## File Upload Limits
- Maximum file size: 50MB
- Allowed formats: PDF, DOCX, DOC, XLSX, XLS, PPT, TXT, ZIP

## Session Settings
- JWT expiration: 24 hours
- Session storage: LocalStorage

## Cache Settings
- Browser cache: 1 hour for static assets
- No cache for API responses

## Accessibility Features
- Semantic HTML
- ARIA labels (can be added)
- Keyboard navigation support
- Color contrast compliance
- Focus indicators on form fields
