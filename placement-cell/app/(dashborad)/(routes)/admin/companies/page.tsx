import { Button } from '@/components/ui/button'
import { db } from '@/lib/db'
import { auth } from '@clerk/nextjs/server'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import React from 'react'
import { columns, CompanyColumns } from './_components/columns'
import { format } from 'date-fns'
import { DataTable } from '@/components/ui/data-table'

const CompaniesOverviewPage = async() => {

  const {userId} = await auth();
  if(!userId){
    return redirect("/")
  }
  const companies = await db.company.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    }
  })
  const formattedCompanies : CompanyColumns[] = companies.map(company => ({
    id: company.id,
    name: company.name? company.name : "",
    logo: company.logo? company.logo : "",
    createdAt: company.createdAt
    ? format(new Date(company.createdAt), "MMMM do, yyyy") 
    : "N/A"
  }))

  return (
    <div className="p-6">
            {/* Header Section */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold text-gray-700">Company Listings</h1>
                <Link href="/admin/companies/create">
                    <Button className="bg-blue-600 text-white hover:bg-blue-700 transition-all rounded-lg shadow-md px-4 py-2 flex items-center gap-2">
                        <Plus className="w-5 h-5" />
                        <span>New Company</span>
                    </Button>
                </Link>
            </div>

            {/* Job List Container */}
            <div className="bg-white shadow-md rounded-lg p-6">
                <DataTable columns={columns} data={formattedCompanies} searchKey="name" />
            </div>
        </div>
  )
}

export default CompaniesOverviewPage 