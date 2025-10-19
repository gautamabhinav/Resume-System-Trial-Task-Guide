import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchResume } from "../../Redux/resumeSlice";
import ResumeForm from "../../Components/ResumeForm";
import ResumePreview from "../../Components/ResumePreview";
import Layout from "../../Layout/Layout";

export default function ResumePage() {
  const dispatch = useDispatch();

  // Get the logged-in user's ID from Redux auth slice
  const userId = useSelector((state) => state.auth.data?._id || state.auth.data?.userId);
  const authLoading = useSelector((state) => state.auth.loading);

  // Fetch resume when userId is available
  useEffect(() => {
    if (userId) {
      dispatch(fetchResume(userId));
    }
  }, [dispatch, userId]);

  // Show loading while auth state is loading
  if (authLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-screen text-gray-600">
          Loading your profile...
        </div>
      </Layout>
    );
  }

  // If no userId, show login message
  if (!userId) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-screen text-gray-600">
          Please log in to access your resume.
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="grid md:grid-cols-2 gap-6 p-6 bg-gray-50 min-h-screen">
        <ResumeForm userId={userId} />
        <ResumePreview />
      </div>
    </Layout>
  );
}
