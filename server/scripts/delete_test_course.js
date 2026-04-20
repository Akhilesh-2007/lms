import mongoose from 'mongoose';
import Course from '../models/Course.js';
import dotenv from 'dotenv';

dotenv.config();

const deleteCourse = async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/lms`);
        console.log('Connected to DB');
        
        const course = await Course.findOne({ courseTitle: /test/i });
        if (course) {
            console.log(`Found course: "${course.courseTitle}" (ID: ${course._id})`);
            await Course.findByIdAndDelete(course._id);
            console.log('Course deleted successfully.');
        } else {
            console.log('No test course found.');
        }
        
        await mongoose.disconnect();
        console.log('Done');
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

deleteCourse();
