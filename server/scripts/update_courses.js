import mongoose from 'mongoose';
import Course from '../models/Course.js';
import dotenv from 'dotenv';

dotenv.config();

const updateCourses = async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/lms`);
        console.log('Connected to DB');
        
        const result = await Course.updateMany({}, { isPublished: true });
        console.log(`Updated ${result.modifiedCount} courses to be published.`);
        
        await mongoose.disconnect();
        console.log('Done');
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

updateCourses();
