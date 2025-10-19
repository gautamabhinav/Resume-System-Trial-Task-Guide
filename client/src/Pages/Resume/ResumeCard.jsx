import React from "react";
import { useNavigate } from "react-router-dom";

const ResumeCard = ({ data }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/portal/resume/${data?._id}`)}
      className="bg-zinc-800 rounded-lg p-5 cursor-pointer hover:bg-zinc-700 transition"
    >
      <h2 className="text-xl font-semibold text-yellow-400">
        {data?.name || "Unnamed"}
      </h2>
      <p className="text-sm text-gray-400">{data?.email}</p>

      <p className="mt-2 text-gray-300 line-clamp-3">
        {data?.summary || "No summary available."}
      </p>

      {Array.isArray(data?.skills) && data.skills.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {data.skills.slice(0, 4).map((skill, idx) => (
            <span
              key={idx}
              className="bg-yellow-500 text-black text-xs px-2 py-1 rounded-md"
            >
              {skill}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default ResumeCard;
