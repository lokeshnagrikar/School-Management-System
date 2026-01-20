const mongoose = require('mongoose');
const dotenv = require('dotenv');
const colors = require('colors'); // Optional, but nice for console
const User = require('./models/User');
const Student = require('./models/Student');
const Staff = require('./models/Staff');
const Class = require('./models/Class');
const Subject = require('./models/Subject');
const Notice = require('./models/Notice');
const connectDB = require('./config/db');

dotenv.config();

connectDB();

const importData = async () => {
  try {
    // Clear existing data
    await User.deleteMany();
    await Student.deleteMany();
    await Staff.deleteMany();
    await Class.deleteMany();
    await Subject.deleteMany();
    await Notice.deleteMany();

    // Create Admin User
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@isbm.com',
      password: 'adminpassword', // Will be hashed by pre-save
      role: 'ADMIN',
    });

    // Create Sample Classes
    const subjects = await Subject.insertMany([
        { name: 'Mathematics', code: 'MATH101', description: 'Basic Math' },
        { name: 'English', code: 'ENG101', description: 'Basic English' },
        { name: 'Science', code: 'SCI101', description: 'General Science' },
    ]);

    // Create Classes Grade 1 to 10
    const classesToCreate = [];
    for (let i = 1; i <= 10; i++) {
        classesToCreate.push({
            name: `Grade ${i}`,
            sections: ['A', 'B', 'C'],
            subjects: subjects.map(s => s._id),
        });
    }
    
    await Class.insertMany(classesToCreate);

    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await User.deleteMany();
    await Student.deleteMany();
    await Staff.deleteMany();
    await Class.deleteMany();
    await Subject.deleteMany();
    await Notice.deleteMany();
    
    console.log('Data Destroyed!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
