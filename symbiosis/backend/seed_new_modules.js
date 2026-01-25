const mongoose = require('mongoose');
const dotenv = require('dotenv');
const colors = require('colors');
const connectDB = require('./config/db');

const Fee = require('./models/Fee');
const Library = require('./models/Library');
const Transport = require('./models/Transport');
const Student = require('./models/Student');

dotenv.config();

connectDB();

const seedNewModules = async () => {
    try {
        await Fee.deleteMany();
        await Library.deleteMany();
        await Transport.deleteMany();
        console.log('Cleared new modules data');

        // --- Library ---
        const books = await Library.insertMany([
            { title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', isbn: '9780743273565', category: 'Fiction', totalCopies: 5, availableCopies: 5, location: 'Shelf A1' },
            { title: 'Clean Code', author: 'Robert C. Martin', isbn: '9780132350884', category: 'Technology', totalCopies: 3, availableCopies: 2, location: 'Shelf B2' },
            { title: 'Introduction to Physics', author: 'Resnick & Halliday', isbn: '9788126510887', category: 'Science', totalCopies: 10, availableCopies: 8, location: 'Shelf C3' }
        ]);
        console.log(`Seeded ${books.length} Books`);

        // --- Transport ---
        const routes = await Transport.insertMany([
            {
                routeName: 'Route 1 - North City',
                vehicleNumber: 'MH-12-AB-1234',
                driverName: 'Ramesh Driver',
                driverPhone: '9988776655',
                routeCharges: 1500,
                capacity: 30,
                stops: [{ stopName: 'City Centre', pickupTime: '7:00 AM', dropTime: '2:00 PM' }, { stopName: 'North Point', pickupTime: '7:30 AM', dropTime: '1:30 PM' }]
            },
            {
                routeName: 'Route 2 - South City',
                vehicleNumber: 'MH-12-CD-5678',
                driverName: 'Suresh Driver',
                driverPhone: '9988776644',
                routeCharges: 1500,
                capacity: 30,
                stops: [{ stopName: 'South Mall', pickupTime: '7:10 AM', dropTime: '2:10 PM' }]
            }
        ]);
        console.log(`Seeded ${routes.length} Transport Routes`);

        // --- Fees ---
        const students = await Student.find({});
        if (students.length > 0) {
            const fees = [];
            students.forEach(student => {
                // Add Tuition Fee
                fees.push({
                    student: student._id,
                    amount: 50000,
                    type: 'Tuition',
                    dueDate: new Date('2025-04-10'),
                    academicYear: '2025-2026',
                    status: 'Pending'
                });
                
                // Add Transport Fee if desired (randomly/selectively)
                if (Math.random() > 0.5) {
                    fees.push({
                        student: student._id,
                        amount: 15000,
                        type: 'Transport',
                        dueDate: new Date('2025-04-10'),
                        academicYear: '2025-2026',
                        status: 'Pending'
                    });
                }
            });
            await Fee.insertMany(fees);
            console.log(`Seeded ${fees.length} Fee Records for ${students.length} Students`);
        } else {
            console.log('No students found to seed fees');
        }

        // --- Teacher / Timetable ---
        const Staff = require('./models/Staff');
        const Class = require('./models/Class');
        const Subject = require('./models/Subject');
        const Timetable = require('./models/Timetable');

        await Timetable.deleteMany();
        
        const teacher = await Staff.findOne({ isTeacher: true });
        const grade10 = await Class.findOne({ name: 'Grade 10' });
        const math = await Subject.findOne({ name: 'Mathematics' });

        if (teacher && grade10 && math) {
            // Assign Subject to Teacher
            teacher.assignedSubjects = [{ subject: math._id, class: grade10._id }];
            await teacher.save();
            console.log(`Assigned Math to ${teacher.name}`);

            // Create Timetable for Today (and others)
            const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
            const todayIndex = new Date().getDay(); // 0 is Sunday
            const todayName = days[todayIndex === 0 ? 6 : todayIndex - 1]; // Adjustment if needed, but getDay() 0=Sun. 
            // My array is Mon-Sun? 
            // Javascript getDay(): 0=Sun, 1=Mon.
            // My Enum in model: ['Monday', 'Tuesday'...]
            
            // Let's just seed Monday to Friday
            for (let day of ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']) {
                await Timetable.create({
                    class: grade10._id,
                    section: 'A',
                    day: day,
                    periods: [
                        { periodNumber: 1, startTime: '09:00', endTime: '10:00', subject: math._id, teacher: teacher._id },
                        { periodNumber: 2, startTime: '10:00', endTime: '11:00', subject: math._id, teacher: teacher._id } // Double math!
                    ]
                });
            }
            console.log('Seeded Timetables for Grade 10-A');
        } else {
            console.log('Skipping Timetable seeding (Missing Staff/Class/Subject)');
        }

        console.log('New Modules Seeded Successfully');
        process.exit();
    } catch (error) {
        console.error(`Error: ${error}`);
        process.exit(1);
    }
};

seedNewModules();
