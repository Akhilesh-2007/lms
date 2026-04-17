import express from 'express'
import { getUserData, purchaseCourse, userEnrolledCourses, getCourseRecommendations } from '../controllers/userController.js'

const userRouter=express.Router()

userRouter.get('/data',getUserData)
userRouter.get('/enrolled-courses',userEnrolledCourses)
userRouter.post('/purchase',purchaseCourse)
userRouter.get('/recommendations',getCourseRecommendations)

export default userRouter;
