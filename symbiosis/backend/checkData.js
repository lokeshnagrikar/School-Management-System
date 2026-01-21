const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Student = require('./models/Student');
const Enquiry = require('./models/Enquiry');
const Class = require('./models/Class'); // Ensure Class model is registered
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const run = async () => {
    try {
        const studentCount = await Student.countDocuments();
        const enquiryCount = await Enquiry.countDocuments();

        console.log('--- DATA CHECK ---');
        console.log(`STUDENT COUNT: ${studentCount}`);
        console.log(`ENQUIRY COUNT: ${enquiryCount}`);
        
        if (studentCount > 0) {
            try {
                const one = await Student.findOne().populate('class');
                console.log(`Sample Student: ${one.name}`);
                console.log(`Sample Student Class: ${one.class ? one.class.name : 'None (or failed to populate)'}`);
            } catch (err) {
                 console.log('Error populating student class:', err.message);
            }
        }
        
        if (enquiryCount > 0) {
             const enq = await Enquiry.findOne();
             console.log(`Sample Enquiry: ${enq.studentName}, Status: ${enq.status}`);
        }

        console.log('--- END CHECK ---');
        process.exit();
    } catch (e) {
        console.error('Script Error:', e);
        process.exit(1);
    }
};
run();
