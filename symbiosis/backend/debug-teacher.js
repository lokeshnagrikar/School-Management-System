const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Staff = require('./models/Staff');
const Class = require('./models/Class');
const Student = require('./models/Student');

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

const debugAllTeachers = async () => {
    await connectDB();

    try {
        console.log('--- Auditing All Teachers ---');
        const teachers = await User.find({ role: 'TEACHER' });
        console.log(`Found ${teachers.length} Teacher Accounts.\n`);

        for (const teacher of teachers) {
            console.log(`[Teacher]: ${teacher.name} (${teacher.email})`);
            const staff = await Staff.findOne({ user: teacher._id });

            if (!staff) {
                console.log('  ❌ Error: No Staff profile linked!');
                continue;
            }

            const assignedClassIds = staff.assignedSubjects.map(s => s.class);
            const classTeacherFor = await Class.find({ classTeacher: staff._id });
            const classTeacherIds = classTeacherFor.map(c => c._id);
            
            const allClassIds = [...new Set([...assignedClassIds, ...classTeacherIds])];

            if (allClassIds.length === 0) {
                console.log('  ⚠️  Warning: No classes assigned. Student list will be EMPTY.');
            } else {
                console.log(`  ✅ Assigned Classes: ${allClassIds.length}`);
                const studentCount = await Student.countDocuments({ class: { $in: allClassIds } });
                console.log(`  students visible: ${studentCount}`);
            }
            console.log('------------------------------------------------');
        }

    } catch (error) {
        console.error('Debug Error:', error);
    } finally {
        process.exit();
    }
};

debugAllTeachers();
