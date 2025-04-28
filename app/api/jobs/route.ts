import { NextRequest, NextResponse } from "next/server";
import { createJob } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const json = await request.json();
    
    // Validate required fields
    const requiredFields = ['title', 'company', 'location', 'description', 'requirements', 'benefits'];
    for (const field of requiredFields) {
      if (!json[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }
    
    // Convert requirements and benefits from string to array if needed
    if (typeof json.requirements === 'string') {
      json.requirements = json.requirements.split('\n').filter(Boolean);
    }
    
    if (typeof json.benefits === 'string') {
      json.benefits = json.benefits.split('\n').filter(Boolean);
    }

    // Create job in database
    const job = await createJob({
      ...json,
      createdAt: new Date().toISOString()
    });
    
    return NextResponse.json({ 
      message: "Job created successfully",
      job
    });
    
  } catch (error) {
    console.error("Error creating job:", error);
    return NextResponse.json(
      { error: "Error creating job" },
      { status: 500 }
    );
  }
} 