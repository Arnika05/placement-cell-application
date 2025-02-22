import { db } from "@/lib/db"
import { auth } from "@clerk/nextjs/server"
import { Job } from "@prisma/client"

type GetJobs = {
    title? : string
    categoryId? : string
    createdAtFilter? : string
    employementType? : string
    jobMode? : string
    eligibleCourses? : string[]
    savedJobs? : boolean
}

export const getJobs = async({
    title, categoryId, createdAtFilter, employementType, jobMode, eligibleCourses, savedJobs 
} : GetJobs): Promise<Job[]> => {
    const { userId } = await auth()

    try {
        //Initialize the query object with common options

        let query : any = {
            where : {
                isPublished : true,
            },
            include : {
                company : true,
                category : true,
                attachments : true
            },
            orderBy : {
                createdAt : "desc"
            }
        }

        //execute the query to fetch the jobs based on constructor parameters
        const jobs = db.job.findMany(query)
        return jobs
    } catch (error) {
        console.log("[GET_JOBS]:", error)
        return[]
    }
}