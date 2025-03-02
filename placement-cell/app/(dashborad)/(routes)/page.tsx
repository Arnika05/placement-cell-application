import { getJobs } from '@/actions/get-jobs';
import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import React from 'react';
import HomeSearchCategoriesContainer from '../_components/home-screen-categories-container';
import { HomeCompaniesList } from '../_components/home-companies-list';
import { RecommendedJobsList } from '../_components/recommended-jobs-list';
import { Footer } from '@/components/ui/footer';
import HomeSearchContainer from '../_components/home-search-conatiner';

const DashBoardHomePage = async () => {
  const { userId } = await auth();
  const jobs = await getJobs({});

  const categories = await db.category.findMany({
    orderBy: { name: 'asc' }
  });

  const companies = await db.company.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="w-full min-h-screen bg-gray-100 text-gray-900">
      {/* Header Section */}
      <header className="relative bg-gradient-to-r from-blue-400 to-blue-600 text-white py-16 text-center shadow-md rounded-b-2xl">
        <div className="absolute inset-0 bg-black bg-opacity-30 rounded-b-2xl"></div>
        <div className="relative z-10 flex flex-col items-center space-y-2">
          <h1 className="text-5xl font-bold uppercase tracking-wide">Training & Placement Cell</h1>
          <h2 className="text-3xl font-medium">MANIT Bhopal</h2>
          <p className="text-lg font-light">Explore {jobs.length}+ job opportunities from top recruiters!</p>
        </div>
      </header>

      {/* Main Content */}
      <div className="w-full mx-auto px-8 py-8 space-y-12">
        {/* Search Section */}
        <div className="w-full flex justify-center">
          <HomeSearchContainer />
        </div>

        {/* Job Categories */}
        <section className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-2xl font-semibold text-blue-800 mb-4">Explore Job Categories</h3>
          <HomeSearchCategoriesContainer categories={categories} />
        </section>

        {/* Hiring Companies */}
        <section className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-2xl font-semibold text-blue-800 mb-4">Top Hiring Companies</h3>
          <HomeCompaniesList companies={companies} />
        </section>

        {/* Recommended Jobs */}
        <section className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-2xl font-semibold text-blue-800 mb-4">Recommended for You</h3>
          <RecommendedJobsList jobs={jobs.slice(0, 6)} userId={userId} />
        </section>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default DashBoardHomePage;