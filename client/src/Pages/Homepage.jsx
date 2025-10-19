import React, { useEffect, useMemo, useState, useRef } from "react";
import Layout from "../Layout/Layout";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { HiOutlineSearch } from "react-icons/hi";
import { motion } from "framer-motion";
import { fetchAllResumes } from "../Redux/resumeSlice";
import toast from "react-hot-toast";
import axiosInstance from "../Helper/axiosInstance";

const Homepage = () => {
  const dispatch = useDispatch();
  const resumes = useSelector((state) => state.resume?.resumes || []);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [file, setFile] = useState(null);

  const [index, setIndex] = useState(0);
  const [showFeatured, setShowFeatured] = useState(false);
  const autoplay = useRef(null);

  // Fetch resumes on load
  useEffect(() => {
    setLoading(true);
    dispatch(fetchAllResumes()).finally(() => setLoading(false));
  }, [dispatch]);

  // Featured carousel autoplay
  const featured = useMemo(() => resumes.slice(0, 5), [resumes]);
  useEffect(() => {
    if (!featured.length) return;
    autoplay.current = setInterval(() => setIndex((i) => (i + 1) % featured.length), 4000);
    return () => clearInterval(autoplay.current);
  }, [featured.length]);

  // Show carousel after animation
  useEffect(() => {
    const timer = setTimeout(() => setShowFeatured(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  // Filter resumes
  const filteredResumes = useMemo(() => {
    if (!query.trim()) return resumes;
    const q = query.toLowerCase();
    return resumes.filter(
      (r) =>
        (r?.name || "").toLowerCase().includes(q) ||
        (r?.email || "").toLowerCase().includes(q)
    );
  }, [resumes, query]);

  // Client-side suggestions
  // useEffect(() => {
  //   if (!query.trim()) return setSuggestions([]);
  //   const q = query.toLowerCase();
  //   const hints = resumes
  //     .slice(0, 10)
  //     .filter(
  //       (r) =>
  //         (r?.name || "").toLowerCase().includes(q) ||
  //         (r?.email || "").toLowerCase().includes(q)
  //     )
  //     .map((r) => ({ id: r._id, name: r.name }));
  //   setSuggestions(hints);
  // }, [query, resumes]);

  // Upload resume
  // const handleUpload = () => {
  //   if (!file) return toast.error("Select a file first");
  //   const formData = new FormData();
  //   formData.append("resume", file);

  //   toast.loading("Uploading...");
  //   dispatch(uploadResume(formData))
  //     .unwrap()
  //     .then(() => {
  //       toast.dismiss();
  //       toast.success("Resume uploaded!");
  //       setFile(null);
  //     })
  //     .catch((err) => {
  //       toast.dismiss();
  //       toast.error(err?.message || "Upload failed");
  //     });
  // };

  // Summarize resume
  const summarizeResume = (resume) => {
    if (!resume?.content) return toast.error("No content to summarize");
    toast.loading("Generating summary...");
    axiosInstance
      .post("/ai/summary/text", { text: resume.content })
      .then((res) => {
        toast.dismiss();
        alert(res.data.summary || "No summary returned");
      })
      .catch((err) => {
        toast.dismiss();
        toast.error("Failed to generate summary");
      });
  };

  return (
    <Layout>
      <div className="pt-10 text-white px-6 md:px-20 flex flex-col gap-10">

        {/* HERO */}
        <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-8 bg-zinc-800 rounded-2xl p-8 shadow-lg">
          <motion.div
            initial={{ x: -40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-extrabold">
              Manage & Explore <span className="text-yellow-500">Resumes</span>
            </h1>
            <p className="mt-4 text-gray-300">
              Upload, search, and summarize resumes quickly with AI-powered insights.
            </p>

            {/* Upload & Search */}
            <div className="mt-6 flex flex-col sm:flex-row gap-3 items-start sm:items-center">
              <div className="relative w-full sm:w-96">
                <HiOutlineSearch className="absolute left-3 top-3 text-gray-400" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search name or email"
                  className="pl-10 pr-3 py-2 w-full bg-zinc-700 rounded-md border border-zinc-600 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
                {suggestions.length > 0 && (
                  <div className="absolute left-0 mt-12 w-full bg-zinc-900 border border-zinc-700 rounded shadow-lg z-20">
                    {suggestions.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => setQuery(s.name)}
                        className="w-full text-left px-3 py-2 hover:bg-zinc-800"
                      >
                        {s.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-3 mt-2 sm:mt-0">
                <input
                  type="file"
                  onChange={(e) => setFile(e.target.files[0])}
                  className="bg-zinc-700 px-3 py-2 rounded text-white"
                />
                {/* <button
                  onClick={handleUpload}
                  className="px-4 py-2 bg-yellow-500 rounded hover:bg-yellow-600 transition"
                >
                  Upload
                </button> */}
              </div>
            </div>
          </motion.div>
        </div>

        {/* FEATURED RESUMES */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Featured Resumes</h2>
          {featured.length === 0 && loading ? (
            <div className="flex gap-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="w-[22rem] h-[200px] bg-zinc-800 animate-pulse rounded-lg" />
              ))}
            </div>
          ) : (
            <div className="relative w-full h-[250px] flex justify-center items-center overflow-hidden">
              {!showFeatured ? (
                <div className="text-gray-400">Loading animations...</div>
              ) : (
                <div className="flex gap-6 overflow-hidden relative">
                  {featured.map((r, i) => (
                    <motion.div
                      key={r._id}
                      animate={{ x: (i - index) * 280 }}
                      transition={{ type: "spring", stiffness: 120 }}
                      className="min-w-[22rem] max-w-[22rem] bg-zinc-700 rounded-lg p-4"
                    >
                      <h3 className="font-bold text-lg">{r.name}</h3>
                      <p className="text-gray-300 text-sm">{r.email}</p>
                      <button
                        onClick={() => summarizeResume(r)}
                        className="mt-2 px-3 py-1 bg-yellow-500 text-black rounded text-sm"
                      >
                        Summarize
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          )}
        </section>

        {/* RECENT RESUMES */}
        <section>
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Recent Resumes</h2>
            <Link to="/resumes" className="text-yellow-400 hover:underline">
              View All
            </Link>
          </div>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResumes.length === 0 && !loading ? (
              <div className="col-span-full text-center text-gray-400">
                No resumes found.
              </div>
            ) : loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-48 bg-zinc-800 animate-pulse rounded-lg" />
              ))
            ) : (
              filteredResumes.map((r) => (
                <motion.div
                  key={r._id}
                  whileHover={{ scale: 1.03 }}
                  className="bg-zinc-700 rounded-lg p-4"
                >
                  <h3 className="font-bold">{r.name}</h3>
                  <p className="text-gray-300 text-sm">{r.email}</p>
                  <button
                    onClick={() => summarizeResume(r)}
                    className="mt-2 px-3 py-1 bg-yellow-500 text-black rounded text-sm"
                  >
                    Summarize
                  </button>
                </motion.div>
              ))
            )}
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Homepage;
