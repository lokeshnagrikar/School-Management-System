const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Gallery = require('./models/Gallery');
const colors = require('colors');

dotenv.config();

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline);
    } catch (error) {
        console.error(`Error: ${error.message}`.red.underline.bold);
        process.exit(1);
    }
};

const images = [
    {
        title: "Annual Sports Day 2024",
        category: "Events",
        imageUrl: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    },
    {
        title: "Science Exhibition",
        category: "Academic",
        imageUrl: "https://images.unsplash.com/photo-1564981797816-1043664bf78d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    },
    {
        title: "Art & Culture Festival",
        category: "Events",
        imageUrl: "https://images.unsplash.com/photo-1544928147-79a2e746b50d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    },
    {
        title: "School Library",
        category: "Facilities",
        imageUrl: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    },
    {
        title: "Graduation Ceremony",
        category: "Events",
        imageUrl: "https://images.unsplash.com/photo-1525921429624-479b6a26d84d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    },
    {
        title: "Classroom Learning",
        category: "Academic",
        imageUrl: "https://images.unsplash.com/photo-1509062522246-3755977927d7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    },
    {
        title: "Football Team",
        category: "Sports",
        imageUrl: "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    },
    {
        title: "Music Room",
        category: "Facilities",
        imageUrl: "https://images.unsplash.com/photo-1514320291940-bf7f85885065?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    }
];

const importData = async () => {
    await connectDB();
    try {
        // Optional: clear existing if you want, or just append. 
        // Clearing is safer for a demo script to avoid duplicates.
        await Gallery.deleteMany();
        
        await Gallery.insertMany(images);

        console.log('Gallery Data Imported!'.green.inverse);
        process.exit();
    } catch (error) {
        console.error(`${error}`.red.inverse);
        process.exit(1);
    }
}

importData();
