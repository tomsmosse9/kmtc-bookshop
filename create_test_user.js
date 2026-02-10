const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

const usersFile = path.join(__dirname, 'data', 'users.json');
const users = JSON.parse(fs.readFileSync(usersFile, 'utf8'));

const password = 'password123';
const hashedPassword = bcrypt.hashSync(password, 10);

const testUser = {
  id: Date.now().toString(),
  studentId: 'TEST001',
  password: hashedPassword,
  fullName: 'Test User',
  email: 'test@kmtc.ac.ke',
  course: 'Information Technology - Diploma',
  campus: 'Nairobi Campus',
  createdAt: new Date().toISOString()
};

// Remove existing test user if any
const existingIndex = users.findIndex(u => u.studentId === 'TEST001');
if (existingIndex !== -1) {
  users.splice(existingIndex, 1);
}

users.push(testUser);
fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));

console.log('Test user created successfully.');
console.log('Student ID: TEST001');
console.log('Password: password123');
