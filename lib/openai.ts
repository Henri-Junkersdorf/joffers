/**
 * This file contains utility functions for interacting with the OpenAI API
 * Uses a single API key set by the administrator
 */

// Function to extract job information from PDF content using OpenAI
export async function extractJobInfoFromPdf(pdfContent: string, model: string) {
  try {
    console.log("Extracting job info from PDF...");

    // Get API key from environment and clean it
    const apiKey = process.env.ADMIN_OPENAI_API_KEY?.replace(/\s+/g, '');
    if (!apiKey) {
      throw new Error("OpenAI API key is required but not set in environment");
    }

    if (!model) {
      throw new Error("OpenAI model name is required");
    }

    // Check if the content is a data URI
    const isDataUri = pdfContent.startsWith('data:application/pdf;base64,');
    
    // Define messages based on content type
    let messages;
    
    if (isDataUri && model.includes('gpt-4')) {
      // Using vision capabilities with GPT-4
      messages = [
        {
          role: "system",
          content: "You are an expert at extracting structured job information from job descriptions."
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Extract the following information from this job description PDF in JSON format:\n- title: the job title\n- company: the company name\n- location: where the job is located\n- salary: the salary range if mentioned\n- description: a brief summary of the job\n- requirements: a list of key requirements\n- benefits: a list of benefits offered\n\nReturn ONLY valid JSON."
            },
            {
              type: "image_url",
              image_url: {
                url: pdfContent
              }
            }
          ]
        }
      ];
    } else {
      // For non-vision models or non-data URI content
      const promptText = `Extract the following information from this job description in JSON format:
      - title: the job title
      - company: the company name
      - location: where the job is located
      - salary: the salary range if mentioned
      - description: a brief summary of the job
      - requirements: a list of key requirements
      - benefits: a list of benefits offered
      
      Return ONLY valid JSON.`;
      
      messages = [
        {
          role: "system",
          content: "You are an expert at extracting structured job information from job descriptions."
        },
        {
          role: "user",
          content: promptText + (isDataUri ? "\n\nThis is a PDF file in base64 format: " + pdfContent.substring(0, 500) + "..." : "\n\n" + pdfContent)
        }
      ];
    }

    // Use the OpenAI API with the provided key
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: model,
        messages: messages,
        temperature: 0.5,
        response_format: { type: "json_object" }
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("OpenAI API error:", errorData);
      throw new Error("Error from OpenAI API: " + (errorData.error?.message || "Unknown error"));
    }

    const data = await response.json();
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error("Unexpected API response format from OpenAI");
    }

    try {
      return JSON.parse(data.choices[0].message.content);
    } catch (parseError) {
      console.error("Failed to parse OpenAI response as JSON:", parseError);
      throw new Error("Failed to parse OpenAI response as valid JSON");
    }
  } catch (error) {
    console.error("Error extracting job info from PDF:", error);
    throw error;
  }
}

// Function to extract text from PDF file
export async function extractPdfText(pdfFile: File): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      const reader = new FileReader();
      
      reader.onload = async function(event) {
        if (!event.target?.result) {
          reject(new Error("Failed to read PDF file"));
          return;
        }
        
        try {
          // Convert file to binary data
          const arrayBuffer = event.target.result as ArrayBuffer;
          
          // Convert to Base64 for sending to OpenAI
          const base64 = arrayBufferToBase64(arrayBuffer);
          
          // Create a data URI that OpenAI can process
          const pdfBase64Uri = `data:application/pdf;base64,${base64}`;
          
          // For text-based models, we'll just send the first part of the base64 data
          // OpenAI can use this to extract text even from partial PDF data
          resolve(pdfBase64Uri);
        } catch (error: any) {
          reject(new Error(`Error processing PDF: ${error.message}`));
        }
      };
      
      reader.onerror = function() {
        reject(new Error("Error reading PDF file"));
      };
      
      // Read as ArrayBuffer which works for PDFs
      reader.readAsArrayBuffer(pdfFile);
    } catch (error) {
      reject(error);
    }
  });
}

// Helper function to convert ArrayBuffer to Base64
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  
  return window.btoa(binary);
}