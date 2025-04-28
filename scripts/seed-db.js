// This script seeds the MongoDB database with initial job data
// Run with: node scripts/seed-db.js

require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');
const { exit } = require('process');

// Initial job data
const seedJobs = [
  {
    title: "Software Engineer",
    company: "Acme Inc.",
    location: "Remote / San Francisco",
    salary: "$120,000 - $150,000",
    description: "We are looking for a talented software engineer to join our team. The ideal candidate will have strong experience with modern web technologies and a passion for building high-quality, scalable applications.",
    requirements: [
      "5+ years of experience with JavaScript",
      "Experience with React",
      "Strong problem-solving skills",
      "Bachelor's degree in Computer Science or related field"
    ],
    benefits: [
      "Competitive salary",
      "Remote work options",
      "Health insurance",
      "401(k) matching"
    ],
    status: 'active',
    createdAt: new Date("2023-10-15"),
    applicants: 12
  },
  {
    title: "Product Manager",
    company: "Acme Inc.",
    location: "New York",
    salary: "$130,000 - $160,000",
    description: "We are seeking an experienced product manager to lead our product development efforts. You will be responsible for defining product strategy, roadmap, and features.",
    requirements: [
      "5+ years of product management experience",
      "Experience with agile development methodologies",
      "Strong analytical and problem-solving skills",
      "Excellent communication skills"
    ],
    benefits: [
      "Competitive salary",
      "Flexible working hours",
      "Health insurance",
      "401(k) matching"
    ],
    status: 'active',
    createdAt: new Date("2023-10-10"),
    applicants: 8
  },
  {
    title: "UX Designer",
    company: "Acme Inc.",
    location: "Remote",
    salary: "$90,000 - $120,000",
    description: "We are looking for a talented UX designer to create exceptional user experiences. You will work closely with product managers and engineers to design intuitive interfaces.",
    requirements: [
      "3+ years of UX design experience",
      "Proficiency with design tools (Figma, Sketch)",
      "Portfolio demonstrating UX process",
      "Experience with user research methods"
    ],
    benefits: [
      "Competitive salary",
      "Remote work",
      "Health insurance",
      "Professional development budget"
    ],
    status: 'closed',
    createdAt: new Date("2023-09-28"),
    applicants: 5
  }
];

async function seedDatabase() {
  if (!process.env.MONGODB_URI) {
    console.error('Error: MongoDB URI not defined in .env.local');
    exit(1);
  }

  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Define the Job model inline for the seed script
    const JobSchema = new mongoose.Schema({
      title: { type: String, required: true },
      company: { type: String, required: true },
      location: { type: String, required: true },
      salary: String,
      description: { type: String, required: true },
      requirements: [String],
      benefits: [String],
      status: {
        type: String,
        enum: ['active', 'closed'],
        default: 'active'
      },
      createdAt: { type: Date, default: Date.now },
      applicants: { type: Number, default: 0 }
    });

    const Job = mongoose.models.Job || mongoose.model('Job', JobSchema);

    // Clear existing jobs
    console.log('Clearing existing jobs...');
    await Job.deleteMany({});
    console.log('Existing jobs cleared');

    // Insert seed jobs
    console.log('Inserting seed jobs...');
    await Job.insertMany(seedJobs);
    console.log('Seed jobs inserted successfully!');

    // Verify data was inserted
    const jobCount = await Job.countDocuments();
    console.log(`Database now contains ${jobCount} jobs`);

    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    
    console.log('Database seeding completed!');
  } catch (error) {
    console.error('Error seeding database:', error);
    exit(1);
  }
}

// Run the seeding function
seedDatabase(); 