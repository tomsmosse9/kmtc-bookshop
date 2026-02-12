require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  console.error('CRITICAL: JWT_SECRET environment variable is not set!');
  process.exit(1);
}

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// Data storage paths
const usersFile = path.join(__dirname, 'data', 'users.json');
const filesMetadataFile = path.join(__dirname, 'data', 'files.json');
const chatFile = path.join(__dirname, 'data', 'chat.json');
const groupsFile = path.join(__dirname, 'data', 'groups.json');

// Initialize data files
const dataDir = path.join(__dirname, 'data');
const uploadsDir = path.join(__dirname, 'uploads');
[dataDir, uploadsDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

if (!fs.existsSync(usersFile)) {
  fs.writeFileSync(usersFile, JSON.stringify([]));
}
if (!fs.existsSync(filesMetadataFile)) {
  fs.writeFileSync(filesMetadataFile, JSON.stringify([]));
}
if (!fs.existsSync(chatFile)) {
  fs.writeFileSync(chatFile, JSON.stringify([]));
}
if (!fs.existsSync(groupsFile)) {
  const defaultGroup = [{
    id: 'general',
    name: 'General',
    createdBy: 'system',
    members: [],
    createdAt: new Date().toISOString(),
    isDefault: true
  }];
  fs.writeFileSync(groupsFile, JSON.stringify(defaultGroup, null, 2));
}

// Helper functions
function readUsers() {
  return JSON.parse(fs.readFileSync(usersFile, 'utf8'));
}

function writeUsers(users) {
  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
}

function readFilesMetadata() {
  return JSON.parse(fs.readFileSync(filesMetadataFile, 'utf8'));
}

function writeFilesMetadata(data) {
  fs.writeFileSync(filesMetadataFile, JSON.stringify(data, null, 2));
}

function readChat() {
  return JSON.parse(fs.readFileSync(chatFile, 'utf8'));
}

function writeChat(messages) {
  fs.writeFileSync(chatFile, JSON.stringify(messages, null, 2));
}

function readGroups() {
  return JSON.parse(fs.readFileSync(groupsFile, 'utf8'));
}

function writeGroups(groups) {
  fs.writeFileSync(groupsFile, JSON.stringify(groups, null, 2));
}

function verifyToken(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
}

// Routes

// 1. REGISTRATION
app.post('/api/register', (req, res) => {
  try {
    const { studentId, password, fullName, email, course, campus } = req.body;

    // Validation
    if (!studentId || !password || !fullName || !email || !course || !campus) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const users = readUsers();

    // Check if student already exists
    if (users.find(u => u.studentId === studentId)) {
      return res.status(400).json({ message: 'Student ID already registered' });
    }

    // Hash password
    const hashedPassword = bcryptjs.hashSync(password, 10);

    // Create new user
    const newUser = {
      id: Date.now().toString(),
      studentId,
      password: hashedPassword,
      fullName,
      email,
      course,
      campus,
      role: 'student',
      isVerified: false,
      otp: Math.floor(100000 + Math.random() * 900000).toString(),
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    writeUsers(users);

    console.log(`[SIMULATED EMAIL] To: ${email} | Subject: Your OTP | Content: Your registration OTP is ${newUser.otp}`);

    res.status(201).json({
      message: 'Registration successful. Please verify your OTP.',
      studentId: newUser.studentId
    });
  } catch (err) {
    res.status(500).json({ message: 'Registration error', error: err.message });
  }
});

// 2. VERIFY OTP
app.post('/api/verify-otp', (req, res) => {
  try {
    const { studentId, otp } = req.body;
    if (!studentId || !otp) {
      return res.status(400).json({ message: 'Student ID and OTP are required' });
    }

    const users = readUsers();
    const userIndex = users.findIndex(u => u.studentId === studentId);

    if (userIndex === -1) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (users[userIndex].isVerified) {
      return res.status(400).json({ message: 'User already verified' });
    }

    if (users[userIndex].otp === otp) {
      users[userIndex].isVerified = true;
      delete users[userIndex].otp; // Remove OTP after success
      writeUsers(users);
      res.json({ message: 'Verification successful. You can now log in.' });
    } else {
      res.status(400).json({ message: 'Invalid OTP' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Verification error', error: err.message });
  }
});

// 3. LOGIN
app.post('/api/login', (req, res) => {
  try {
    const { studentId, password } = req.body;

    if (!studentId || !password) {
      return res.status(400).json({ message: 'Student ID and password required' });
    }

    const users = readUsers();
    const user = users.find(u => u.studentId === studentId);

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check if verified
    if (user.isVerified === false) {
      return res.status(403).json({ message: 'Account not verified. Please verify your OTP.' });
    }

    const validPassword = bcryptjs.compareSync(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '24h' });

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        studentId: user.studentId,
        fullName: user.fullName,
        role: user.role
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Login error', error: err.message });
  }
});

// 3. GET USER PROFILE
app.get('/api/user-profile', verifyToken, (req, res) => {
  try {
    const users = readUsers();
    const user = users.find(u => u.id === req.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      id: user.id,
      studentId: user.studentId,
      fullName: user.fullName,
      email: user.email,
      course: user.course,
      campus: user.campus,
      createdAt: user.createdAt
    });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching profile', error: err.message });
  }
});

// 4. UPLOAD FILE
app.post('/api/upload', verifyToken, upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const { fileType, description, course, semester } = req.body;

    const filesMetadata = readFilesMetadata();
    const fileEntry = {
      id: Date.now().toString(),
      filename: req.file.filename,
      originalName: req.file.originalname,
      fileType,
      description,
      course,
      semester,
      uploadedBy: req.userId,
      uploadedAt: new Date().toISOString(),
      size: req.file.size,
      path: req.file.path
    };

    filesMetadata.push(fileEntry);
    writeFilesMetadata(filesMetadata);

    res.status(201).json({
      message: 'File uploaded successfully',
      file: fileEntry
    });
  } catch (err) {
    res.status(500).json({ message: 'Upload error', error: err.message });
  }
});

// 5. GET ALL FILES (with filters)
app.get('/api/files', verifyToken, (req, res) => {
  try {
    const { course, fileType, semester } = req.query;
    let filesMetadata = readFilesMetadata();

    // Apply filters
    if (course) {
      filesMetadata = filesMetadata.filter(f => f.course === course);
    }
    if (fileType) {
      filesMetadata = filesMetadata.filter(f => f.fileType === fileType);
    }
    if (semester) {
      filesMetadata = filesMetadata.filter(f => f.semester === semester);
    }

    res.json(filesMetadata);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching files', error: err.message });
  }
});

// 6. DOWNLOAD FILE
app.get('/api/download/:fileId', verifyToken, (req, res) => {
  try {
    const filesMetadata = readFilesMetadata();
    const file = filesMetadata.find(f => f.id === req.params.fileId);

    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    const filePath = path.join(__dirname, file.path);
    res.download(filePath, file.originalName);
  } catch (err) {
    res.status(500).json({ message: 'Download error', error: err.message });
  }
});

// 7. DELETE FILE (only uploader can delete)
app.delete('/api/files/:fileId', verifyToken, (req, res) => {
  try {
    let filesMetadata = readFilesMetadata();
    const fileIndex = filesMetadata.findIndex(f => f.id === req.params.fileId);

    if (fileIndex === -1) {
      return res.status(404).json({ message: 'File not found' });
    }

    const file = filesMetadata[fileIndex];
    if (file.uploadedBy !== req.userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const filePath = path.join(__dirname, file.path);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    filesMetadata.splice(fileIndex, 1);
    writeFilesMetadata(filesMetadata);

    res.json({ message: 'File deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Delete error', error: err.message });
  }
});

// 8. SEARCH FILES
app.get('/api/search', verifyToken, (req, res) => {
  try {
    const { q } = req.query;
    let filesMetadata = readFilesMetadata();

    if (q) {
      filesMetadata = filesMetadata.filter(f =>
        f.originalName.toLowerCase().includes(q.toLowerCase()) ||
        f.description.toLowerCase().includes(q.toLowerCase())
      );
    }

    res.json(filesMetadata);
  } catch (err) {
    res.status(500).json({ message: 'Search error', error: err.message });
  }
});

// 9. GROUP CHAT - get messages
app.get('/api/chat/messages', verifyToken, (req, res) => {
  try {
    const { since } = req.query; // optional timestamp to fetch newer messages
    let messages = readChat();

    if (since) {
      messages = messages.filter(m => new Date(m.createdAt) > new Date(since));
    }

    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching chat messages', error: err.message });
  }
});

// 10. POST A CHAT MESSAGE (text + optional attachment)
app.post('/api/chat/messages', verifyToken, upload.array('attachments', 5), (req, res) => {
  try {
    const { text, replyTo } = req.body;
    // allow message with either text or attachments
    if (!text && (!req.files || req.files.length === 0)) {
      return res.status(400).json({ message: 'Message text or attachment required' });
    }

    const users = readUsers();
    const user = users.find(u => u.id === req.userId) || { fullName: 'Unknown' };

    const messages = readChat();

    const message = {
      id: Date.now().toString(),
      userId: req.userId,
      userName: user.fullName || user.studentId || 'Student',
      text: text || null,
      attachment: null,
      replyTo: null,
      createdAt: new Date().toISOString()
    };

    if (req.files && req.files.length) {
      const filesMetadata = readFilesMetadata();
      message.attachments = [];
      req.files.forEach(f => {
        const fileEntry = {
          id: Date.now().toString() + '-att-' + Math.floor(Math.random() * 1000),
          filename: f.filename,
          originalName: f.originalname,
          fileType: 'chat-attachment',
          description: 'Chat attachment',
          course: null,
          semester: null,
          uploadedBy: req.userId,
          uploadedAt: new Date().toISOString(),
          size: f.size,
          path: f.path
        };
        filesMetadata.push(fileEntry);
        message.attachments.push({ id: fileEntry.id, filename: fileEntry.filename, originalName: fileEntry.originalName, path: fileEntry.path });
      });
      writeFilesMetadata(filesMetadata);
    }

    // If this message is a reply, attach a small summary of the replied message
    if (replyTo) {
      const messagesExisting = readChat();
      const target = messagesExisting.find(m => m.id === replyTo);
      if (target) {
        message.replyTo = {
          id: target.id,
          userName: target.userName,
          text: target.text
        };
      }
    }

    messages.push(message);
    writeChat(messages);

    res.status(201).json({ message: 'Message posted', data: message });
  } catch (err) {
    res.status(500).json({ message: 'Error posting message', error: err.message });
  }
});

// 11. STUDENT SEARCH
app.get('/api/students/search', verifyToken, (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.json([]);

    const users = readUsers();
    const searchResults = users
      .filter(u =>
        u.id !== req.userId && (
          u.fullName.toLowerCase().includes(q.toLowerCase()) ||
          u.studentId.toLowerCase().includes(q.toLowerCase())
        )
      )
      .map(u => ({
        id: u.id,
        fullName: u.fullName,
        studentId: u.studentId,
        campus: u.campus
      }));

    res.json(searchResults);
  } catch (err) {
    res.status(500).json({ message: 'Search error', error: err.message });
  }
});

// 12. GET MY GROUPS
app.get('/api/groups', verifyToken, (req, res) => {
  try {
    const groups = readGroups();
    const myGroups = groups.filter(g =>
      g.isDefault || g.members.includes(req.userId) || g.createdBy === req.userId
    );
    res.json(myGroups);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching groups', error: err.message });
  }
});

// 13. CREATE GROUP
app.post('/api/groups', verifyToken, (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: 'Group name required' });

    const groups = readGroups();
    const newGroup = {
      id: Date.now().toString(),
      name,
      createdBy: req.userId,
      members: [req.userId],
      createdAt: new Date().toISOString()
    };

    groups.push(newGroup);
    writeGroups(groups);

    res.status(201).json(newGroup);
  } catch (err) {
    res.status(500).json({ message: 'Error creating group', error: err.message });
  }
});

// 14. ADD MEMBER TO GROUP
app.post('/api/groups/:groupId/members', verifyToken, (req, res) => {
  try {
    const { userId } = req.body;
    const { groupId } = req.params;

    if (!userId) return res.status(400).json({ message: 'User ID required' });

    const groups = readGroups();
    const groupIndex = groups.findIndex(g => g.id === groupId);

    if (groupIndex === -1) return res.status(404).json({ message: 'Group not found' });

    // Check if requester is member
    if (!groups[groupIndex].isDefault && !groups[groupIndex].members.includes(req.userId)) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    if (!groups[groupIndex].members.includes(userId)) {
      groups[groupIndex].members.push(userId);
      writeGroups(groups);
    }

    res.json({ message: 'Member added successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error adding member', error: err.message });
  }
});

// 15. GET GROUP MESSAGES
app.get('/api/groups/:groupId/messages', verifyToken, (req, res) => {
  try {
    const { groupId } = req.params;
    const messages = readChat();
    const groupMessages = messages.filter(m => m.groupId === groupId || (!m.groupId && groupId === 'general'));
    res.json(groupMessages);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching messages', error: err.message });
  }
});

// 16. POST MESSAGE TO GROUP
app.post('/api/groups/:groupId/messages', verifyToken, upload.array('attachments', 5), (req, res) => {
  try {
    const { groupId } = req.params;
    const { text, replyTo } = req.body;

    if (!text && (!req.files || req.files.length === 0)) {
      return res.status(400).json({ message: 'Message text or attachment required' });
    }

    const users = readUsers();
    const user = users.find(u => u.id === req.userId) || { fullName: 'Student' };

    const messages = readChat();
    const message = {
      id: Date.now().toString(),
      groupId,
      userId: req.userId,
      userName: user.fullName || user.studentId || 'Student',
      text: text || null,
      attachments: [],
      replyTo: null,
      createdAt: new Date().toISOString()
    };

    if (req.files && req.files.length) {
      const filesMetadata = readFilesMetadata();
      req.files.forEach(f => {
        const fileEntry = {
          id: Date.now().toString() + '-att-' + Math.floor(Math.random() * 1000),
          filename: f.filename,
          originalName: f.originalname,
          fileType: 'chat-attachment',
          description: 'Chat attachment',
          uploadedBy: req.userId,
          uploadedAt: new Date().toISOString(),
          size: f.size,
          path: f.path
        };
        filesMetadata.push(fileEntry);
        message.attachments.push({ id: fileEntry.id, filename: fileEntry.filename, originalName: fileEntry.originalName, path: fileEntry.path });
      });
      writeFilesMetadata(filesMetadata);
    }

    if (replyTo) {
      const target = messages.find(m => m.id === replyTo);
      if (target) {
        message.replyTo = { id: target.id, userName: target.userName, text: target.text };
      }
    }

    messages.push(message);
    writeChat(messages);

    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ message: 'Error posting message', error: err.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`KMTC Bookshop server running on http://localhost:${PORT}`);
});
