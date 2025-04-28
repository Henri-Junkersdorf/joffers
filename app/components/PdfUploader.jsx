'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function PdfUploader() {
  const router = useRouter();
  const [file, setFile] = useState(null);
  const [model, setModel] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState('');

  const models = [
    { value: 'gpt-4', label: 'GPT-4 (Most Accurate)' },
    { value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo (Faster)' },
    { value: 'gpt-4-turbo', label: 'GPT-4 Turbo (Balance of Speed & Accuracy)' },
  ];

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type !== 'application/pdf') {
      setError('Please upload a PDF file');
      setFile(null);
      return;
    }
    setFile(selectedFile);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate inputs
    if (!file) {
      setError('Please select a PDF file');
      return;
    }
    
    if (!model) {
      setError('Please select an OpenAI model');
      return;
    }
    
    setLoading(true);
    setError('');
    setProgress('Starting PDF processing...');
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('model', model);
      
      setProgress('Uploading PDF and extracting content...');
      
      const response = await fetch('/api/jobs/upload', {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Error processing PDF');
      }
      
      setProgress('Job information extracted successfully!');
      
      // Redirect to the job details page
      router.push(`/jobs/${data.job.id}`);
      
    } catch (err) {
      console.error('Upload error:', err);
      setError(err.message || 'Error uploading or processing PDF');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Upload Job Description PDF</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      
      {progress && !error && (
        <div className="mb-4 p-3 bg-blue-100 border border-blue-400 text-blue-700 rounded">
          {progress}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">
            PDF File
          </label>
          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            className="w-full p-2 border border-gray-300 rounded"
            disabled={loading}
          />
          {file && (
            <p className="mt-1 text-sm text-gray-500">
              Selected: {file.name} ({Math.round(file.size / 1024)} KB)
            </p>
          )}
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">
            OpenAI Model <span className="text-red-600">*</span>
          </label>
          <select
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            disabled={loading}
            required
          >
            <option value="">Select a model</option>
            {models.map((modelOption) => (
              <option key={modelOption.value} value={modelOption.value}>
                {modelOption.label}
              </option>
            ))}
          </select>
        </div>
        
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className={`w-full py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
              loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Process PDF'}
          </button>
        </div>
      </form>
      
      <div className="mt-6 text-sm text-gray-600">
        <p className="font-semibold">Note:</p>
        <ul className="list-disc pl-5 mt-1 space-y-1">
          <li>Different models have different accuracy levels and processing speeds.</li>
          <li>For complex job descriptions, GPT-4 may provide more accurate results.</li>
          <li>For simple job descriptions, GPT-3.5 Turbo is faster and more efficient.</li>
        </ul>
      </div>
    </div>
  );
} 