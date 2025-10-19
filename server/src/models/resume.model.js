import mongoose from "mongoose";
import { Schema, model } from 'mongoose';

const resumeSchema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: String,
  email: String,
  phone: String,
  education: [
    {
      institution: String,
      degree: String,
      year: String,
    },
  ],
  projects: [
    String,
  ],
  internships: [
    String,
  ],
  courses: [
    String,
  ],
  hackathons: [
    String,
  ],
  skills: [String],
  summary: String,
}, { timestamps: true });

const Resume = model("Resume", resumeSchema)

export default Resume;
