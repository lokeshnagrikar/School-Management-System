const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const Event = require('./models/Event');

dotenv.config();
connectDB();

const seedEvents = async () => {
    try {
        await Event.deleteMany();

        const events = [
            {
                title: 'Annual Sports Day',
                date: new Date(new Date().setDate(new Date().getDate() + 5)), // 5 days from now
                description: 'Track and field events for all classes.',
                category: 'Sports',
                location: 'School Ground'
            },
            {
                title: 'Science Fair 2026',
                date: new Date(new Date().setDate(new Date().getDate() + 12)),
                description: 'Showcasing innovative projects by Grade 8-12.',
                category: 'Academic',
                location: 'Main Auditorium'
            },
            {
                title: 'Parent-Teacher Meeting',
                date: new Date(new Date().setDate(new Date().getDate() + 18)),
                description: 'Discussion of term 1 results.',
                category: 'Academic',
                location: 'Classrooms'
            },
            {
                title: 'Holi Celebration',
                date: new Date(new Date().setDate(new Date().getDate() + 25)),
                description: 'Cultural gathering and colors.',
                category: 'Cultural',
                location: 'School Courtyard'
            }
        ];

        await Event.insertMany(events);
        console.log('Events Seeded!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

seedEvents();
