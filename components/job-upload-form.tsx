"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";

export default function JobUploadForm() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [processingStage, setProcessingStage] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [jobData, setJobData] = useState<any | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setUploadError(null);
      setRetryCount(0);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      setUploadError("Please select a PDF file");
      return;
    }

    // Check file size (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      setUploadError("File size exceeds 10MB limit");
      return;
    }

    setIsUploading(true);
    setUploadError(null);
    setProcessingStage("Uploading PDF file...");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("model", "gpt-4-0125-preview");

      // Start the upload
      setProcessingStage("Extracting text from PDF...");
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 second timeout
      
      const response = await fetch("/api/jobs/upload", {
        method: "POST",
        body: formData,
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to upload file");
      }

      setProcessingStage("AI processing complete!");
      const data = await response.json();
      setJobData(data.job);
      setRetryCount(0); // Reset retry count on success
    } catch (error) {
      console.error("Error uploading file:", error);
      
      if (error instanceof DOMException && error.name === 'AbortError') {
        setUploadError("Processing took too long. Please try again or use a different file.");
      } else {
        const errorMessage = error instanceof Error ? error.message : "Failed to upload file";
        setUploadError(errorMessage);
        
        // If it's a temporary error and we haven't retried too many times, suggest retry
        if (
          (errorMessage.includes("service") || 
           errorMessage.includes("timeout") || 
           errorMessage.includes("try again")) && 
          retryCount < 2
        ) {
          setRetryCount(prev => prev + 1);
        }
      }
    } finally {
      setIsUploading(false);
      setProcessingStage(null);
    }
  };

  const handleViewJob = () => {
    if (jobData && jobData.id) {
      router.push(`/dashboard/jobs/${jobData.id}`);
    }
  };

  const handleRetry = () => {
    if (file) {
      handleSubmit(new Event('submit') as any);
    }
  };

  return (
    <Card className="shadow-md overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <CardTitle>Upload Job Description PDF</CardTitle>
        <CardDescription className="text-blue-100">
          Our AI will automatically extract key information and create a job listing for you.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="p-6">
        {jobData ? (
          <div className="mt-2 rounded-lg p-5 bg-green-50 border border-green-200">
            <div className="flex items-center mb-4">
              <div className="bg-green-100 p-2 rounded-full mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="font-semibold text-green-800 text-lg">Job Created Successfully!</h3>
            </div>
            
            <div className="bg-white rounded-md p-4 border border-green-100 mb-4">
              <div className="space-y-4">
                {/* Title Box */}
                <div className="bg-blue-50 rounded-lg p-3 border border-blue-200 shadow-sm">
                  <h3 className="text-blue-700 text-sm font-medium mb-1">Job Title</h3>
                  <p className="text-gray-900 font-semibold">{jobData.title}</p>
                </div>
                
                {/* Company Box */}
                <div className="bg-purple-50 rounded-lg p-3 border border-purple-200 shadow-sm">
                  <h3 className="text-purple-700 text-sm font-medium mb-1">Company</h3>
                  <p className="text-gray-900 font-semibold">{jobData.company}</p>
                </div>
                
                {/* Location Box */}
                <div className="bg-green-50 rounded-lg p-3 border border-green-200 shadow-sm">
                  <h3 className="text-green-700 text-sm font-medium mb-1">Location</h3>
                  <p className="text-gray-900 font-semibold">{jobData.location}</p>
                </div>
                
                {/* Salary Box */}
                {jobData.salary && (
                  <div className="bg-amber-50 rounded-lg p-3 border border-amber-200 shadow-sm">
                    <h3 className="text-amber-700 text-sm font-medium mb-1">Salary</h3>
                    <p className="text-gray-900 font-semibold">{jobData.salary}</p>
                  </div>
                )}
                
                {/* Description Box */}
                {jobData.description && (
                  <div className="bg-indigo-50 rounded-lg p-3 border border-indigo-200 shadow-sm">
                    <h3 className="text-indigo-700 text-sm font-medium mb-1">Description</h3>
                    <p className="text-gray-800">{jobData.description}</p>
                  </div>
                )}
                
                {/* Requirements Box */}
                {jobData.requirements && jobData.requirements.length > 0 && (
                  <div className="bg-rose-50 rounded-lg p-3 border border-rose-200 shadow-sm">
                    <h3 className="text-rose-700 text-sm font-medium mb-2">Requirements</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      {Array.isArray(jobData.requirements) 
                        ? jobData.requirements.map((req: string, i: number) => (
                            <li key={i} className="text-gray-800 text-sm">{req}</li>
                          ))
                        : <li className="text-gray-800 text-sm">{jobData.requirements}</li>
                      }
                    </ul>
                  </div>
                )}
                
                {/* Benefits Box */}
                {jobData.benefits && jobData.benefits.length > 0 && (
                  <div className="bg-teal-50 rounded-lg p-3 border border-teal-200 shadow-sm">
                    <h3 className="text-teal-700 text-sm font-medium mb-2">Benefits</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      {Array.isArray(jobData.benefits) 
                        ? jobData.benefits.map((benefit: string, i: number) => (
                            <li key={i} className="text-gray-800 text-sm">{benefit}</li>
                          ))
                        : <li className="text-gray-800 text-sm">{jobData.benefits}</li>
                      }
                    </ul>
                  </div>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3 mt-4">
              <Button 
                className="w-full bg-indigo-600 hover:bg-indigo-700"
                onClick={handleViewJob}
              >
                View Job Listing
              </Button>
              <Button 
                className="w-full"
                variant="outline"
                onClick={() => {
                  setFile(null);
                  setJobData(null);
                }}
              >
                Upload Another
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="grid gap-5">
            <div className="flex items-center justify-center w-full">
              <Label
                htmlFor="pdf-upload" 
                className={`flex flex-col items-center justify-center w-full h-40 border-2 ${
                  file ? 'border-indigo-300 bg-indigo-50' : 'border-dashed border-gray-300'
                } rounded-lg cursor-pointer hover:bg-gray-50 transition-all duration-200`}
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  {file ? (
                    <>
                      <div className="p-3 rounded-full bg-indigo-100 mb-3">
                        <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <p className="mb-1 text-md font-medium text-indigo-600">{file.name}</p>
                      <p className="text-xs text-gray-500">Click to change file</p>
                    </>
                  ) : (
                    <>
                      <div className="p-3 rounded-full bg-gray-100 mb-3">
                        <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                      </div>
                      <p className="mb-2 text-sm text-gray-700 font-medium">Click to upload or drag and drop</p>
                      <p className="text-xs text-gray-500">PDF (MAX. 10MB)</p>
                    </>
                  )}
                </div>
                <input 
                  id="pdf-upload" 
                  type="file" 
                  accept=".pdf" 
                  className="hidden" 
                  onChange={handleFileChange} 
                  disabled={isUploading}
                />
              </Label>
            </div>
            
            {uploadError && (
              <div className="px-4 py-3 rounded-md bg-red-50 border border-red-200 text-red-800 text-sm">
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2 text-red-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p>{uploadError}</p>
                    {retryCount > 0 && (
                      <p className="text-xs mt-1 text-red-600">
                        Sometimes AI processing can be intermittent. You can try again.
                      </p>
                    )}
                  </div>
                </div>
                {retryCount > 0 && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-2 text-red-600 border-red-300 hover:bg-red-50"
                    onClick={handleRetry}
                  >
                    Retry Processing
                  </Button>
                )}
              </div>
            )}
            
            <div>
              {isUploading ? (
                <div className="w-full">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-medium text-indigo-700">{processingStage}</span>
                    <span className="text-xs font-medium text-indigo-700">Processing...</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-indigo-600 h-2.5 rounded-full animate-pulse w-full"></div>
                  </div>
                  <p className="mt-2 text-xs text-gray-500 text-center">
                    Our AI is analyzing your PDF. This might take a few seconds.
                  </p>
                </div>
              ) : (
                <Button
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded-md transition-colors"
                  disabled={!file || isUploading}
                >
                  <span className="flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Process with AI
                  </span>
                </Button>
              )}
            </div>

            <div className="mt-2 p-4 bg-blue-50 rounded-md border border-blue-100 text-sm text-blue-800">
              <h4 className="font-medium">Tips for best results:</h4>
              <ul className="mt-1 list-disc list-inside space-y-1 text-xs text-blue-700">
                <li>Use PDFs under 10MB in size</li>
                <li>Make sure your PDF contains readable text (not just images)</li>
                <li>Avoid password-protected or encrypted PDFs</li>
                <li>If one file doesn't work, try another with clearer formatting</li>
                <li>Simple job descriptions work best</li>
              </ul>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
} 