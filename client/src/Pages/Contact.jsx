import React, { useState } from "react";
import { motion } from "framer-motion";
import { FiMail, FiUser, FiSend } from "react-icons/fi";
import { toast } from "react-hot-toast";
import axiosInstance from "../Helper/axiosInstance";
import Layout from "../Layout/Layout";
import { isEmail } from "../Helper/regexMatcher";
import { useForm, ValidationError } from '@formspree/react';
import { Link, useNavigate } from "react-router-dom";
import { Navigate } from "react-router-dom";

const Contact = () => {
  const navigate = useNavigate();

  const [userInput, setUserInput] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [state, handleSubmit] = useForm("mkgopolj");
  // if (state.succeeded) {

  //   return (
  //     <Layout>
  //         <main className="h-screen w-full flex flex-col justify-center items-center bg-[#1A2238]">
  //       <h1 className="text-9xl font-extrabold text-white tracking-widest">
  //         Welcome
  //       </h1>
  //       <div className="bg-black text-white px-2 text-sm rounded rotate-12 absolute">
  //           Thanks for joining!
  //       </div>
  //       <button className="mt-5">
  //         <Link className="relative inline-block text-sm font-medium text-[#FF6A3D] group active:text-yellow-500 focus:outline-none focus:ring">
  //           <span className="absolute inset-0 transition-transform translate-x-0.5 translate-y-0.5 bg-[#FF6A3D] group-hover:translate-y-0 group-hover:translate-x-0" />

  //           <span
  //             onClick={() => navigate(-1)}
  //             className="relative block px-8 py-3 bg-[#1A2238] border border-current"
  //           >
  //             Go Back
  //           </span>
  //         </Link>
  //       </button>
  //     </main>
  //     </Layout>
  //   )
  // }

  // function to handle the input change
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUserInput({
      ...userInput,
      [name]: value
    });
  };

  // function to send form data to backend
  const handleFormSubmit = async (event) => {
    event.preventDefault();
    // check for empty fields
    if (!userInput.email || !userInput.name || !userInput.message) {
      toast.error("All fields are mandatory");
      return;
    }

    // email validation using regex
    if (!isEmail(userInput.email)) {
      toast.error("Invalid email");
      return;
    }

    try {
      const res = axiosInstance.post("/contact", userInput);
      toast.promise(res, {
        loading: "Submitting your message...",
        success: "Form submitted successfully",
        error: "Failed to submit the form",
      });
      const contactResponse = await res;
      // console.log(contactResponse);

      // clearing the input fields after successfull submission of form
      if (contactResponse?.data?.success) {
        setUserInput({
          name: "",
          email: "",
          message: "",
        });
      }
    } catch (error) {
      toast.error("Operation failed...");
    }
  };

  return (
    <Layout>
      <div className="min-h-[80vh] flex items-center justify-center p-6">
        <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="w-full max-w-3xl bg-gradient-to-br from-white/5 to-white/3 border border-zinc-800 rounded-2xl p-6 shadow-2xl">

          <motion.header initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }} className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-white">Contact Us</h2>
              <p className="text-sm text-zinc-300">Have feedback or need help? Drop us a message and we'll get back shortly.</p>
            </div>
            <div className="text-zinc-400 text-xs">Typical reply time: 48 hrs</div>
          </motion.header>

          <motion.form onSubmit={handleSubmit} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.05 }} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className="text-sm text-zinc-300 mb-1">Full name</label>
              <div className="relative">
                <input name="name" id="name" value={userInput.name} onChange={handleInputChange} placeholder="Your name" className="w-full rounded-lg px-4 py-3 bg-black/20 text-white outline-none border border-transparent focus:border-yellow-400" />
                <FiUser className="absolute right-3 top-3 text-zinc-400" />
              </div>
              <ValidationError prefix="name" field="name" errors={state.errors} />
            </div>

            <div className="flex flex-col">
              <label className="text-sm text-zinc-300 mb-1">Email</label>
              <div className="relative">
                <input name="email" id="email" value={userInput.email} onChange={handleInputChange} placeholder="you@company.com" className="w-full rounded-lg px-4 py-3 bg-black/20 text-white outline-none border border-transparent focus:border-yellow-400" />
                <FiMail className="absolute right-3 top-3 text-zinc-400" />
              </div>
              <ValidationError prefix="email" field="email" errors={state.errors} />
            </div>

            <div className="md:col-span-2 flex flex-col">
              <label className="text-sm text-zinc-300 mb-1">Message</label>
              <textarea name="message" id="message" value={userInput.message} onChange={handleInputChange} rows={6} placeholder="How can we help?" className="w-full rounded-lg px-4 py-3 bg-black/20 text-white outline-none border border-transparent focus:border-yellow-400 resize-none" />
              <ValidationError prefix="Message" field="message" errors={state.errors} />
            </div>

            <div className="md:col-span-2 flex items-center justify-between gap-4">
              <div className="text-xs text-zinc-400">By submitting you agree to our terms.</div>
              <motion.button whileTap={{ scale: 0.98 }} type="submit" disabled={state.submitting} className="inline-flex items-center gap-3 bg-yellow-500 hover:bg-yellow-600 text-black px-5 py-2 rounded-lg font-semibold">
                <motion.span animate={{ rotate: state.submitting ? 360 : 0 }} transition={{ repeat: state.submitting ? Infinity : 0, duration: 1 }}>
                  <FiSend />
                </motion.span>
                {state.submitting ? "Sending..." : "Send message"}
              </motion.button>
            </div>
          </motion.form>

        </motion.section>
      </div>
    </Layout>
  );
};

export default Contact;
