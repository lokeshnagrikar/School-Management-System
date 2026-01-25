const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Staff = require('./models/Staff');
const Class = require('./models/Class');

dotenv.config();

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

const fixTeacherTwo = async () => {
    await connectDB();

    try {
        const teacherUser = await User.findOne({ email: 'teacher2@school.com' });
        if (!teacherUser) {
            console.log('Teacher Two not found.');
            return;
        }

        const staff = await Staff.findOne({ user: teacherUser._id });
        if (!staff) {
            console.log('Staff profile not found for Teacher Two.');
            return;
        }

        // Find a class
        const cls = await Class.findOne(); // Just pick first class
        if (!cls) {
            console.log('No classes found in DB.');
            return;
        }

        console.log(`Assigning Class '${cls.name}' to Teacher '${teacherUser.name}'...`);

        // Assign as Class Teacher
        // cls.classTeacher = staff._id;
        // await cls.save();
        
        // OR Assign as Subject Teacher (preferred for testing list)
        staff.assignedSubjects.push({
            class: cls._id,
            // subject: someSubjectId (optional if schema allows null, but schema refs Subject)
            // Let's check schema: subject is ref ObjectId.
        });

        // Need a subject
        const Subject = require('./models/Subject');
        const sub = await Subject.findOne();
        if (sub) {
             staff.assignedSubjects[0] = { // Overwrite or push
                 class: cls._id,
                 subject: sub._id
             };
             await staff.save();
             console.log('Success! Class assigned.');
        } else {
            console.log('No subjects found. Cannot assign subject.');
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        process.exit();
    }
};

fixTeacherTwo();
