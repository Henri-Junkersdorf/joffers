import mongoose, { Document } from 'mongoose';

export interface IJob extends Document {
  title: string;
  company: string;
  location?: string;
  salary?: string;
  description: string;
  requirements: string[];
  benefits: string[];
  status: 'active' | 'closed';
  createdAt: Date;
  applicants: number;
}

const JobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  company: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    type: String,
    required: false,
    trim: true,
    default: 'Remote'
  },
  salary: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  requirements: {
    type: [String],
    required: true
  },
  benefits: {
    type: [String],
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'closed'],
    default: 'active'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  applicants: {
    type: Number,
    default: 0
  }
});

// Check if the model already exists to prevent OverwriteModelError in development due to hot reloading
export default (mongoose.models.Job as mongoose.Model<IJob>) || 
  mongoose.model<IJob>('Job', JobSchema); 