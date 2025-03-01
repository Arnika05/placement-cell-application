"use client"

import { Company, Job } from "@prisma/client"
import Image from "next/image"
import Link from "next/link"

interface CompanyDetailContentPageProps {
  userId: string | null
  company: Company
  jobs: Job[]
}

export const CompanyDetailContentPage = ({ userId, company, jobs }: CompanyDetailContentPageProps) => {
  return (
    <div className="mt-6 bg-gradient-to-r from-blue-50 to-white p-8 rounded-lg shadow-lg border">
      
      {/* Company Header */}
      <div className="flex flex-col items-center text-center">
        {company.logo && (
          <Image 
            src={company.logo} 
            alt={`${company.name} Logo`} 
            width={80} 
            height={80} 
            className="rounded-full border shadow-md"
          />
        )}
        <h1 className="text-3xl font-extrabold text-gray-900 mt-3">{company.name}</h1>
        {/* <p className="text-gray-600 mt-2">{company.description || "No description available."}</p> */}
      </div>

      {/* Company Details Section */}
      <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Company Information</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column - Social Details */}
          <div className="space-y-3">
            {company.website && (
              <p className="text-gray-700 flex items-center">
                🌐 <Link href={company.website} className="ml-2 text-blue-600 font-medium hover:underline" target="_blank">
                  {company.website}
                </Link>
              </p>
            )}
            {company.email && <p className="text-gray-700">📧 {company.email}</p>}
            {company.linkedIn && (
              <p className="text-gray-700 flex items-center">
                🔗 <Link href={company.linkedIn} className="ml-2 text-blue-600 font-medium hover:underline" target="_blank">
                  LinkedIn
                </Link>
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Overview & Why Join Us Section */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Overview Card */}
        <div className="bg-white p-6 rounded-lg shadow-md border hover:shadow-lg transition">
          <h2 className="text-xl font-semibold text-gray-900">Overview</h2>
          <p className="text-gray-700 mt-2">{company.overview || "Not provided"}</p>
        </div>

        {/* Why Join Us Card */}
        <div className="bg-white p-6 rounded-lg shadow-md border hover:shadow-lg transition">
          <h2 className="text-xl font-semibold text-gray-900">Why Join Us</h2>
          <p className="text-gray-700 mt-2">{company.whyJoinUs || "Not provided"}</p>
        </div>
      </div>

      {/* Job Openings Section */}
      <div className="mt-6">
        <h2 className="text-2xl font-bold text-gray-900 text-center">Job Openings</h2>
        {jobs.length > 0 ? (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <div key={job.id} className="bg-white p-5 rounded-lg shadow-md border hover:shadow-lg transition transform hover:-translate-y-1">
                <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                {/* <p className="text-gray-600 mt-1">{job.short_description || "No job description available."}</p> */}
                <Link href={`/search/${job.id}`} className="text-blue-600 hover:underline mt-3 inline-block font-medium">
                  View Job Details →
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600 mt-4 text-center">No job openings available at the moment.</p>
        )}
      </div>
    </div>
  )
}
