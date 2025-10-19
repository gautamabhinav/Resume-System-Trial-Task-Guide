import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaTimes,
  FaArrowLeft,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaCode,
  FaProjectDiagram,
  FaGraduationCap,
} from "react-icons/fa";

const ResumeDetailsModal = ({ resume, onClose }) => {
  if (!resume) return null;

  return (
    <AnimatePresence>
      <motion.div
            className="fixed inset-0 bg-black/70 flex justify-center items-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
        <motion.div
            className="bg-zinc-900 text-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] p-6 relative border border-zinc-700 overflow-y-auto"
            initial={{ scale: 0.9, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 30 }}
        >
          {/* Close (X) button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-400 hover:text-white transition-all"
            title="Close"
          >
            <FaTimes size={20} />
          </button>

          {/* Header */}
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-yellow-400">
            <FaUser /> {resume.name || "Unnamed User"}
          </h2>

          {/* Basic Info */}
          <div className="space-y-2 mb-6">
            <p className="flex items-center gap-2 text-gray-300">
              <FaEnvelope className="text-indigo-400" /> {resume.email || "—"}
            </p>
            <p className="flex items-center gap-2 text-gray-300">
              <FaPhone className="text-green-400" /> {resume.phone || "—"}
            </p>
          </div>

          {/* Summary */}
          {resume.summary && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-yellow-300 mb-2">
                Professional Summary
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed bg-zinc-800 p-3 rounded-lg">
                {resume.summary}
              </p>
            </div>
          )}

          {/* ✅ Back Button */}
          {/* <div className="flex justify-start mt-6">
            <button
              onClick={onClose}
              className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-gray-200 px-4 py-2 rounded-lg transition-all"
            >
              <FaArrowLeft /> Back
            </button>
          </div> */}

          {/* Skills */}
          {resume.skills?.length > 0 && (
            <div className="mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2 text-indigo-300">
                <FaCode /> Skills
              </h3>
              <div className="flex flex-wrap gap-2 mt-2">
                {resume.skills.map((skill, i) => (
                  <span
                    key={i}
                    className="bg-indigo-600/20 text-indigo-300 px-2 py-1 rounded text-xs"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          {resume.projects?.length > 0 && (
            <div className="mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2 text-green-300">
                <FaProjectDiagram /> Projects
              </h3>
              <ul className="list-disc list-inside text-gray-300 text-sm mt-2">
                {resume.projects.map((p, i) => (
                  <li key={i}>{p}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Education */}
          {resume.education?.length > 0 && (
            <div className="mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2 text-yellow-300">
                <FaGraduationCap /> Education
              </h3>
              <ul className="list-disc list-inside text-gray-300 text-sm mt-2">
                {resume.education.map((edu, i) => (
                  <li key={i}>{edu}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Internships / Courses / Hackathons */}
          {resume.internships?.length > 0 && (
            <div className="mb-3">
              <h3 className="text-lg font-semibold text-blue-300">
                Internships
              </h3>
              <ul className="list-disc list-inside text-gray-300 text-sm mt-1">
                {resume.internships.map((intern, i) => (
                  <li key={i}>{intern}</li>
                ))}
              </ul>
            </div>
          )}

          {resume.courses?.length > 0 && (
            <div className="mb-3">
              <h3 className="text-lg font-semibold text-purple-300">Courses</h3>
              <ul className="list-disc list-inside text-gray-300 text-sm mt-1">
                {resume.courses.map((course, i) => (
                  <li key={i}>{course}</li>
                ))}
              </ul>
            </div>
          )}

          {resume.hackathons?.length > 0 && (
            <div className="mb-3">
              <h3 className="text-lg font-semibold text-pink-300">
                Hackathons
              </h3>
              <ul className="list-disc list-inside text-gray-300 text-sm mt-1">
                {resume.hackathons.map((hack, i) => (
                  <li key={i}>{hack}</li>
                ))}
              </ul>
            </div>
          )}

          {/* ✅ Back Button */}
          {/* <div className="flex justify-start mt-6">
            <button
              onClick={onClose}
              className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-gray-200 px-4 py-2 rounded-lg transition-all"
            >
              <FaArrowLeft /> Back
            </button>
          </div> */}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ResumeDetailsModal;
