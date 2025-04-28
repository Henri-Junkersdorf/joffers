# MongoDB Integration for Joffers

This document guides you through setting up MongoDB for the Joffers web application.

## Prerequisites

- Node.js and npm installed
- Access to a MongoDB instance (Atlas cloud or local)

## Setup Instructions

### 1. Install Required Packages

The necessary dependencies (mongodb, mongoose, dotenv) have already been installed.

### 2. Configure Environment Variables

Create a `.env.local` file in the root of your project with the following content:

```
# Database configuration
MONGODB_URI=mongodb+srv://username:password@cluster0.mongodb.net/joffers?retryWrites=true&w=majority

# OpenAI API key for PDF processing  
ADMIN_OPENAI_API_KEY=your_openai_api_key
```

Replace the placeholder values with your actual MongoDB URI and OpenAI API key.

For local MongoDB, use:
```
MONGODB_URI=mongodb://localhost:27017/joffers
```

### 3. Setup MongoDB

#### Using MongoDB Atlas (Recommended for Production)

1. Create a MongoDB Atlas account at https://www.mongodb.com/cloud/atlas
2. Set up a new cluster (the free tier is sufficient for getting started)
3. In the Security tab, create a database user with read/write access
4. In the Network Access tab, allow access from your IP address
5. Click "Connect" and choose "Connect your application"
6. Copy the connection string and replace the placeholder in your `.env.local` file

#### Using Local MongoDB (Development)

1. Install MongoDB Community Edition on your local machine
2. Start the MongoDB service
3. Use the connection string: `mongodb://localhost:27017/joffers`

### 4. Seed the Database

Run the following command to seed your database with initial job data:

```
npm run seed
```

This will populate your MongoDB database with the same mock data that was previously hardcoded.

### 5. Run the Application

Start the development server:

```
npm run dev
```

## Data Models

### Job Model

The application uses a Job model with the following schema:

- `title`: String (required) - Job title
- `company`: String (required) - Company name
- `location`: String (required) - Job location
- `salary`: String - Salary range or information
- `description`: String (required) - Job description
- `requirements`: Array of String - Job requirements
- `benefits`: Array of String - Job benefits
- `status`: String (enum: 'active', 'closed', default: 'active') - Job status
- `createdAt`: Date (default: current date) - When the job was created
- `applicants`: Number (default: 0) - Number of applicants

## Architecture

The application uses:

1. MongoDB as the database
2. Mongoose as the ODM (Object-Document Mapper)
3. Next.js for the web framework

Files:
- `lib/mongodb.ts`: Handles the MongoDB connection
- `lib/db.ts`: Contains database operations for jobs
- `models/Job.ts`: Defines the Job schema and model
- `scripts/seed-db.js`: Seeds the database with initial data 