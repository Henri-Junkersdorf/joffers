# AI PDF Processing in Joffers

This document explains how the AI PDF processing functionality works in the Joffers application.

## How It Works

The Joffers application extracts job information from PDF files using OpenAI with an administrator-provided API key. The system works as follows:

1. **PDF Upload and Model Selection**: Users upload a PDF job description and select which OpenAI model to use.
2. **PDF Processing**: The system reads the PDF file directly in the browser and converts it to base64 format.
3. **OpenAI Processing**: The PDF content is sent to OpenAI using the administrator's API key to identify job details such as title, company, location, salary, requirements, etc.
4. **Job Creation**: The structured job information is used to create a new job listing in the database.

## Implementation Details

### PDF Content Extraction

The system extracts PDF content directly in the browser using the FileReader API:
- Reads the PDF file as an ArrayBuffer
- Converts it to a base64 string for processing
- No external PDF extraction services are used

### AI Job Information Extraction

The system processes the PDF content using OpenAI's API with the administrator's credentials:
- Uses the model specified by the user for each request
- All requests use the same API key set by the administrator

### Requirements

For the PDF processing to work:

1. Administrator must set the `ADMIN_OPENAI_API_KEY` environment variable
2. Users must provide a PDF file containing the job description
3. Users must select an OpenAI model to use (e.g., gpt-4, gpt-3.5-turbo)

### Error Handling

The system includes robust error handling for various scenarios:

- Missing administrator API key
- Invalid or unsupported model name
- Connection issues with OpenAI services
- PDF processing failures

## Benefits of This Approach

- **Centralized Billing**: All API usage is billed to a single administrator account
- **Simplified User Experience**: Users don't need to provide their own API keys
- **Direct Processing**: No reliance on external PDF extraction services
- **Administrator Control**: The administrator manages API access and costs

## Technical Implementation

- **Client-Side Processing**: PDF files are read directly in the browser
- **Server-Side API Calls**: All OpenAI API calls are made from the server using the admin key
- **Progress Indicators**: The UI shows the current processing stage to the user
- **Error Feedback**: Clear error messages help users understand any issues

## Future Enhancements

- Add support for more document formats (DOCX, HTML, etc.)
- Improve client-side text extraction reliability
- Enhance the pattern recognition for the fallback processor
- Add support for multiple languages
- Implement job category classification

## Getting Started

### For Administrators

1. Obtain an OpenAI API key
2. Set the `ADMIN_OPENAI_API_KEY` environment variable in your `.env.local` file
3. Restart the application

### For Users

1. Navigate to the dashboard
2. Click on "Create Job"
3. Choose the "Upload PDF" option
4. Select your job description PDF
5. Choose an OpenAI model for processing
6. Submit the form and wait for processing to complete

## Troubleshooting

If you encounter errors:

1. Administrators should verify that the API key is valid and has sufficient credits
2. Check that the selected model is supported by the administrator's OpenAI account
3. Ensure PDF files are not corrupted or password-protected
4. Check the server's internet connection 