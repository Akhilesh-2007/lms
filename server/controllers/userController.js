import { clerkClient, getAuth } from "@clerk/express"
import User from "../models/User.js"
import Course from "../models/Course.js"
import {Purchase} from "../models/Purchase.js"
import {CourseProgress} from "../models/CourseProgress.js"
import Stripe from 'stripe';
const syncUserFromClerk = async (userId) => {
    let user = await User.findById(userId)

    if (user) {
        return user
    }

    const clerkUser = await clerkClient.users.getUser(userId)

    user = await User.create({
        _id: clerkUser.id,
        name: [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ").trim() || "User",
        email: clerkUser.emailAddresses?.[0]?.emailAddress || `${clerkUser.id}@placeholder.local`,
        imageUrl: clerkUser.imageUrl || "https://via.placeholder.com/150",
    })

    return user
}

export const getUserData = async (req, res) => {
    try {
        const { userId } = getAuth(req)

        if (!userId) {
            return res.status(401).json({ success: false, message: "User not authenticated" })
        }

        const user = await syncUserFromClerk(userId)

        res.json({ success: true, user })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

export const userEnrolledCourses = async (req, res) => {
    try {
        const { userId } = getAuth(req)

        if (!userId) {
            return res.status(401).json({ success: false, message: "User not authenticated" })
        }

        const userData = await syncUserFromClerk(userId)

        if (!userData) {
            return res.status(404).json({ success: false, message: "User not found" })
        }

        // 1. Find courses referenced in User.enrolledCourses
        const userDocCourses = userData.enrolledCourses?.length > 0 
            ? await Course.find({ _id: { $in: userData.enrolledCourses } }) 
            : []

        // 2. Find courses where user ID is in Course.enrolledStudents
        const coursesFromEnrolled = await Course.find({ enrolledStudents: userId })

        // 3. Find completed purchases for this user
        const completedPurchases = await Purchase.find({ userId, status: 'completed' })
        const purchaseCourseIds = completedPurchases.map(p => p.courseId)
        const coursesFromPurchases = await Course.find({ _id: { $in: purchaseCourseIds } })

        // Merge and deduplicate by course._id
        const courseMap = new Map()
        
        userDocCourses.forEach(course => {
            if (course) courseMap.set(course._id.toString(), course)
        })
        coursesFromEnrolled.forEach(course => {
            if (course) courseMap.set(course._id.toString(), course)
        })
        coursesFromPurchases.forEach(course => {
            if (course) courseMap.set(course._id.toString(), course)
        })

        const allEnrolledCourses = Array.from(courseMap.values())

        // Auto-sync User document so User.enrolledCourses stays updated in MongoDB
        const allCourseIds = allEnrolledCourses.map(c => c._id)
        if (allCourseIds.length !== (userData.enrolledCourses?.length || 0)) {
            userData.enrolledCourses = allCourseIds
            await userData.save()
        }

        res.json({ success: true, enrolledCourses: allEnrolledCourses })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

//purchase course
export const purchaseCourse=async(req,res)=>{
    try {
        const {courseId}=req.body
        const {origin}=req.headers
        const { userId } = getAuth(req)

        if (!userId) {
            return res.status(401).json({ success: false, message: "User not authenticated" })
        }

        if (!courseId) {
            return res.status(400).json({ success: false, message: "Course ID is required" })
        }

        const userData=await syncUserFromClerk(userId)
        const courseData=await Course.findById(courseId)

        if(!userData || !courseData){
            return res.status(404).json({ success: false, message: "User or course not found" })
        }

        const finalAmount = Number(
            (Number(courseData.coursePrice) - (courseData.discount * Number(courseData.coursePrice) / 100)).toFixed(2)
        )

        const purchaseData={
            courseId:courseData._id,
            userId,
            amount: finalAmount,
        }
        const newPurchase=await Purchase.create(purchaseData)
        //Stripe Gateway integration will be here 
        if (!process.env.STRIPE_SECRET_KEY) {
            return res.status(500).json({ success: false, message: "STRIPE_SECRET_KEY is not configured" })
        }

        const stripeInstance=new Stripe(process.env.STRIPE_SECRET_KEY)
        const currency = (process.env.CURRENCY || process.env.CURRECNY || 'usd').toLowerCase()
        
        //Creating line items to for Stripe
        const line_items=[
            {
                price_data:{
                    currency,
                    product_data:{
                        name:courseData.courseTitle,
                        description:courseData.courseDescription,
                    },
                    unit_amount:Math.round(newPurchase.amount * 100)
                },
                quantity:1
            }
        ]
        const session=await stripeInstance.checkout.sessions.create({
            payment_method_types:['card'],
            line_items:line_items,
            mode:'payment',
            success_url:`${origin || process.env.CLIENT_URL}/loading/my-enrollments`,
            cancel_url:`${origin || process.env.CLIENT_URL}`,
            metadata:{
                purchaseId:newPurchase._id.toString(),
            }
        })
        res.json({success:true,session_url:session.url})
    } catch (error) {
        res.status(500).json({success:false,message:error.message})
    }
}

//Update User Course Progress
export const updateUserCourseProgress=async(req,res)=>{
    try {
        const {userId} = getAuth(req)
        const {courseId,lectureId}=req.body
        const progressData=await CourseProgress.findOne({userId,courseId})

        if(progressData){
            if(progressData.lectureCompleted.includes(lectureId)){
                return res.json({success:true,message:"Lecture already marked as completed"})
            }
            progressData.lectureCompleted.push(lectureId)
            await progressData.save()
        }else{
            await CourseProgress.create({
                userId,
                courseId,
                lectureCompleted:[lectureId]
            })
        }
        res.json({success:true,message:"Progress updated successfully"})
    } catch (error) {
        res.status(500).json({success:false,message:error.message})
    }
}

//get User Course Progress
export const getUserCourseProgress=async(req,res)=>{
    try {
        const {userId} = getAuth(req)
        const {courseId}=req.body
        const progressData=await CourseProgress.findOne({userId,courseId})
        res.json({success:true,progressData})
    } catch (error) {
        res.status(500).json({success:false,message:error.message})
    }
}

//Add user ratings to course
export const addUserRating=async(req,res)=>{
        try {
            const {userId} = getAuth(req)
            const {courseId,rating}=req.body

            if(!courseId || !userId||!rating||rating<1||rating>5){
                return res.status(400).json({success:false,message:"Invalid input data"})
            }

            const course=await Course.findById(courseId);

            if(!course){
                return res.status(404).json({success:false,message:"Course not found"})
            }

            const user=await User.findById(userId);
            if(!user||!user.enrolledCourses.includes(courseId)){
                return res.status(403).json({success:false,message:"User has not enrolled in this course"})
            }

            const existingRatingIndex=course.courseRatings.findIndex(r=>r.userId.toString()===userId.toString())
            if(existingRatingIndex>-1){
                course.courseRatings[existingRatingIndex].rating=rating
            }else{
                course.courseRatings.push({userId,rating})
            }
            await course.save()
            res.json({success:true,message:"Rating added/updated successfully"})
        } catch (error) {
            res.status(500).json({success:false,message:error.message})
        }
}










const extractKeywords = (text) => {
    if (!text) return []
    const stopWords = ['the', 'and', 'to', 'of', 'a', 'in', 'is', 'for', 'with', 'on', 'this', 'that', 'you', 'will', 'learn', 'course', 'from', 'be', 'are', 'as', 'your', 'can', 'or', 'it', 'not', 'but', 'have', 'has', 'what', 'how', 'when', 'where', 'why']
    return text.toLowerCase()
        .replace(/[^a-z0-9\s]/g, '')
        .split(/\s+/)
        .filter(word => word.length > 2 && !stopWords.includes(word))
}

const calculateCourseScore = (course, enrolledCourses, userPreferences) => {
    let score = 0
    
    const price = parseFloat(course.coursePrice) || 0
    const avgPrice = enrolledCourses.length > 0 
        ? enrolledCourses.reduce((sum, c) => sum + (parseFloat(c.coursePrice) || 0), 0) / enrolledCourses.length 
        : 1000
    
    const enrolledKeywords = new Set()
    enrolledCourses.forEach(c => {
        extractKeywords(c.courseTitle).forEach(k => enrolledKeywords.add(k))
        extractKeywords(c.courseDescription).forEach(k => enrolledKeywords.add(k))
    })
    
    const courseKeywords = new Set([
        ...extractKeywords(course.courseTitle),
        ...extractKeywords(course.courseDescription)
    ])
    
    let keywordMatch = 0
    if (enrolledKeywords.size > 0) {
        courseKeywords.forEach(k => {
            if (enrolledKeywords.has(k)) keywordMatch++
        })
        keywordMatch = keywordMatch / Math.max(courseKeywords.size, 1)
    }
    score += keywordMatch * 35
    
    if (enrolledCourses.length > 0) {
        const avgRating = enrolledCourses.reduce((sum, c) => {
            const ratings = c.courseRatings || []
            return sum + (ratings.length > 0 ? ratings.reduce((s, r) => s + r.rating, 0) / ratings.length : 0)
        }, 0) / enrolledCourses.length
        const courseRating = course.courseRatings?.length > 0 
            ? course.courseRatings.reduce((s, r) => s + r.rating, 0) / course.courseRatings.length 
            : 0
        score += (courseRating / 5) * 20
    } else {
        score += (course.courseRatings?.length || 0) * 4
    }
    
    const priceDiff = Math.abs(price - avgPrice) / Math.max(avgPrice, 1)
    score += (1 - Math.min(priceDiff, 1)) * 15
    
    score += Math.min((course.enrolledStudents?.length || 0) / 10, 1) * 15
    
    score += (course.isPublished ? 1 : 0) * 15
    
    return score
}

export const getCourseRecommendations = async (req, res) => {
    try {
        const { userId } = getAuth(req)
        
        if (!userId) {
            return res.status(401).json({ success: false, message: "User not authenticated" })
        }

        await syncUserFromClerk(userId)
        
        const userData = await User.findById(userId)
        const enrolledCourses = userData?.enrolledCourses 
            ? await Course.find({ _id: { $in: userData.enrolledCourses } }) 
            : []
        
        const allCourses = await Course.find({ isPublished: true })
        
        const enrolledIds = new Set(enrolledCourses.map(c => c._id.toString()))
        
        const scoredCourses = allCourses
            .filter(c => !enrolledIds.has(c._id.toString()))
            .map(course => ({
                ...course.toObject(),
                recommendationScore: calculateCourseScore(course, enrolledCourses, {})
            }))
            .sort((a, b) => b.recommendationScore - a.recommendationScore)
            .slice(0, 6)

        res.json({ success: true, recommendations: scoredCourses })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}
