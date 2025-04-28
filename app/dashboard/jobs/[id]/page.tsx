import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Metadata } from "next";
import { getJobById } from "@/lib/db";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Job Details | Joffers",
  description: "View and manage job listing details",
};

export default async function JobDetailPage({
  params
}: {
  params: { id: string }
}) {
  // Fetch job data from the database
  const job = await getJobById(params.id);
  
  if (!job) {
    notFound();
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center gap-3 mb-6">
            <Link
              href="/dashboard/jobs"
              className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800 hover:underline underline-offset-4"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Jobs
            </Link>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-gray-900">{job.title}</h1>
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
            </div>
            
            <div className="flex flex-wrap gap-3">
              <Button 
                variant="outline" 
                size="sm" 
                asChild
                className="inline-flex items-center h-9 border-gray-300"
              >
                <Link href={`/dashboard/jobs/${job.id}/edit`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit Job
                </Link>
              </Button>
              
              <Button 
                variant="outline" 
                size="sm" 
                asChild
                className="inline-flex items-center h-9 border-gray-300"
              >
                <Link href={`/jobs/${job.id}`} target="_blank">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  View Public Page
                </Link>
              </Button>
              
              {job.status === "active" ? (
                <Button 
                  size="sm" 
                  variant="destructive"
                  className="inline-flex items-center h-9"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                  </svg>
                  Close Job Listing
                </Button>
              ) : (
                <Button 
                  size="sm" 
                  variant="outline"
                  className="inline-flex items-center h-9 text-green-700 border-green-200 bg-green-50 hover:bg-green-100 hover:border-green-300"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Reopen Job Listing
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Job Details */}
            <div className="rounded-lg border shadow-sm bg-white overflow-hidden">
              <div className="border-b bg-gray-50 px-6 py-4">
                <h2 className="text-lg font-semibold text-gray-900">Job Details</h2>
              </div>
              <div className="p-6">
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-6">
                  <div>
                    <dt className="text-sm font-medium text-gray-500 mb-1">Company</dt>
                    <dd className="text-sm text-gray-900 font-medium">{job.company}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500 mb-1">Location</dt>
                    <dd className="text-sm text-gray-900 font-medium">{job.location}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500 mb-1">Salary Range</dt>
                    <dd className="text-sm text-gray-900 font-medium">{job.salary || 'Not specified'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500 mb-1">Posted Date</dt>
                    <dd className="text-sm text-gray-900 font-medium">{new Date(job.createdAt).toLocaleDateString()}</dd>
                  </div>
                </dl>
              </div>
            </div>

            {/* Job Description */}
            <div className="rounded-lg border shadow-sm bg-white overflow-hidden">
              <div className="border-b bg-gray-50 px-6 py-4">
                <h2 className="text-lg font-semibold text-gray-900">Job Description</h2>
              </div>
              <div className="p-6">
                <p className="text-sm text-gray-700 whitespace-pre-line">{job.description}</p>
              </div>
            </div>

            {/* Requirements */}
            <div className="rounded-lg border shadow-sm bg-white overflow-hidden">
              <div className="border-b bg-gray-50 px-6 py-4">
                <h2 className="text-lg font-semibold text-gray-900">Requirements</h2>
              </div>
              <div className="p-6">
                <ul className="list-disc pl-5 text-sm space-y-2 text-gray-700">
                  {job.requirements.map((requirement, index) => (
                    <li key={index}>{requirement}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Benefits */}
            <div className="rounded-lg border shadow-sm bg-white overflow-hidden">
              <div className="border-b bg-gray-50 px-6 py-4">
                <h2 className="text-lg font-semibold text-gray-900">Benefits</h2>
              </div>
              <div className="p-6">
                <ul className="list-disc pl-5 text-sm space-y-2 text-gray-700">
                  {job.benefits.map((benefit, index) => (
                    <li key={index}>{benefit}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {/* Applicants Card */}
            <div className="rounded-lg border shadow-sm bg-white overflow-hidden">
              <div className="border-b bg-gray-50 px-6 py-4">
                <h2 className="text-lg font-semibold text-gray-900">Applicants</h2>
              </div>
              <div className="p-6">
                <div className="flex flex-col items-center">
                  <div className="mb-4 bg-blue-50 rounded-full p-3 w-16 h-16 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <span className="text-4xl font-bold text-gray-900 mb-1">{job.applicants || 0}</span>
                  <p className="text-sm text-gray-500 mb-6">Total Applicants</p>
                  <Button asChild className="w-full bg-indigo-600 hover:bg-indigo-700">
                    <Link href={`/dashboard/jobs/${job.id}/applicants`}>
                      View All Applicants
                    </Link>
                  </Button>
                </div>
              </div>
            </div>

            {/* Actions Card */}
            <div className="rounded-lg border shadow-sm bg-white overflow-hidden">
              <div className="border-b bg-gray-50 px-6 py-4">
                <h2 className="text-lg font-semibold text-gray-900">Additional Actions</h2>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  <Button className="w-full justify-start" variant="outline" asChild>
                    <Link href="#" className="inline-flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                      </svg>
                      Duplicate Job
                    </Link>
                  </Button>
                  <Button className="w-full justify-start" variant="outline" asChild>
                    <Link href="#" className="inline-flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                      Share Job
                    </Link>
                  </Button>
                  <Button className="w-full justify-start" variant="outline" asChild>
                    <Link href="#" className="inline-flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                      </svg>
                      Download as PDF
                    </Link>
                  </Button>
                </div>
              </div>
            </div>

            {/* Statistics Card */}
            <div className="rounded-lg border shadow-sm bg-white overflow-hidden">
              <div className="border-b bg-gray-50 px-6 py-4">
                <h2 className="text-lg font-semibold text-gray-900">Job Statistics</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Views</span>
                    <span className="text-sm font-medium text-gray-900">243</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Applicants</span>
                    <span className="text-sm font-medium text-gray-900">{job.applicants || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Conversion Rate</span>
                    <span className="text-sm font-medium text-gray-900">{job.applicants ? ((job.applicants / 243) * 100).toFixed(1) : 0}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Days Live</span>
                    <span className="text-sm font-medium text-gray-900">
                      {Math.ceil((new Date().getTime() - new Date(job.createdAt).getTime()) / (1000 * 60 * 60 * 24))}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 