const mongoose = require('mongoose');
const dotenv = require('dotenv');
const colors = require('colors');
const User = require('./models/User');
const Class = require('./models/Class');
const Subject = require('./models/Subject');
const Assignment = require('./models/Assignment');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const seedAssignments = async () => {
    try {
        // Find a Teacher
        const teacherUser = await User.findOne({ role: 'TEACHER' });
        if (!teacherUser) {
            console.log('No Teacher found! Please seed users first.'.red.inverse);
            process.exit(1);
        }

        // Find a Class
        const classObj = await Class.findOne();
        if (!classObj) {
            console.log('No Class found! Please seed classes first.'.red.inverse);
            process.exit(1);
        }

        // Find a Subject
        const subject = await Subject.findOne();
        if (!subject) {
            console.log('No Subject found! Please seed subjects first.'.red.inverse);
            process.exit(1);
        }

        const assignments = [
            {
                title: 'Algebra II - Linear Equations Worksheet',
                description: 'Complete the attached worksheet on linear equations. Focus on problems 10-20.',
                class: classObj._id,
                subject: subject._id,
                deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
                fileUrl: 'https://example.com/worksheet-algebra.pdf',
                teacher: teacherUser._id,
                maxMarks: 50,
                isActive: true
            },
            {
                title: 'History Essay: The Industrial Revolution',
                description: 'Write a 500-word essay discussing the impact of the Industrial Revolution on urban life.',
                class: classObj._id,
                subject: subject._id,
                deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
                fileUrl: 'https://example.com/guide-history.pdf',
                teacher: teacherUser._id,
                maxMarks: 100,
                isActive: true
            },
            {
                title: 'Physics Lab Report: Pendulum Motion',
                description: 'Submit your lab report from yesterday\'s experiment. Include all data tables and graphs.',
                class: classObj._id,
                subject: subject._id,
                deadline: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 day from now
                fileUrl: 'https://example.com/lab-template.pdf',
                teacher: teacherUser._id,
                maxMarks: 30,
                isActive: true
            }
        ];

        await Assignment.deleteMany(); // Optional: Clear existing assignments
        await Assignment.insertMany(assignments);

        console.log('Assignments Seeded Successfully!'.green.inverse);
        process.exit();
    } catch (error) {
        console.error(`${error}`.red.inverse);
        process.exit(1);
    }
};

seedAssignments();
