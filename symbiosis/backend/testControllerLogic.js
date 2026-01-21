const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Student = require('./models/Student');
const Class = require('./models/Class'); // Ensure Class model is registered
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const testLogic = async () => {
    try {
        console.log('--- MIMIC CONTROLLER ---');
        // This is exactly what the controller does
        const students = await Student.find().populate('class', 'name');
        
        console.log(`Found ${students.length} students.`);
        
        if (students.length > 0) {
            const s = students[0];
            console.log('Sample Student:', s.name);
            console.log('Class Field Type:', typeof s.class);
            console.log('Class Field Value:', s.class);
            
            if (s.class && s.class._id) {
                console.log('Class ID available:', s.class._id);
            } else {
                console.log('Class ID MISSING or Populate Failed');
            }
        } else {
            console.log('No students found.');
        }

        console.log('--- END MIMIC ---');
        process.exit();
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
};

testLogic();
