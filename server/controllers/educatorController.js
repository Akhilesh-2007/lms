import { clerkClient, getAuth } from "@clerk/express"
import Course from "../models/Course.js"
import {v2 as cloudinary} from 'cloudinary'
import { Purchase } from "../models/Purchase.js"
import User from "../models/User.js"


export const updateRoleToEducator = async (req, res) => {
    try {

        const { userId } = getAuth(req)

        console.log("USER ID:", userId)

        if (!userId) {
            return res.json({
                success:false,
                message:"User not authenticated"
            })
        }

        await clerkClient.users.updateUserMetadata(userId,{
            publicMetadata:{
                role:"educator"
            }
        })

        res.json({
            success:true,
            message:"You can publish a course now"
        })

    } catch (error) {
        res.json({
            success:false,
            message:error.message
        })
    }
}

//Add new course
export const addCourse=async(req,res)=>{
    try {
        const {courseData}=req.body
        const imageFile=req.file
        const { userId: educatorId } = getAuth(req)

        if(!educatorId){
            return res.status(401).json({success:false,message:'User not authenticated'})
        }

        if(!imageFile){
            return res.status(400).json({success:false,message:'Thumbnail not attached'})
        }

        if(!courseData){
            return res.status(400).json({success:false,message:'courseData is required'})
        }

        let parsedCourseData
        try {
            parsedCourseData = JSON.parse(courseData)
        } catch {
            return res.status(400).json({success:false,message:'courseData must be valid JSON'})
        }

        parsedCourseData.educator=educatorId
        const newCourse=await Course.create(parsedCourseData)
        const imageUpload=await cloudinary.uploader.upload(imageFile.path)
        newCourse.courseThumbnail=imageUpload.secure_url
        await newCourse.save()

        res.json({success:true,message:'Course Added'})

    } catch (error) {
        res.status(500).json({success:false,message:error.message})
    }
}
//Get Educator Courses
export const getEducatorCourses=async(req,res)=>{
    try {
        const { userId: educator } = getAuth(req)

        if(!educator){
            return res.status(401).json({success:false,message:'User not authenticated'})
        }

        const courses=await Course.find({educator})
        res.json({success:true,courses})
    } catch (error) {
        res.status(500).json({success:false,message:error.message})
    }
}
//Get Educator dashboard data(total earning,enrolled students,no of courses)
export const educatorDashboardData=async(req,res)=>{
    try {
        const { userId: educator } = getAuth(req)

        if(!educator){
            return res.status(401).json({success:false,message:'User not authenticated'})
        }

        const courses=await Course.find({educator});
        const totalCourses=courses.length;

        const courseIds=courses.map(course =>course._id);

        //calculate total earning from purchase
        const purchases=await Purchase.find({
            courseId:{$in:courseIds},
            status:'completed'
        });

        const totalEarnings=purchases.reduce((sum,purchase)=>sum+purchase.amount,0);

        //collect unique enrolled student ids with their course titles
        const enrolledStudentsData=[];
        for(const course of courses){
            const students=await User.find({
                _id:{$in:course.enrolledStudents}
            },'name imageUrl');
            students.forEach(student=>{
                enrolledStudentsData.push({
                    courseTitle:course.courseTitle,
                    student
                });
            });
        }
        res.json({success:true,dashboardData:{
            totalEarnings,enrolledStudentsData,totalCourses
        }})
    } catch (error) {
        res.status(500).json({success:false,message:error.message});
    }
}

//get enrolled students data with purchase data
export const getEnrolledStudentsData = async (req, res) => {
    try {
        const { userId: educator } = getAuth(req);

        if (!educator) {
            return res.status(401).json({ success: false, message: 'User not authenticated' });
        }

        const courses = await Course.find({ educator });
        const courseIds = courses.map(course => course._id);

        const purchases = await Purchase.find({
            courseId: { $in: courseIds },
            status: 'completed'
        }).populate('userId', 'name imageUrl').populate('courseId', 'courseTitle');

        const enrolledStudents = [];
        const processedPairs = new Set();

        // 1. Add students from purchases table
        for (const purchase of purchases) {
            if (purchase.userId && purchase.courseId) {
                const studentId = purchase.userId._id ? purchase.userId._id.toString() : purchase.userId.toString();
                const courseIdStr = purchase.courseId._id ? purchase.courseId._id.toString() : purchase.courseId.toString();
                const pairKey = `${studentId}_${courseIdStr}`;
                processedPairs.add(pairKey);

                enrolledStudents.push({
                    student: typeof purchase.userId === 'object' ? purchase.userId : { name: 'Student', imageUrl: '' },
                    courseTitle: purchase.courseId.courseTitle || 'Course',
                    purchaseDate: purchase.createdAt || new Date()
                });
            }
        }

        // 2. Fallback for any students directly enrolled in course.enrolledStudents
        for (const course of courses) {
            if (course.enrolledStudents && course.enrolledStudents.length > 0) {
                const students = await User.find({
                    _id: { $in: course.enrolledStudents }
                }, 'name imageUrl createdAt');

                for (const student of students) {
                    const pairKey = `${student._id}_${course._id.toString()}`;
                    if (!processedPairs.has(pairKey)) {
                        processedPairs.add(pairKey);
                        enrolledStudents.push({
                            student: {
                                _id: student._id,
                                name: student.name,
                                imageUrl: student.imageUrl
                            },
                            courseTitle: course.courseTitle,
                            purchaseDate: course.updatedAt || student.createdAt || new Date()
                        });
                    }
                }
            }
        }

        res.json({ success: true, enrolledStudents });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}
