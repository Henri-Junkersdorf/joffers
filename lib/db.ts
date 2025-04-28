/**
 * This file contains database functions for storing and retrieving job listings
 * using MongoDB as the data source
 */
import connectToDatabase from './mongodb';
import JobModel, { IJob } from '../models/Job';
import mongoose from 'mongoose';

// Define the Job type for client usage
export interface Job {
  id?: string;
  title: string;
  company: string;
  location: string;
  salary?: string;
  description: string;
  requirements: string[];
  benefits: string[];
  status: 'active' | 'closed';
  createdAt: string;
  applicants?: number;
}

// Helper function to convert MongoDB document to client Job
function convertDocToJob(doc: mongoose.Document<unknown, {}, IJob> & IJob): Job {
  return {
    id: doc._id.toString(),
    title: doc.title,
    company: doc.company,
    location: doc.location,
    salary: doc.salary,
    description: doc.description,
    requirements: doc.requirements,
    benefits: doc.benefits,
    status: doc.status,
    createdAt: doc.createdAt.toISOString(),
    applicants: doc.applicants || 0
  };
}

// Get all jobs for a company
export async function getJobs(): Promise<Job[]> {
  await connectToDatabase();
  
  const jobs = await JobModel.find({})
    .sort({ createdAt: -1 })
    .lean();
  
  return jobs.map((job) => ({
    id: job._id.toString(),
    title: job.title,
    company: job.company,
    location: job.location,
    salary: job.salary,
    description: job.description,
    requirements: job.requirements,
    benefits: job.benefits,
    status: job.status,
    createdAt: job.createdAt.toISOString(),
    applicants: job.applicants || 0
  }));
}

// Get a specific job by ID
export async function getJobById(id: string): Promise<Job | null> {
  await connectToDatabase();
  
  const job = await JobModel.findById(id).lean();
  
  if (!job) return null;
  
  return {
    id: job._id.toString(),
    title: job.title,
    company: job.company,
    location: job.location,
    salary: job.salary,
    description: job.description,
    requirements: job.requirements,
    benefits: job.benefits,
    status: job.status,
    createdAt: job.createdAt.toISOString(),
    applicants: job.applicants || 0
  };
}

// Create a new job
export async function createJob(jobData: Omit<Job, 'id' | 'status' | 'applicants'>): Promise<Job> {
  await connectToDatabase();
  
  const newJob = new JobModel({
    ...jobData,
    status: 'active',
    applicants: 0
  });
  
  const savedJob = await newJob.save();
  
  return convertDocToJob(savedJob);
}

// Update a job
export async function updateJob(id: string, jobData: Partial<Job>): Promise<Job | null> {
  await connectToDatabase();
  
  const updatedJob = await JobModel.findByIdAndUpdate(
    id,
    { ...jobData },
    { new: true, runValidators: true }
  );
  
  if (!updatedJob) return null;
  
  return convertDocToJob(updatedJob);
}

// Delete a job
export async function deleteJob(id: string): Promise<boolean> {
  await connectToDatabase();
  
  const result = await JobModel.deleteOne({ _id: id });
  return result.deletedCount === 1;
} 