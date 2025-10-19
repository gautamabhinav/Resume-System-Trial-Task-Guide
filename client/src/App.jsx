// import React from "react";
import { Routes, Route, Router, Link } from "react-router-dom";
import About from "./Pages/About";
import Contact from "./Pages/Contact";
//import CourseList from "./Pages/Course/CourseList";
// import BlogList from "./Pages/Blog/BlogList";
import NotFound from "./Pages/NotFound";
import HomePage from "./Pages/Homepage";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";

// import ForgetPassword from "./Pages/Password/ForgetPassword";
// import ResetPassword from "./Pages/Password/ResetPassword";
import AdminDashboard from "./Pages/Dashboard/AdminDashboard";
// import UserDashboard from "./Pages/Dashboard/UserDashboard";
// import CourseDescription from "./Pages/Course/CourseDescription";

// import BlogDescription from "./Pages/Blog/BlogDescription";
import Profile from "./Pages/User/Profile";
// import ChangePassword from "./Pages/Password/ChangePassword";
import EditProfile from "./Pages/User/EditProfile";
// import CreateCourse from "./Pages/Course/CreateCourse";

// import CreateBlog from "./Pages/Blog/CreateBlog"

// import AddLecture from "./Pages/Dashboard/AddLecture";
// import DisplayLectures from "./Pages/Dashboard/DisplayLectures";
import RequireAuth from "./Components/Auth/RequireAuth";
import NotRequireAuth from "./Components/Auth/NotRequireAuth";
import Denied from "./Pages/Denied";
import ResumePage from "./Pages/Resume/ResumePage";
import ResumeList from "./Pages/Resume/ResumeList";
// import ExcelPage from "./Pages/Excel/ExcelPage";
// import ChartPage from "./Pages/Excel/ChartViewer"
// import ChartViewer from "./Pages/Excel/ChartViewer";
// import CommentForm from "./Components/Comments/CommentForm";
// import CommentList from "./Components/Comments/CommentList";
// import CreateBlog from "./Pages/Blog/CreateBlog";


// import BlogDescription from "./Pages/Blog/BlogDescription";



const App = () => {
  return (
    <>

      <Routes>
        <Route path="/" element={<HomePage />} />
        {/* <Route path="/courses" element={<CourseList />} /> */}
        <Route path="/resumes" element={<ResumeList />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
        <Route path="/denied" element={<Denied />} />
        {/* <Route path="/forgetpassword" element={<ForgetPassword />} /> */}
        {/* <Route path="/reset-password/:resetToken" element={<ResetPassword />} /> */}

        <Route element={<NotRequireAuth />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Route>



        <Route element={<RequireAuth allowedRoles={["USER", "ADMIN", "SUPERADMIN"]} />}>
          {/* <Route path="/blog/description" element={<BlogDescription />} /> */}

          {/* <Route path="/checkout" element={<Checkout />} />
          <Route path="/checkout/success" element={<CheckoutSuccess />} />
          <Route path="/checkout/fail" element={<CheckoutFail />} /> */}

          {/* <Route path="/changepassword" element={<ChangePassword />} /> */}
          <Route path="/user/profile" element={<Profile />} />
          <Route path="/user/editprofile" element={<EditProfile />} />
          {/* <Route path="/user/dashboard" element={<UserDashboard />} /> */}
          {/* <Route path="/course/displaylectures" element={<DisplayLectures />} /> */}
          <Route path="/user/resume" element={<ResumePage />} />

        </Route>

        <Route element={<RequireAuth allowedRoles={["ADMIN", "USER", "SUPERADMIN"]} />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />

          
          {/* <Route path="/excel" element={<ExcelPage />} /> */}
          {/* <Route path="/charts" element={<ChartViewer />} /> */}


          {/* <Route path="/course/addlecture" element={<AddLecture />} /> */}
          {/* <Route path="/blog/create" element={<CreateBlog />} /> */}
          {/* <Route path="/resume/create" element={<CreateResume />} /> */}
          {/* <Route path="/blog/create" element={<CommentForm />} />
          <Route path="/blog/create" element={<CommentList />} /> */}
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

export default App;