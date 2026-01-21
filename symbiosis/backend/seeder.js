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
    console.log('Created Admin: admin@isbm.com / adminpassword');

    // Create Sample Subjects
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
    
    // Insert Classes and store result to link students/staff later if needed
    const createdClasses = await Class.insertMany(classesToCreate);
    const grade10 = createdClasses.find(c => c.name === 'Grade 10');

    // --- Create Dummy Staff (Teachers) ---
    const staffData = [
        { name: 'Teacher One', email: 'teacher1@school.com', position: 'Teacher', bio: 'Math Teacher' },
        { name: 'Teacher Two', email: 'teacher2@school.com', position: 'Teacher', bio: 'English Teacher' },
    ];


    for (const staff of staffData) {
        // Create User for Staff
        const staffUser = await User.create({
            name: staff.name,
            email: staff.email,
            password: 'password123',
            role: 'TEACHER'
        });

        // Create Staff Profile
        await Staff.create({
            user: staffUser._id,
            name: staff.name,
            email: staff.email,
            position: staff.position,
            bio: staff.bio,
            isTeacher: true
        });
        console.log(`Created Staff: ${staff.name} / password123`);
    }

    // --- Create Dummy Students (Grade 10) ---
    if (grade10) {
        const studentData = [
            { name: 'Aarav Patel', email: 'aarav@student.com' },
            { name: 'Vivaan Singh', email: 'vivaan@student.com' },
            { name: 'Aditya Sharma', email: 'aditya@student.com' },
            { name: 'Vihaan Gupta', email: 'vihaan@student.com' },
            { name: 'Arjun Kumar', email: 'arjun@student.com' }
        ];

        for (let i = 0; i < studentData.length; i++) {
            const s = studentData[i];
            
            // Create User for Student
            const studentUser = await User.create({
                name: s.name,
                email: s.email,
                password: 'password123',
                role: 'STUDENT'
            });

            // Create Student Profile
            await Student.create({
                user: studentUser._id,
                name: s.name,
                email: s.email,
                admissionNumber: `ADM10-${String(i+1).padStart(3, '0')}`,
                class: grade10._id,
                section: 'A',
                phone: '1234567890',
                parentName: 'Parent of ' + s.name
            });
            console.log(`Created Grade 10 Student: ${s.name}`);
        }
    }

    // --- Create Dummy Students (Grade 1) ---
    const grade1 = createdClasses.find(c => c.name === 'Grade 1');
    if (grade1) {
        const g1Students = [
            { name: 'Ishaan Verma', email: 'ishaan@student.com' },
            { name: 'Mira Nair', email: 'mira@student.com' },
            { name: 'Rohan Mehra', email: 'rohan@student.com' }
        ];

        for (let i = 0; i < g1Students.length; i++) {
            const s = g1Students[i];
            
             // Create User for Student
             const studentUser = await User.create({
                name: s.name,
                email: s.email,
                password: 'password123',
                role: 'STUDENT'
            });

            await Student.create({
                user: studentUser._id,
                name: s.name,
                email: s.email,
                admissionNumber: `ADM01-${String(i+1).padStart(3, '0')}`,
                class: grade1._id,
                section: 'A',
                phone: '9876543210',
                parentName: 'Parent of ' + s.name
            });
            console.log(`Created Grade 1 Student: ${s.name}`);
        }
    }

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
