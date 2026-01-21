const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Student = require('./models/Student');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const run = async () => {
    try {
        const count = await Student.countDocuments();
        console.log('--- DATA CHECK ---');
        console.log(`STUDENT COUNT: ${count}`);
        
        if (count > 0) {
            const one = await Student.findOne().populate('class');
            console.log(`Sample Student Class: ${one.class ? one.class.name : 'None'}`);
        }
        console.log('--- END CHECK ---');
        process.exit();
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
};
run();
