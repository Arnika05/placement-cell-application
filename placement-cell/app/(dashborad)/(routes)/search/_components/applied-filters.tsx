"use client"

import { Button } from '@/components/ui/button'
import { Category } from '@prisma/client'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import React from 'react'

interface AppliedFiltersProps {
    categories: Category[]; // List of all categories
}

export const AppliedFilters: React.FC<AppliedFiltersProps> = ({ categories }) => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // Check if there are no search parameters
    if ([...searchParams.entries()].length === 0) return null;

    // Get search parameters
    const employmentTypeParams = searchParams.get("employmentType");
    const jobModeParams = searchParams.get("jobMode");
    const eligibleCoursesParams = searchParams.get("eligibleCourses");
    const title = searchParams.get("title");
    const categoryIds = searchParams.get("categoryId"); // Get categoryId from searchParams
    

    // Convert categoryIds to actual category names
    const selectedCategories = categoryIds 
        ? categoryIds.split(",").map(id => categories.find(cat => cat.id === id)?.name).filter(Boolean) 
        : [];

    return (
        <>
            <div className='mt-4 flex items-center gap-4 flex-wrap'>

                {/* Title Search */}
                {title && (
                    <span className="text-lg text-gray-700 font-medium text-center">
                        You searched for <span className="text-blue-600">"{title}"</span>
                    </span>
                )}

                {/* Employment Type Filters */}
                {employmentTypeParams &&
                    employmentTypeParams.split(",").map(item => (
                        <Button 
                            type='button'
                            key={item}
                            className='flex items-center gap-x-2 text-neutral-500 px-2 py-1
                            rounded-md bg-blue-50/80 border-blue-200 capitalize cursor-pointer hover:bg-blue-50'
                        >
                            {item}
                        </Button>
                    ))
                }

                {/* Job Mode Filters */}
                {jobModeParams &&
                    jobModeParams.split(",").map(item => (
                        <Button 
                            type='button'
                            key={item}
                            className='flex items-center gap-x-2 text-neutral-500 px-2 py-1
                            rounded-md bg-green-50/80 border-green-200 capitalize cursor-pointer hover:bg-green-50'
                        >
                            {item}
                        </Button>
                    ))
                }

                {/* Eligible Courses Filters
                {eligibleCoursesParams &&
                    eligibleCoursesParams.split(",").map(item => (
                        <Button 
                            type='button'
                            key={item}
                            className='flex items-center gap-x-2 text-neutral-500 px-2 py-1
                            rounded-md bg-yellow-50/80 border-yellow-200 capitalize cursor-pointer hover:bg-yellow-50'
                        >
                            {item}
                        </Button>
                    ))
                } */}

                {/* Selected Categories */}
                {selectedCategories.length > 0 &&
                    selectedCategories.map(category => (
                        <Button 
                            type='button'
                            key={category}
                            className='flex items-center gap-x-2 text-neutral-500 px-2 py-1
                            rounded-md bg-blue-50/80 border-blue-200 capitalize cursor-pointer hover:bg-blue-50'
                        >
                            {category}
                        </Button>
                    ))
                }

            </div>
        </>
    )
}
