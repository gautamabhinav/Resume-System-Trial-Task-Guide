import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Layout from "../../Layout/Layout";
import { fetchAllResumes } from "../../Redux/resumeSlice";
import { HiOutlineSearch } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import ResumeCard from "../Resume/ResumeCard"; // You’ll create this similar to BlogCard

const ResumeList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { allResumes } = useSelector((state) => state.resume);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("newest");

  // ✅ Fetch resumes from backend
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        await dispatch(fetchAllResumes());
      } finally {
        setLoading(false);
      }
    })();
  }, [dispatch]);

  // ✅ Filtering + Sorting logic
  const filtered = useMemo(() => {
    let list = allResumes || [];

    // 🔍 Search
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter((r) => {
        return (
          (r?.name || "").toLowerCase().includes(q) ||
          (r?.email || "").toLowerCase().includes(q) ||
          (r?.summary || "").toLowerCase().includes(q) ||
          (Array.isArray(r?.skills) &&
            r.skills.some((s) => s.toLowerCase().includes(q)))
        );
      });
    }

    // 🕓 Sort
    if (sort === "newest") {
      list = list.slice().sort(
        (a, b) =>
          new Date(b?.createdAt || 0) - new Date(a?.createdAt || 0)
      );
    } else if (sort === "oldest") {
      list = list.slice().sort(
        (a, b) =>
          new Date(a?.createdAt || 0) - new Date(b?.createdAt || 0)
      );
    }

    return list;
  }, [allResumes, query, sort]);

  // ✅ Render UI
  return (
    <Layout>
      <div className="min-h-[90vh] pt-12 px-6 md:px-20 flex flex-col gap-6 text-white">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-3xl font-semibold">
            Explore Resumes from{" "}
            <span className="font-bold text-yellow-500">Professionals</span>
          </h1>

          <div className="flex items-center gap-3 w-full md:w-auto">
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <HiOutlineSearch className="absolute left-3 top-3 text-gray-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search name, email, summary, or skill..."
                className="pl-10 pr-3 py-2 w-full bg-zinc-800 rounded-md border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
            </div>

            {/* Sort Dropdown */}
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="bg-zinc-800 border border-zinc-700 rounded-md px-3 py-2"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
            </select>
          </div>
        </div>

        {/* Grid of Resumes */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="animate-pulse bg-zinc-800 rounded-lg p-4 h-[300px]"
              ></div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 mt-12">
            <p className="text-xl">No resumes found.</p>
            <p className="text-gray-400 max-w-lg text-center">
              Try changing your search terms or create your first resume.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() =>
                  navigate("/portal/create", {
                    state: { initialResumeData: { newResume: true } },
                  })
                }
                className="bg-yellow-500 hover:bg-yellow-600 px-4 py-2 rounded-md font-semibold"
              >
                Create Resume
              </button>
              <button
                onClick={() => setQuery("")}
                className="px-4 py-2 border rounded-md"
              >
                Reset
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-6">
            {filtered.map((resume) => (
              <div
                key={resume?._id}
                className="transform hover:-translate-y-1 transition-all duration-300"
              >
                <ResumeCard data={resume} />
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ResumeList;
