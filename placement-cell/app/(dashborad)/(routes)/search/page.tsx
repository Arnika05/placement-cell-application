import { getJobs } from "@/actions/get-jobs"
import { SearchContainer } from "@/components/search-container"
import { db } from "@/lib/db"
import { auth } from "@clerk/nextjs/server"
import { CategoriesList } from "./_components/categories-list"
import PageContent from "./_components/page-content"
import { AppliedFilters } from "./_components/applied-filters"

interface SearchProps{
    searchParams : {
        title : string
        categoryId : string
        createdAtFilter : string
        employementType : string
        jobMode : string
        eligibleCourses : string[]
        savedJobs : boolean
    }
}

const SearchPage = async({searchParams} : SearchProps) => {

    const categories = await db.category.findMany({
        orderBy : {
            name : "asc"
        }
    })

    const { userId } = await auth()

    const jobs = await getJobs({...searchParams})

    return (
        <>
        <div className="px-6 pt-6 block md:hidden md:mb-0 justify-center">
          <SearchContainer />
        </div>

        <div className="p-6">
            <CategoriesList categories={categories} />

            <AppliedFilters categories={categories}/>

            <PageContent jobs={jobs} userId={userId}/>
        </div>
        </>
    )
}
 
export default SearchPage;