import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Metadata } from "next";
import { getJobs } from "@/lib/db";

export const metadata: Metadata = {
  title: "My Jobs | Joffers",
  description: "Manage your job listings",
};

export default async function JobsPage() {
  // Fetch jobs from the database
  const jobListings = await getJobs();
  const activeJobs = jobListings.filter(job => job.status === 'active');
  const closedJobs = jobListings.filter(job => job.status === 'closed');

  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col space-y-8">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Job Listings</h1>
              <p className="text-gray-500 mt-1">Manage your company's job postings</p>
            </div>
            <Button asChild className="bg-indigo-600 hover:bg-indigo-700">
              <Link href="/dashboard/jobs/new">Create New Job</Link>
            </Button>
          </div>

          <div className="flex border-b mb-6">
            <button className="text-sm font-medium text-indigo-600 border-b-2 border-indigo-600 pb-2 px-4">
              All Jobs ({jobListings.length})
            </button>
            <button className="text-sm font-medium text-gray-500 hover:text-gray-700 pb-2 px-4 transition-colors">
              Active ({activeJobs.length})
            </button>
            <button className="text-sm font-medium text-gray-500 hover:text-gray-700 pb-2 px-4 transition-colors">
              Closed ({closedJobs.length})
            </button>
          </div>

          {jobListings.length > 0 ? (
            <div className="overflow-hidden rounded-lg border border-gray-200">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-4 text-left font-medium text-gray-700">Job Title</th>
                    <th className="px-4 py-4 text-left font-medium text-gray-700">Location</th>
                    <th className="px-4 py-4 text-left font-medium text-gray-700">Posted</th>
                    <th className="px-4 py-4 text-left font-medium text-gray-700">Applicants</th>
                    <th className="px-4 py-4 text-left font-medium text-gray-700">Status</th>
                    <th className="px-4 py-4 text-right font-medium text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {jobListings.map((job) => (
                    <tr key={job.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-4">
                        <Link
                          href={`/dashboard/jobs/${job.id}`}
                          className="font-medium text-indigo-600 hover:text-indigo-800 hover:underline"
                        >
                          {job.title}
                        </Link>
                      </td>
                      <td className="px-4 py-4 text-gray-600">
                        <div className="flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          {job.location}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-gray-600">
                        <div className="flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {new Date(job.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center">
                          <span className="inline-flex items-center justify-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            {job.applicants || 0}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            job.status === "active"
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {job.status === "active" ? (
                            <svg className="w-2 h-2 mr-1 fill-current text-green-500" viewBox="0 0 8 8">
                              <circle cx="4" cy="4" r="3" />
                            </svg>
                          ) : (
                            <svg className="w-2 h-2 mr-1 fill-current text-gray-500" viewBox="0 0 8 8">
                              <circle cx="4" cy="4" r="3" />
                            </svg>
                          )}
                          {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm" asChild className="h-8 px-3 text-xs border-gray-300">
                            <Link href={`/dashboard/jobs/${job.id}`}>
                              View
                            </Link>
                          </Button>
                          <Button size="sm" asChild className="h-8 px-3 text-xs bg-indigo-600 hover:bg-indigo-700">
                            <Link href={`/dashboard/jobs/${job.id}/edit`}>
                              Edit
                            </Link>
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-gray-300 p-12">
              <div className="text-center">
                <div className="bg-indigo-50 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">No job listings found</h3>
                <p className="text-gray-500 mb-6 max-w-md mx-auto">Create your first job listing to start attracting the best talent for your company.</p>
                <Button asChild className="bg-indigo-600 hover:bg-indigo-700">
                  <Link href="/dashboard/jobs/new">Create Your First Job</Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 