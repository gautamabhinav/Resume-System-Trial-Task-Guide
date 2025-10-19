// import React, { useEffect } from "react";
// import { motion } from "framer-motion";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchAllResumes, deleteResume } from "../../Redux/resumeSlice";
// import { FaFileAlt, FaTrashAlt, FaUserCircle } from "react-icons/fa";
// import toast from "react-hot-toast";
// import ResumeDetailsModal from "./ResumeDetailsModal";
// import { useState } from "react";



// const ResumeManagement = () => {
//   const dispatch = useDispatch();
//   const { allResumes, loading } = useSelector((state) => state.resume);
//   const [selectedResume, setSelectedResume] = useState(null);


//   useEffect(() => {
//     dispatch(fetchAllResumes());
//   }, [dispatch]);

//   const handleDelete = async (userId) => {
//     try {
//       await dispatch(deleteResume(userId));
//       toast.success("Resume deleted successfully");
//       dispatch(fetchAllResumes()); // Refresh table
//     } catch (error) {
//       toast.error("Failed to delete resume");
//     }
//   };

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 10 }}
//       whileInView={{ opacity: 1, y: 0 }}
//       className="bg-gradient-to-br from-white/5 to-white/10 p-6 rounded-2xl shadow-lg border border-zinc-800 mt-8"
//     >
//       <h2 className="text-lg font-semibold mb-4 text-yellow-400">
//         Resume Management
//       </h2>

//       {loading ? (
//         <div className="text-center text-gray-400 py-6">Loading resumes...</div>
//       ) : allResumes?.length === 0 ? (
//         <div className="text-center text-gray-400 py-6">No resumes found.</div>
//       ) : (
//         <div className="overflow-x-auto">
//           <table className="w-full text-left text-sm">
//             <thead className="bg-zinc-800/50">
//               <tr>
//                 <th className="px-4 py-2">User</th>
//                 <th className="px-4 py-2">Email</th>
//                 <th className="px-4 py-2">Phone</th>
//                 <th className="px-4 py-2">Skills</th>
//                 <th className="px-4 py-2">Projects</th>
//                 <th className="px-4 py-2">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {allResumes.map((resume) => (
//                 <tr
//                   key={resume._id}
//                   className="border-t border-zinc-700 hover:bg-white/5 transition-all"
//                 >
//                   <td className="px-4 py-2 flex items-center gap-2">
//                     <FaUserCircle className="text-indigo-400" />
//                     {resume.name || "—"}
//                   </td>
//                   <td className="px-4 py-2">{resume.email || "—"}</td>
//                   <td className="px-4 py-2">{resume.phone || "—"}</td>
//                   <td className="px-4 py-2">
//                     <div className="flex flex-wrap gap-1">
//                       {(resume.skills || []).slice(0, 3).map((s, i) => (
//                         <span
//                           key={i}
//                           className="bg-indigo-600/20 text-indigo-300 px-2 py-0.5 rounded text-xs"
//                         >
//                           {s}
//                         </span>
//                       ))}
//                       {resume.skills?.length > 3 && (
//                         <span className="text-gray-400 text-xs">+{resume.skills.length - 3}</span>
//                       )}
//                     </div>
//                   </td>
//                   <td className="px-4 py-2">
//                     <div className="flex flex-wrap gap-1">
//                       {(resume.projects || []).slice(0, 2).map((p, i) => (
//                         <span
//                           key={i}
//                           className="bg-green-600/20 text-green-300 px-2 py-0.5 rounded text-xs"
//                         >
//                           {p}
//                         </span>
//                       ))}
//                       {resume.projects?.length > 2 && (
//                         <span className="text-gray-400 text-xs">+{resume.projects.length - 2}</span>
//                       )}
//                     </div>
//                   </td>
//                   <td className="px-4 py-2 flex items-center gap-3">
//                     <button
//                         onClick={() => setSelectedResume(resume)}
//                         className="text-blue-400 hover:text-blue-500 transition-all"
//                         title="View Details"
//                         >
//                         <FaFileAlt size={16} />
//                     </button>

//                     <button
//                       onClick={() => handleDelete(resume.userId)}
//                       className="text-red-400 hover:text-red-500 transition-all"
//                       title="Delete Resume"
//                     >
//                       <FaTrashAlt size={16} />
//                     </button>

//                     {selectedResume && (
//                         <ResumeDetailsModal
//                             resume={selectedResume}
//                             onClose={() => setSelectedResume(null)}
//                         />
//                     )}

//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </motion.div>
//   );
// };

// export default ResumeManagement;


import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllResumes, deleteResume } from "../../Redux/resumeSlice";
import { FaFileAlt, FaTrashAlt, FaUserCircle, FaDownload } from "react-icons/fa";
import toast from "react-hot-toast";
import ResumeDetailsModal from "./ResumeDetailsModal";
import jsPDF from "jspdf";

const ResumeManagement = () => {
  const dispatch = useDispatch();
  const { allResumes, loading } = useSelector((state) => state.resume);
  const [selectedResume, setSelectedResume] = useState(null);

  useEffect(() => {
    dispatch(fetchAllResumes());
  }, [dispatch]);

  const handleDelete = async (userId) => {
    try {
      await dispatch(deleteResume(userId));
      toast.success("Resume deleted successfully");
      dispatch(fetchAllResumes()); // Refresh table
    } catch (error) {
      toast.error("Failed to delete resume");
    }
  };

  // Download resume as PDF
  const handleDownloadPDF = (resume) => {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text(`Resume of ${resume.name || "Unknown"}`, 10, 10);

    doc.setFontSize(12);
    doc.text(`Email: ${resume.email || "—"}`, 10, 20);
    doc.text(`Phone: ${resume.phone || "—"}`, 10, 28);

    if (resume.summary) {
      doc.text("Professional Summary:", 10, 36);
      doc.text(resume.summary, 10, 44);
    }

    if (resume.skills?.length) {
      doc.text("Skills:", 10, 52);
      doc.text(resume.skills.join(", "), 10, 60);
    }

    if (resume.projects?.length) {
      doc.text("Projects:", 10, 68);
      resume.projects.forEach((p, i) => {
        doc.text(`- ${p}`, 12, 76 + i * 8);
      });
    }

    if (resume.education?.length) {
      doc.text("Education:", 10, 76 + (resume.projects?.length || 0) * 8 + 8);
      resume.education.forEach((e, i) => {
        doc.text(`- ${e}`, 12, 84 + (resume.projects?.length || 0) * 8 + i * 8);
      });
    }

    // Add other sections like internships, courses, hackathons if needed

    doc.save(`${resume.name || "resume"}.pdf`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-white/5 to-white/10 p-6 rounded-2xl shadow-lg border border-zinc-800 mt-8"
    >
      <h2 className="text-lg font-semibold mb-4 text-yellow-400">
        Resume Management
      </h2>

      {loading ? (
        <div className="text-center text-gray-400 py-6">Loading resumes...</div>
      ) : allResumes?.length === 0 ? (
        <div className="text-center text-gray-400 py-6">No resumes found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-800/50">
              <tr>
                <th className="px-4 py-2">User</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Phone</th>
                <th className="px-4 py-2">Skills</th>
                <th className="px-4 py-2">Projects</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {allResumes.map((resume) => (
                <tr
                  key={resume._id}
                  className="border-t border-zinc-700 hover:bg-white/5 transition-all"
                >
                  <td className="px-4 py-2 flex items-center gap-2">
                    <FaUserCircle className="text-indigo-400" />
                    {resume.name || "—"}
                  </td>
                  <td className="px-4 py-2">{resume.email || "—"}</td>
                  <td className="px-4 py-2">{resume.phone || "—"}</td>
                  <td className="px-4 py-2">
                    <div className="flex flex-wrap gap-1">
                      {(resume.skills || []).slice(0, 3).map((s, i) => (
                        <span
                          key={i}
                          className="bg-indigo-600/20 text-indigo-300 px-2 py-0.5 rounded text-xs"
                        >
                          {s}
                        </span>
                      ))}
                      {resume.skills?.length > 3 && (
                        <span className="text-gray-400 text-xs">+{resume.skills.length - 3}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex flex-wrap gap-1">
                      {(resume.projects || []).slice(0, 2).map((p, i) => (
                        <span
                          key={i}
                          className="bg-green-600/20 text-green-300 px-2 py-0.5 rounded text-xs"
                        >
                          {p}
                        </span>
                      ))}
                      {resume.projects?.length > 2 && (
                        <span className="text-gray-400 text-xs">+{resume.projects.length - 2}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-2 flex items-center gap-3">
                    {/* View */}
                    <button
                      onClick={() => setSelectedResume(resume)}
                      className="text-blue-400 hover:text-blue-500 transition-all"
                      title="View Details"
                    >
                      <FaFileAlt size={16} />
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => handleDelete(resume.userId)}
                      className="text-red-400 hover:text-red-500 transition-all"
                      title="Delete Resume"
                    >
                      <FaTrashAlt size={16} />
                    </button>

                    {/* Download PDF */}
                    <button
                      onClick={() => handleDownloadPDF(resume)}
                      className="text-green-400 hover:text-green-500 transition-all"
                      title="Download PDF"
                    >
                      <FaDownload size={16} />
                    </button>

                    {/* Modal */}
                    {selectedResume && (
                      <ResumeDetailsModal
                        resume={selectedResume}
                        onClose={() => setSelectedResume(null)}
                      />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </motion.div>
  );
};

export default ResumeManagement;
