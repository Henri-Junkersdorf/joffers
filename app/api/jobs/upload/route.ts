import { NextRequest, NextResponse } from "next/server";
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { createJob } from "@/lib/db";
import { OpenAI } from "openai";

// Manual import approach for pdf-parse to avoid test file lookup
const pdfParse = require('pdf-parse/lib/pdf-parse.js');

export const maxDuration = 60; // Increase max duration to 60 seconds

export async function POST(request: NextRequest) {
  try {
    // Check if admin API key is set - clean it to remove any whitespace or line breaks
    const apiKey = process.env.ADMIN_OPENAI_API_KEY?.replace(/\s+/g, '');
    if (!apiKey) {
      console.error("Admin OpenAI API Key not set in environment");
      return NextResponse.json(
        { error: "The administrator has not configured an OpenAI API key" },
        { status: 500 }
      );
    }
    
    // Initialize OpenAI client
    const openai = new OpenAI({
      apiKey: apiKey,
    });
    
    // Parse multipart form data
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const model = formData.get("model") as string;

    // Check for required fields
    if (!file) {
      console.log("Error: No file provided");
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    // Check if file is a PDF
    if (!file.type.includes("application/pdf")) {
      console.log(`Error: Invalid file type: ${file.type}`);
      return NextResponse.json(
        { error: "File must be a PDF" },
        { status: 400 }
      );
    }

    // Check file size (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      console.log(`Error: File too large: ${file.size} bytes`);
      return NextResponse.json(
        { error: "File size exceeds 10MB limit" },
        { status: 400 }
      );
    }

    // Process the PDF file
    console.log(`Processing PDF: ${file.name} (${(file.size / 1024).toFixed(2)} KB)`);
    
    // Convert File object to Buffer for pdf-parse
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Extract text from PDF
    let rawText;
    try {
      // Use a try/catch block specifically for PDF parsing
      const pdfData = await pdfParse(buffer, {
        // Skip rendering - just extract text
        max: 0,
        version: 'default'
      });
      rawText = pdfData.text;
      
      if (!rawText || rawText.trim().length < 50) {
        console.log("Error: PDF contains insufficient text");
        return NextResponse.json(
          { error: "The PDF contains insufficient text content to process" },
          { status: 400 }
        );
      }
      
      console.log(`Successfully extracted ${rawText.length} characters from PDF`);
    } catch (pdfError) {
      console.error("Failed to parse PDF:", pdfError);
      return NextResponse.json(
        { error: "Failed to extract text from PDF. The file may be corrupted or password-protected." },
        { status: 500 }
      );
    }
    
    // Verify it's job-related content (with a more lenient approach)
    try {
      const classify = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a classifier for employment-related documents. Be inclusive and lenient in your classification.',
          },
          {
            role: 'user',
            content: `Is the following text related to a job, employment, hiring, or any kind of work opportunity? Consider job listings, job offers, employment contracts, hiring plans, job descriptions, or any document that describes a position someone might fill. Be lenient - if it's even remotely related to employment or hiring, answer YES. Reply with exactly "YES" or "NO".\n\n${rawText.slice(0, 2000)}`,
          },
        ],
      });

      const answer = classify.choices[0].message.content?.trim().toUpperCase();
      if (answer !== 'YES') {
        console.log("Error: Not recognized as job-related content");
        return NextResponse.json(
          { error: "The PDF does not appear to be related to a job or employment opportunity" },
          { status: 400 }
        );
      }
    } catch (classifyError) {
      console.error("Error during classification:", classifyError);
      // Continue even if classification fails - being lenient
      console.log("Continuing despite classification error to be lenient");
    }

    // Extract structured data via function-calling
    let extractedJobData;
    try {
      // Use a valid OpenAI model - default to gpt-3.5-turbo if not specified
      const modelToUse = model?.includes('gpt-4') ? 
        'gpt-4-0125-preview' : 'gpt-3.5-turbo-0125';
        
      console.log(`Using OpenAI model: ${modelToUse}`);
      
      const extraction = await openai.chat.completions.create({
        model: modelToUse,
        messages: [
          {
            role: 'system',
            content: 'You extract job posting details into JSON. Be thorough and look for all required fields, especially job location. If location is not explicitly stated, infer it from the context or use "Remote" as default.',
          },
          { 
            role: 'user', 
            content: `Extract job information from this PDF text into a structured format. Make sure to identify or infer the job location - this is a REQUIRED field. If location is not explicitly stated, look for clues like office addresses, city names, or phrases like "remote work" or "work from home". If truly no location information can be found, use "Remote" as the default.\n\n${rawText}` 
          },
        ],
        functions: [
          {
            name: 'extract_job_listing',
            description: 'Returns structured job listing info',
            parameters: {
              type: 'object',
              properties: {
                title: { type: 'string', description: 'Job title' },
                company: { type: 'string' },
                location: { type: 'string' },
                salary: { type: 'string', description: 'Salary or range' },
                description: {
                  type: 'string',
                  description: 'Short summary of role',
                },
                requirements: {
                  type: 'array',
                  items: { type: 'string' },
                  description: 'List of job requirements or qualifications',
                },
                benefits: {
                  type: 'array',
                  items: { type: 'string' },
                  description: 'List of job benefits',
                },
              },
              required: ['title', 'company'],
            },
          },
        ],
        function_call: { name: 'extract_job_listing' },
      });

      if (!extraction.choices[0].message.function_call?.arguments) {
        throw new Error("Failed to extract job information");
      }

      extractedJobData = JSON.parse(
        extraction.choices[0].message.function_call.arguments
      );
      
      console.log('Successfully extracted job data:', {
        title: extractedJobData.title,
        company: extractedJobData.company
      });
    } catch (aiError) {
      console.error("Failed to extract job information:", aiError);
      return NextResponse.json(
        { error: "Failed to analyze job information with AI. Please try again." },
        { status: 500 }
      );
    }
    
    if (!extractedJobData || !extractedJobData.title) {
      console.log("Error: Could not extract job title");
      return NextResponse.json(
        { error: "Could not extract job title from PDF" },
        { status: 400 }
      );
    }

    // Store in database
    let job;
    try {
      // Ensure location has a default value if not provided
      if (!extractedJobData.location) {
        extractedJobData.location = 'Remote'; // Default location if not detected
        console.log('Location not detected in PDF, defaulting to "Remote"');
      }
      
      job = await createJob({
        ...extractedJobData,
        createdAt: new Date().toISOString()
      });
    } catch (dbError) {
      console.error("Database error:", dbError);
      return NextResponse.json(
        { error: "Failed to save job to database" },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ 
      message: "Job description processed successfully",
      job
    });
    
  } catch (error) {
    console.error("Error processing job description:", error);
    
    // Return appropriate error based on type
    if (error instanceof TypeError && error.message.includes('fetch')) {
      return NextResponse.json(
        { error: "Error connecting to OpenAI service. Please check internet connection." },
        { status: 503 }
      );
    }
    
    if (error instanceof Error && error.message.includes('timeout')) {
      return NextResponse.json(
        { error: "Processing took too long. Please try again with a simpler PDF." },
        { status: 408 }
      );
    }
    
    // Generic error message
    return NextResponse.json(
      { error: "Error processing job description. Please try again." },
      { status: 500 }
    );
  }
} 