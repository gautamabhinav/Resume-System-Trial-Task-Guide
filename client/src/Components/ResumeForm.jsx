import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  saveResume,
  updateField,
  addArrayItem,
  removeArrayItem,
  fetchResume,
} from "../Redux/resumeSlice";
import { fetchAiInsights } from "../Redux/aiSlice";
import { Plus, X } from "lucide-react";
import toast from "react-hot-toast";
import ResumeManagement from "../Pages/Resume/ResumeManagement";

export default function ResumeBuilder({ userId }) {
  const dispatch = useDispatch();
  const { resume } = useSelector((state) => state?.resume);
  const aiLoading = useSelector((state) => state.ai?.loading);
  

  const [inputs, setInputs] = useState({
    skill: "",
    project: "",
    internship: "",
    course: "",
    hackathon: "",
  });

  // Fetch resume when component mounts
  useEffect(() => {
    if (userId) dispatch(fetchResume(userId));
  }, [dispatch, userId]);

  const handleFieldChange = (e) => {
    dispatch(updateField({ field: e.target.name, value: e.target.value }));
  };

  const addItem = (field) => {
  const value = inputs[field]?.trim();
  if (!value) return;

  const arrayField = resume[field + "s"] || []; // default to []
  if (!arrayField.includes(value)) {
    dispatch(addArrayItem({ field: field + "s", value }));
    setInputs({ ...inputs, [field]: "" });
  }
};

const renderTags = (items = [], field) =>
  (items || []).map((item, i) => (
    <span
      key={i}
      className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm flex items-center gap-1"
    >
      {item}
      <button
        type="button"
        onClick={() => removeItemHandler(field, i)}
        className="text-indigo-500 hover:text-indigo-700"
      >
        <X size={14} />
      </button>
    </span>
  ));


  const removeItemHandler = (field, index) => {
    dispatch(removeArrayItem({ field: field + "s", index }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(saveResume(resume));
  };

  const handleGenerateSummary = async () => {
    // dispatch AI thunk with current resume data
    try {
      const action = await dispatch(fetchAiInsights(resume));
      if (action.payload) {
        // payload is expected to be a summary string (or structured)
        const summaryText = typeof action.payload === 'string' ? action.payload : JSON.stringify(action.payload);
        dispatch(updateField({ field: 'summary', value: summaryText }));
      }
    } catch (err) {
      // swallow for now; UI could show toast
      console.error('AI summary generation failed', err);
    }
  };

  const handleSave = async () => {
    try {
      await dispatch(saveResume(resume));
      toast.success("Resume saved successfully");
      // Optionally show a success message or redirect
    } catch (err) {
      console.error('Failed to save resume', err);
    }
  }

  // const renderTags = (items = [], field) =>
  //   items.map((item, i) => (
  //     <span
  //       key={i}
  //       className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm flex items-center gap-1"
  //     >
  //       {item}
  //       <button
  //         type="button"
  //         onClick={() => removeItemHandler(field, i)}
  //         className="text-indigo-500 hover:text-indigo-700"
  //       >
  //         <X size={14} />
  //       </button>
  //     </span>
  //   ));

  return (
    <div className="p-6 bg-gray-50 min-h-screen flex justify-center">
      {/* <div>
    <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Abhinav</h2>
      </div> */}
      <div className="bg-white p-6 rounded-2xl bg-black shadow-xl border border-gray-100 w-full max-w-xl overflow-y-auto">
        
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          Resume Builder
        </h2>
        <div className="bg-black">
          <ResumeManagement />
        </div>

        <button
          onClick={() => dispatch(fetchResume(userId))}
          className="px-4 py-2 rounded-lg bg-yellow-500 text-black font-semibold"
        >
          Fetch Resumes
        </button>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Basic fields */}
          {["name", "email", "phone", "summary"].map((field) => (
            <div key={field}>
              <label className="block text-sm font-medium text-gray-600 mb-1 capitalize">
                {field === "summary" ? "Professional Summary" : field}
              </label>
               {field === "summary" ? (
                <textarea
                  name={field}
                  value={resume[field] || ""}
                  onChange={handleFieldChange}
                  className="w-full border border-gray-300 bg-black rounded-lg p-2"
                  rows={4}
                  placeholder="Write a professional summary..."
                />
               ) : ( 
                <input
                  name={field}
                  value={resume[field] || ""}
                  onChange={handleFieldChange}
                  className="w-full border border-gray-300 bg-black rounded-lg p-2"
                  placeholder={`Enter your ${field}`}
                />
              )}
            </div>
          ))}

          {/* Array fields */}
          {["skill", "project", "internship", "course", "hackathon"].map((field) => (
            <div key={field}>
              <label className="block text-sm font-medium text-gray-600 mb-1 capitalize">
                {field}s
              </label>
              <div className="flex gap-2 mb-3 bg-black">
                <input
                  type="text"
                  placeholder={`Add ${field}`}
                  value={inputs[field]}
                  onChange={(e) => setInputs({ ...inputs, [field]: e.target.value })}
                  className="flex-1 border border-gray-300 bg-black rounded-lg p-2 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => addItem(field)}
                  className="bg-indigo-600 text-white px-3 py-2 rounded-lg hover:bg-indigo-700 transition-all flex items-center"
                >
                  <Plus size={16} className="mr-1" /> Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {renderTags(resume[field + "s"] || [], field)}
              </div>
            </div>
          ))}

          <div className="flex flex-col gap-3">
            <button
              type="submit"
              onClick={handleSave}
              className="w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold mt-4"
            >
              Save Resume
            </button>

            <button
              type="button"
              onClick={handleGenerateSummary}
              className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
              disabled={aiLoading}
            >
              {aiLoading ? "Generating summary..." : "Generate Summary (AI)"}
            </button>
          </div>
        </form>
        
      </div>
      
    </div>
  );
}
