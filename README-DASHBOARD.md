# Joffers Dashboard

This document describes the company dashboard functionality of the Joffers web application.

## Features

- **Dashboard Home**: Overview of active job listings and quick access to job creation
- **Job PDF Upload**: Companies can upload PDF job descriptions that are processed by AI
- **Manual Job Creation**: Form for manually creating job listings
- **Job Management**: List, view, edit, and close job listings
- **Application Management**: View and manage job applications (placeholder for future)

## File Structure

- `app/dashboard/` - Dashboard pages and routes
  - `page.tsx` - Main dashboard page
  - `layout.tsx` - Dashboard layout with navigation
  - `jobs/` - Job management pages
    - `page.tsx` - Job listings page
    - `new/` - Create job page
    - `[id]/` - Dynamic job detail page
- `components/` - Reusable components
  - `job-upload-form.tsx` - PDF upload component
- `api/` - API routes
  - `jobs/` - Job-related API endpoints
    - `route.ts` - Create job endpoint
    - `upload/route.ts` - PDF upload and processing
- `lib/` - Utilities and shared code
  - `db.ts` - Mock database functions (replace with real DB)
  - `openai.ts` - OpenAI integration for PDF processing

## Job PDF Processing Flow

1. User uploads a PDF job description file
2. Backend extracts text from PDF (currently mocked)
3. OpenAI API processes the text to extract job information (currently mocked)
4. Job listing is created and stored in database
5. User is shown the processed job and can view or edit it

## Future Enhancements

- **Authentication & Authorization**: Restrict dashboard access to company accounts
- **Job Editing**: Add functionality to edit existing jobs
- **Real Database**: Replace mock database with actual database integration
- **File Storage**: Store uploaded PDFs for reference
- **PDF Text Extraction**: Implement actual PDF text extraction
- **OpenAI Integration**: Connect to OpenAI API for intelligent job processing
- **Application Management**: Implement candidate application review and management 