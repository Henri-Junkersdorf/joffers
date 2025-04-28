import { Button } from "@/components/ui/button";
import JobUploadForm from "@/components/job-upload-form";
import { Metadata } from "next";
import Link from "next/link";
import { getJobs } from "@/lib/db";

export const metadata: Metadata = {
  title: "Company Dashboard | Joffers",
  description: "Manage your job listings",
};

export default async function DashboardPage() {
  // Get the latest 3 jobs for the dashboard preview
  const recentJobs = await getJobs();
  const topJobs = recentJobs.slice(0, 3);
  
  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col space-y-8">
        {/* Dashboard Header */}
        <div className="bg-gradient-to-r from-blue-800 to-indigo-900 rounded-xl shadow-lg p-8 text-white">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold">Company Dashboard</h1>
            <Button 
              asChild 
              className="bg-white text-indigo-700 hover:bg-blue-50"
            >
              <Link href="/dashboard/jobs/new">Create New Job Listing</Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-5 flex items-center">
              <div className="mr-4 bg-white/20 p-3 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="text-blue-100 text-sm">Active Jobs</p>
                <p className="text-2xl font-bold">{recentJobs.filter(job => job.status === 'active').length}</p>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-5 flex items-center">
              <div className="mr-4 bg-white/20 p-3 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <p className="text-blue-100 text-sm">Total Applicants</p>
                <p className="text-2xl font-bold">{recentJobs.reduce((sum, job) => sum + (job.applicants || 0), 0)}</p>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-5 flex items-center">
              <div className="mr-4 bg-white/20 p-3 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-blue-100 text-sm">Processed Applications</p>
                <p className="text-2xl font-bold">0</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <JobUploadForm />
          
          <div className="rounded-lg border bg-white shadow-md overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-700 px-6 py-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-white">Your Active Job Listings</h2>
                {recentJobs.length > 0 && (
                  <Link href="/dashboard/jobs" className="text-xs text-white hover:text-blue-100 underline underline-offset-2">
                    View All
                  </Link>
                )}
              </div>
            </div>
            
            <div className="p-6">
              {topJobs.length > 0 ? (
                <div className="space-y-4">
                  {topJobs.map(job => (
                    <div key={job.id} className="border rounded-lg p-4 hover:bg-gray-50 transition">
                      <div className="flex justify-between items-start">
                        <div>
                          <Link href={`/dashboard/jobs/${job.id}`} className="text-lg font-medium text-blue-800 hover:underline">
                            {job.title}
                          </Link>
                          <p className="text-sm text-gray-600 mt-1">{job.location}</p>
                        </div>
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          job.status === "active"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}>
                          {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center mt-3">
                        <p className="text-xs text-gray-500">Posted on {new Date(job.createdAt).toLocaleDateString()}</p>
                        <div className="flex items-center text-sm">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          <span className="text-blue-600 font-medium">{job.applicants || 0} applicants</span>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {recentJobs.length > 3 && (
                    <Link 
                      href="/dashboard/jobs" 
                      className="block text-center py-3 bg-gray-50 rounded-lg text-indigo-600 font-medium hover:bg-gray-100 transition"
                    >
                      View all {recentJobs.length} job listings
                    </Link>
                  )}
                </div>
              ) : (
                <div className="text-center py-12 px-4">
                  <div className="bg-indigo-50 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-1">No active job listings yet</h3>
                  <p className="text-gray-500 mb-6">Upload a job description or create a new listing to get started.</p>
                  <Button asChild>
                    <Link href="/dashboard/jobs/new">Create Your First Job</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 