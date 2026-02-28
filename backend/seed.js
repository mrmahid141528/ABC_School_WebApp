import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import connectDB from './config/db.js';

dotenv.config();

const seedDemoUsers = async () => {
    try {
        await connectDB();

        // Clear existing users testing
        await User.deleteMany({});

        const superAdmin = await User.create({
            name: 'Priyanka Admin',
            mobileNumber: '9999999999',
            role: 'SuperAdmin'
        });

        const parent = await User.create({
            name: 'Ramesh Parent',
            mobileNumber: '8888888888',
            role: 'Parent'
        });

        const teacher = await User.create({
            name: 'Anita Teacher',
            mobileNumber: '7777777777',
            role: 'Teacher',
            assignedClass: '5f8d0a7b2b8e9a1111111111'
        });

        console.log('Demo Users Seeded:');
        console.log('Admin:', superAdmin.mobileNumber);
        console.log('Parent:', parent.mobileNumber);
        console.log('Teacher:', teacher.mobileNumber);

        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

seedDemoUsers();
