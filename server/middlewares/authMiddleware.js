import { clerkClient, getAuth } from '@clerk/express'

//middleware (protect educator routes)
export const protectEducator=async(req,res,next)=>{
    try {
        const { userId } = getAuth(req)

        if(!userId){
            return res.status(401).json({success:false,message:'User not authenticated'})
        }

        const response=await clerkClient.users.getUser(userId)

        if(response.publicMetadata.role!=='educator'){
            return res.status(403).json({success:false,message:'Unauthorized Access'})
        }
        next()
    } catch (error) {
        res.status(500).json({success:false,message:error.message})
    }
}
