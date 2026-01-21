const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Student = require('./models/Student');
const Class = require('./models/Class');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const addDummyStudents = async () => {
    try {
        // 1. Find Grade 10
        const grade10 = await Class.findOne({ name: 'Grade 10' });
        if (!grade10) {
            console.log('Grade 10 not found. Please run seeder first.');
            process.exit();
        }

        console.log(`Found Class: ${grade10.name} (${grade10._id})`);

        // 2. Create 5 Dummy Students
        const students = [
            { name: 'Aarav Patel', email: 'aarav@student.com' },
            { name: 'Vivaan Singh', email: 'vivaan@student.com' },
            { name: 'Aditya Sharma', email: 'aditya@student.com' },
            { name: 'Vihaan Gupta', email: 'vihaan@student.com' },
            { name: 'Arjun Kumar', email: 'arjun@student.com' }
        ];

        for (let i = 0; i < students.length; i++) {
            const s = students[i];
            
            // Check if user exists
            let user = await User.findOne({ email: s.email });
            if (!user) {
                user = await User.create({
                    name: s.name,
                    email: s.email,
                    password: 'password123',
                    role: 'STUDENT'
                });
                console.log(`Created User: ${s.name}`);
            }

            // Check if student profile exists
            const existingProfile = await Student.findOne({ user: user._id });
            if (!existingProfile) {
                await Student.create({
                    user: user._id,
                    name: s.name,
                    email: s.email,
                    admissionNumber: `ADM202400${i+1}`,
                    class: grade10._id,
                    section: 'A',
                    phone: '1234567890',
                    parentName: 'Parent of ' + s.name
                });
                console.log(`Created Student Profile: ${s.name}`);
            }
        }

        console.log('Dummy Students Added Successfully!');
        process.exit();

    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

addDummyStudents();
