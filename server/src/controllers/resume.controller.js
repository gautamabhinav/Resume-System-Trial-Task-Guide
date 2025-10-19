// import asyncHandler from "../middlewares/asyncHandler.middleware.js";
// import Resume from "../models/resume.model.js";

// // Create or Update Resume
// export const upsertResume = asyncHandler(async (req, res) => {
//   try {
//     const { userId } = req.body;

//     if (!userId) {
//       return res.status(400).json({ message: "userId is required" });
//     }

//     // Ensure array fields are always arrays
//     const sanitizeArray = (field) => (Array.isArray(field) ? field : []);

//     const updateData = {
//       name: req.body.name || "",
//       email: req.body.email || "",
//       phone: req.body.phone || "",
//       summary: req.body.summary || "",
//       skills: sanitizeArray(req.body.skills),
//       projects: sanitizeArray(req.body.projects),
//       internships: sanitizeArray(req.body.internships),
//       courses: sanitizeArray(req.body.courses),
//       hackathons: sanitizeArray(req.body.hackathons),
//       education: Array.isArray(req.body.education)
//         ? req.body.education
//         : [],
//     };

//     const updatedResume = await Resume.findOneAndUpdate(
//       { userId },
//       { $set: updateData },
//       { new: true, upsert: true } // create if not exists
//     );

//     res.status(200).json(updatedResume);
//   } catch (err) {
//     console.error("Error updating resume:", err);
//     res.status(500).json({ message: "Server Error" });
//   }
// });


// // Fetch Resume
// // Fetch Resume (create if not exists)
// export const getResume = asyncHandler(async (req, res) => {
//   try {
//     let resume = await Resume.findOne({ userId: req.params.userId });

//     // If no resume exists, create an empty one
//     if (!resume) {
//       resume = await Resume.create({
//         userId: req.params.userId,
//         name: "",
//         email: "",
//         phone: "",
//         summary: "",
//         skills: [],
//         projects: [],
//         internships: [],
//         courses: [],
//         hackathons: [],
//       });
//     }

//     res.status(200).json(resume);
//   } catch (err) {
//     console.error("Error fetching resume:", err);
//     res.status(500).json({ message: "Server Error" });
//   }
// });



import asyncHandler from "../middlewares/asyncHandler.middleware.js";
import Resume from "../models/resume.model.js";

// Helper: ensure array fields
const sanitizeArray = (field) => (Array.isArray(field) ? field : []);

// ✅ Create or Update Resume
export const upsertResume = asyncHandler(async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ message: "userId is required" });

    const updateData = {
      name: req.body.name || "",
      email: req.body.email || "",
      phone: req.body.phone || "",
      summary: req.body.summary || "",
      skills: sanitizeArray(req.body.skills),
      projects: sanitizeArray(req.body.projects),
      internships: sanitizeArray(req.body.internships),
      courses: sanitizeArray(req.body.courses),
      hackathons: sanitizeArray(req.body.hackathons),
      education: sanitizeArray(req.body.education),
    };

    const updatedResume = await Resume.findOneAndUpdate(
      { userId },
      { $set: updateData },
      { new: true, upsert: true }
    );

    res.status(200).json(updatedResume);
  } catch (err) {
    console.error("Error updating resume:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

// ✅ Get single Resume (create if not exists)
export const getResume = asyncHandler(async (req, res) => {
  try {
    let resume = await Resume.findOne({ userId: req.params.userId });

    if (!resume) {
      resume = await Resume.create({
        userId: req.params.userId,
        name: "",
        email: "",
        phone: "",
        summary: "",
        skills: [],
        projects: [],
        internships: [],
        courses: [],
        hackathons: [],
        education: [],
      });
    }

    res.status(200).json(resume);
  } catch (err) {
    console.error("Error fetching resume:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

// ✅ Get all Resumes
export const getAllResumes = asyncHandler(async (req, res) => {
  try {
    const resumes = await Resume.find({});
    res.status(200).json(resumes);
  } catch (err) {
    console.error("Error fetching all resumes:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

// ✅ Delete Resume
export const deleteResume = asyncHandler(async (req, res) => {
  try {
    const { userId } = req.params;
    const resume = await Resume.findOneAndDelete({ userId });

    if (!resume) return res.status(404).json({ message: "Resume not found" });

    res.status(200).json({ message: "Resume deleted successfully" });
  } catch (err) {
    console.error("Error deleting resume:", err);
    res.status(500).json({ message: "Server Error" });
  }
});
