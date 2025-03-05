import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiUpload,
  FiCalendar,
  FiFileText,
  FiInfo,
  FiCheckCircle,
  FiAlertCircle,
  FiClock,
  FiUser,
  FiArrowRight,
  FiFile,
  FiDownload,
} from "react-icons/fi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const LeavePage = () => {
  const [formData, setFormData] = useState({
    startDate: "",
    endDate: "",
    leaveType: "annual",
    reason: "",
    file: null,
  });

  const [fileError, setFileError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [daysCount, setDaysCount] = useState(0);
  const [formTouched, setFormTouched] = useState(false);
  const [showFormOption, setShowFormOption] = useState(true);
  const [directUploadFile, setDirectUploadFile] = useState(null);
  const [directUploadError, setDirectUploadError] = useState("");
  const [isDirectUploading, setIsDirectUploading] = useState(false);
  const [usingDirectUpload, setUsingDirectUpload] = useState(false);

  // Calculate days between dates
  useEffect(() => {
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      setDaysCount(diffDays);
    } else {
      setDaysCount(0);
    }
  }, [formData.startDate, formData.endDate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setFormTouched(true);

    // If user starts filling the form, disable direct upload
    if (!usingDirectUpload && formTouched) {
      setDirectUploadFile(null);
      setUsingDirectUpload(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      if (file.type !== "application/pdf") {
        setFileError("Only PDF files are allowed.");
        setFormData((prev) => ({ ...prev, file: null }));
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setFileError("File size must not exceed 5MB.");
        setFormData((prev) => ({ ...prev, file: null }));
        return;
      }

      setFileError("");
      setFormData((prev) => ({ ...prev, file }));
      setFormTouched(true);
    }
  };

  const handleDirectUploadChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      if (file.type !== "application/pdf") {
        setDirectUploadError("Only PDF files are allowed.");
        setDirectUploadFile(null);
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setDirectUploadError("File size must not exceed 5MB.");
        setDirectUploadFile(null);
        return;
      }

      setDirectUploadError("");
      setDirectUploadFile(file);

      // If user selects a file for direct upload, disable form
      setUsingDirectUpload(true);
      setShowFormOption(false);
    }
  };
  const handleDirectUpload = async (e) => {
    e.preventDefault();

    if (!directUploadFile) {
      toast.error("Please select a PDF file to upload.");
      return;
    }

    setIsDirectUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", directUploadFile);

      // Upload PDF to Flask Backend
      const response = await fetch(
        "http://127.0.0.1:5000/pdf/upload-leave-site-pdf",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) throw new Error("Failed to upload file to backend");

      const data = await response.json();
      console.log("Backend Upload Response:", data);

      const pdfUrl = data.pdf_url; // ✅ Direct PDF link from backend

      toast.success("Leave application PDF uploaded successfully");
      await submitLeaveRequest(leaveDetails, pdfUrl);

      // ✅ Open PDF in a new tab
      // window.open(pdfUrl, "_blank");

      // Reset form
      setDirectUploadFile(null);
      document.getElementById("direct-file-upload").value = "";
      setUsingDirectUpload(false);
      setShowFormOption(true);
    } catch (error) {
      console.error("Upload Error:", error);
      toast.error("Upload failed. Try again.");
    } finally {
      setIsDirectUploading(false);
    }
  };

  const submitLeaveRequest = async (leaveDetails, pdfUrl = null) => {
    try {
      const token = localStorage.getItem("token"); // Get token from localStorage

      const response = await fetch("http://127.0.0.1:5000/add-leave", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // ✅ Add Authorization header
        },
        body: JSON.stringify({
          employee_name: leaveDetails["Employee Name"],
          employee_email: leaveDetails["Employee Email"],
          leave_type: leaveDetails["Leave Type"],
          start_date: leaveDetails["Leave Start Date"],
          end_date: leaveDetails["Leave End Date"],
          reason: leaveDetails["Leave Reason"],
          pdf_url: pdfUrl, // ✅ Attach PDF link if available
        }),
      });
      if (!response.ok) throw new Error("Failed to add leave request");

      toast.success("Leave request added successfully!");
      return true;
    } catch (error) {
      console.error("Leave Submission Error:", error);
      toast.error("Failed to submit leave request.");
      return false;
    }
  };

  const switchToForm = (e) => {
    e.preventDefault();
    setShowFormOption(true);
    setUsingDirectUpload(false);
    setDirectUploadFile(null);
    if (document.getElementById("direct-file-upload")) {
      document.getElementById("direct-file-upload").value = "";
    }
  };

  const switchToDirectUpload = (e) => {
    e.preventDefault();
    setShowFormOption(false);
    setUsingDirectUpload(true);
    setFormData({
      startDate: "",
      endDate: "",
      leaveType: "annual",
      reason: "",
      file: null,
    });
    setFormTouched(false);
    setCurrentStep(1);
  };

  const nextStep = () => {
    if (currentStep === 1) {
      if (!formData.startDate || !formData.endDate || !formData.leaveType) {
        toast.error("Please fill all required fields in this step");
        return;
      }

      if (new Date(formData.startDate) > new Date(formData.endDate)) {
        toast.error("Start date must be before end date");
        return;
      }
    }

    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.startDate || !formData.endDate || !formData.reason) {
      toast.error("Please fill in all required fields.");
      return;
    }

    if (new Date(formData.startDate) > new Date(formData.endDate)) {
      toast.error("Start date must be before end date.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Construct leave details
      const leaveDetails = {
        // "Employee Name": "John Doe", // Replace with actual user data
        // "Employee Email": "john.doe@example.com", // Replace with actual email
        "Leave Type": formData.leaveType,
        "Leave Start Date": formData.startDate,
        "Leave End Date": formData.endDate,
        "Leave Reason": formData.reason,
      };
      console.log(leaveDetails);

      // ✅ Call reusable function to submit leave request
      const success = await submitLeaveRequest(leaveDetails);
      console.log(success);
      if (success) {
        toast.success("Leave application submitted successfully");

        // Reset form
        setFormData({
          startDate: "",
          endDate: "",
          leaveType: "annual",
          reason: "",
          file: null,
        });

        document.getElementById("file-upload").value = "";
        setCurrentStep(1);
        setFormTouched(false);
        console.log("BYEEE");
      }
    } catch (error) {
      console.error("Leave Submission Error:", error);
      toast.error("Submission failed. Try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getLeaveTypeColor = (type) => {
    switch (type) {
      case "annual":
        return "bg-emerald-100 text-emerald-800";
      case "sick":
        return "bg-red-100 text-red-800";
      case "personal":
        return "bg-blue-100 text-blue-800";
      case "unpaid":
        return "bg-amber-100 text-amber-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getLeaveTypeLabel = (type) => {
    switch (type) {
      case "annual":
        return "Annual Leave";
      case "sick":
        return "Sick Leave";
      case "personal":
        return "Personal Leave";
      case "unpaid":
        return "Unpaid Leave";
      default:
        return "Other";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const stepVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, x: -50, transition: { duration: 0.3 } },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-4xl font-bold text-gray-800 mb-2"
          >
            Employee Leave Portal
          </motion.h1>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="h-1 w-24 bg-gradient-to-r from-blue-500 to-indigo-600 mx-auto mb-4 rounded-full"
          ></motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="text-gray-600"
          >
            Request time off with our streamlined application process
          </motion.p>
        </div>

        {/* Option Selector */}
        <div className="mb-6 flex justify-center">
          <div className="bg-white rounded-lg shadow-md p-2 inline-flex">
            <button
              onClick={switchToDirectUpload}
              className={`px-4 py-2 rounded-md font-medium transition-all ${
                usingDirectUpload
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <FiUpload className="inline mr-2" />
              Upload PDF
            </button>
            <button
              onClick={switchToForm}
              className={`px-4 py-2 rounded-md font-medium transition-all ${
                !usingDirectUpload
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <FiFileText className="inline mr-2" />
              Fill Form
            </button>
          </div>
        </div>

        {/* Direct PDF Upload Option */}
        {usingDirectUpload && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8"
          >
            <div className="bg-gradient-to-r from-blue-600 to-indigo-500 px-6 py-4">
              <h2 className="text-white text-xl font-semibold">
                Quick Upload - Pre-filled Leave Application
              </h2>
            </div>
            <div className="p-6">
              <div className="flex flex-col md:flex-row md:items-center gap-6">
                <div className="flex-1">
                  <p className="text-gray-700 mb-4">
                    Already have a completed leave application form? Upload it
                    directly instead of filling out the form.
                  </p>
                  <div className="flex items-center gap-3 mb-4">
                    <a
                      href="#"
                      className="flex items-center text-indigo-600 hover:text-indigo-800 font-medium"
                      onClick={(e) => {
                        e.preventDefault();
                        toast.info("Template download would start here");
                      }}
                    >
                      <FiDownload className="mr-1" />
                      Download template
                    </a>
                  </div>
                </div>

                <div className="flex-1">
                  <form
                    onSubmit={handleDirectUpload}
                    className="flex flex-col md:flex-row gap-4 items-end"
                  >
                    <div className="flex-1">
                      <div className="relative">
                        <input
                          id="direct-file-upload"
                          type="file"
                          accept=".pdf"
                          className="hidden"
                          onChange={handleDirectUploadChange}
                        />
                        <label
                          htmlFor="direct-file-upload"
                          className="flex items-center gap-2 w-full px-4 py-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-indigo-50 transition-colors"
                        >
                          <FiFile className="text-indigo-500" />
                          <span className="text-gray-700 truncate">
                            {directUploadFile
                              ? "File Input"
                              : "Select PDF file"}
                          </span>
                        </label>
                      </div>
                      {directUploadError && (
                        <p className="mt-1 text-sm text-red-600">
                          {directUploadError}
                        </p>
                      )}
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-md flex items-center justify-center gap-2 whitespace-nowrap"
                      disabled={
                        isDirectUploading ||
                        !!directUploadError ||
                        !directUploadFile
                      }
                    >
                      {isDirectUploading ? (
                        <>
                          <svg
                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Uploading...
                        </>
                      ) : (
                        <>
                          <FiUpload />
                          Upload PDF
                        </>
                      )}
                    </motion.button>
                  </form>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {!usingDirectUpload && (
          <>
            {/* Progress Steps */}
            <div className="mb-8">
              <div className="flex items-center justify-center">
                <div className="flex items-center w-full max-w-3xl">
                  {[1, 2, 3].map((step) => (
                    <div key={step} className="flex-1 relative">
                      <div className="flex items-center">
                        <motion.div
                          initial={{ scale: 0.8 }}
                          animate={{
                            scale: 1,
                            backgroundColor:
                              currentStep >= step
                                ? "rgb(79, 70, 229)"
                                : "rgb(209, 213, 219)",
                          }}
                          className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold z-10 relative
                            ${
                              currentStep >= step
                                ? "bg-indigo-600"
                                : "bg-gray-300"
                            }`}
                        >
                          {step}
                        </motion.div>
                        {step < 3 && (
                          <div
                            className={`flex-1 h-1 ${
                              currentStep > step
                                ? "bg-indigo-600"
                                : "bg-gray-300"
                            }`}
                          ></div>
                        )}
                      </div>
                      <div className="text-xs text-center mt-2 font-medium">
                        {step === 1
                          ? "Leave Details"
                          : step === 2
                          ? "Reason & Documents"
                          : "Review & Submit"}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Main Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="bg-white rounded-2xl shadow-xl overflow-hidden"
            >
              <div className="bg-gradient-to-r from-indigo-600 to-blue-500 px-6 py-4">
                <h2 className="text-white text-xl font-semibold">
                  {currentStep === 1
                    ? "Leave Request Details"
                    : currentStep === 2
                    ? "Supporting Information"
                    : "Review Your Application"}
                </h2>
              </div>

              <form onSubmit={handleSubmit} className="p-6">
                <AnimatePresence mode="wait">
                  {currentStep === 1 && (
                    <motion.div
                      key="step1"
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      variants={stepVariants}
                      className="space-y-6"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="flex items-center gap-2 text-gray-700 font-medium mb-2">
                            <FiCalendar className="text-indigo-500" />
                            Start Date
                          </label>
                          <div className="relative">
                            <input
                              type="date"
                              name="startDate"
                              value={formData.startDate}
                              onChange={handleChange}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 focus:outline-none transition-all duration-200"
                              min={new Date().toISOString().split("T")[0]}
                              required
                            />
                          </div>
                        </div>

                        <div>
                          <label className="flex items-center gap-2 text-gray-700 font-medium mb-2">
                            <FiCalendar className="text-indigo-500" />
                            End Date
                          </label>
                          <div className="relative">
                            <input
                              type="date"
                              name="endDate"
                              value={formData.endDate}
                              onChange={handleChange}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 focus:outline-none transition-all duration-200"
                              min={
                                formData.startDate ||
                                new Date().toISOString().split("T")[0]
                              }
                              required
                            />
                          </div>
                        </div>
                      </div>

                      {formData.startDate && formData.endDate && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className="flex items-center justify-center p-3 bg-indigo-50 rounded-lg"
                        >
                          <FiClock className="text-indigo-500 mr-2" />
                          <span className="text-indigo-700 font-medium">
                            {daysCount} {daysCount === 1 ? "day" : "days"} of
                            leave requested
                          </span>
                        </motion.div>
                      )}

                      <div>
                        <label className="flex items-center gap-2 text-gray-700 font-medium mb-2">
                          <FiInfo className="text-indigo-500" />
                          Leave Type
                        </label>
                        <select
                          name="leaveType"
                          value={formData.leaveType}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 focus:outline-none transition-all duration-200 appearance-none"
                          style={{
                            backgroundImage:
                              'url(\'data:image/svg+xml;charset=US-ASCII,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="%236366F1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>\')',
                            backgroundRepeat: "no-repeat",
                            backgroundPosition: "right 1rem center",
                            backgroundSize: "1em",
                          }}
                        >
                          <option value="annual">Annual Leave</option>
                          <option value="sick">Sick Leave</option>
                          <option value="personal">Personal Leave</option>
                          <option value="unpaid">Unpaid Leave</option>
                          <option value="other">Other</option>
                        </select>
                      </div>

                      <div className="flex justify-end">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          type="button"
                          onClick={nextStep}
                          className="flex items-center justify-center gap-2 bg-indigo-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-indigo-700 transition-all duration-200 shadow-md"
                        >
                          Continue
                          <FiArrowRight />
                        </motion.button>
                      </div>
                    </motion.div>
                  )}

                  {currentStep === 2 && (
                    <motion.div
                      key="step2"
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      variants={stepVariants}
                      className="space-y-6"
                    >
                      <div>
                        <label className="flex items-center gap-2 text-gray-700 font-medium mb-2">
                          <FiFileText className="text-indigo-500" />
                          Reason for Leave
                        </label>
                        <textarea
                          name="reason"
                          value={formData.reason}
                          onChange={handleChange}
                          rows="4"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 focus:outline-none transition-all duration-200"
                          placeholder="Please provide details about your leave request..."
                          required
                        />
                      </div>

                      <div>
                        <label className="flex items-center gap-2 text-gray-700 font-medium mb-2">
                          <FiUpload className="text-indigo-500" />
                          Supporting Document (PDF)
                        </label>
                        <div className="mt-2 flex flex-col items-center justify-center p-6 border-2 border-dashed border-indigo-300 rounded-lg bg-indigo-50 transition-all duration-200 hover:bg-indigo-100">
                          <input
                            id="file-upload"
                            type="file"
                            accept=".pdf"
                            className="hidden"
                            onChange={handleFileChange}
                          />
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <label
                              htmlFor="file-upload"
                              className="cursor-pointer flex flex-col items-center"
                            >
                              <div className="w-16 h-16 bg-indigo-200 rounded-full flex items-center justify-center mb-3">
                                <FiUpload className="text-indigo-600 text-xl" />
                              </div>
                              <span className="px-4 py-2 bg-indigo-600 text-white rounded-md font-medium hover:bg-indigo-700 transition">
                                Select PDF File
                              </span>
                              <p className="text-sm text-gray-500 mt-2">
                                PDF up to 5MB
                              </p>
                            </label>
                          </motion.div>

                          {formData.file && (
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="flex items-center mt-4 p-3 bg-green-100 text-green-800 rounded-lg"
                            >
                              <FiCheckCircle className="mr-2" />
                              <span className="text-sm font-medium">
                                {formData.file.name}
                              </span>
                            </motion.div>
                          )}

                          {fileError && (
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="flex items-center mt-4 p-3 bg-red-100 text-red-800 rounded-lg"
                            >
                              <FiAlertCircle className="mr-2" />
                              <span className="text-sm font-medium">
                                {fileError}
                              </span>
                            </motion.div>
                          )}
                        </div>
                      </div>

                      <div className="flex justify-between">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          type="button"
                          onClick={prevStep}
                          className="flex items-center justify-center gap-2 bg-gray-200 text-gray-800 py-3 px-6 rounded-lg font-semibold hover:bg-gray-300 transition-all duration-200"
                        >
                          Back
                        </motion.button>

                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          type="button"
                          onClick={nextStep}
                          className="flex items-center justify-center gap-2 bg-indigo-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-indigo-700 transition-all duration-200 shadow-md"
                          disabled={!formData.reason}
                        >
                          Review Application
                          <FiArrowRight />
                        </motion.button>
                      </div>
                    </motion.div>
                  )}

                  {currentStep === 3 && (
                    <motion.div
                      key="step3"
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      variants={stepVariants}
                      className="space-y-6"
                    >
                      <div className="bg-indigo-50 p-6 rounded-lg">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">
                          Review Your Application
                        </h3>

                        <div className="space-y-4">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-indigo-100">
                            <span className="text-gray-600 font-medium">
                              Leave Type
                            </span>
                            <span
                              className={`mt-1 sm:mt-0 px-3 py-1 rounded-full text-sm font-medium ${getLeaveTypeColor(
                                formData.leaveType
                              )}`}
                            >
                              {getLeaveTypeLabel(formData.leaveType)}
                            </span>
                          </div>

                          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-indigo-100">
                            <span className="text-gray-600 font-medium">
                              Duration
                            </span>
                            <div className="mt-1 sm:mt-0 text-right">
                              <div className="text-gray-800 font-medium">
                                {daysCount} {daysCount === 1 ? "day" : "days"}
                              </div>
                              <div className="text-sm text-gray-500">
                                {formatDate(formData.startDate)} -{" "}
                                {formatDate(formData.endDate)}
                              </div>
                            </div>
                          </div>

                          <div className="pb-3 border-b border-indigo-100">
                            <span className="text-gray-600 font-medium">
                              Reason
                            </span>
                            <p className="mt-2 text-gray-800 bg-white p-3 rounded-md">
                              {formData.reason}
                            </p>
                          </div>

                          <div>
                            <span className="text-gray-600 font-medium">
                              Supporting Document
                            </span>
                            <div className="mt-2">
                              {formData.file ? (
                                <div className="flex items-center bg-white p-3 rounded-md">
                                  <div className="w-10 h-10 bg-indigo-100 rounded-md flex items-center justify-center mr-3">
                                    <FiFileText className="text-indigo-600" />
                                  </div>
                                  <div>
                                    <div className="text-gray-800 font-medium">
                                      {formData.file.name}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                      {(formData.file.size / 1024).toFixed(2)}{" "}
                                      KB
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <div className="text-amber-600 bg-amber-50 p-3 rounded-md flex items-center">
                                  <FiAlertCircle className="mr-2" />
                                  No document attached
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-between">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          type="button"
                          onClick={prevStep}
                          className="flex items-center justify-center gap-2 bg-gray-200 text-gray-800 py-3 px-6 rounded-lg font-semibold hover:bg-gray-300 transition-all duration-200"
                        >
                          Back
                        </motion.button>

                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          type="submit"
                          className="flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-blue-500 text-white py-3 px-8 rounded-lg font-semibold hover:from-indigo-700 hover:to-blue-600 transition-all duration-200 shadow-md"
                          disabled={isSubmitting || fileError}
                        >
                          {isSubmitting ? (
                            <>
                              <svg
                                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                ></circle>
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                              </svg>
                              Processing...
                            </>
                          ) : (
                            <>
                              Submit Application
                              <FiCheckCircle />
                            </>
                          )}
                        </motion.button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
            </motion.div>
          </>
        )}

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 text-sm">
            Need assistance? Contact HR at{" "}
            <a
              href="mailto:hr@company.com"
              className="text-indigo-600 hover:text-indigo-800 font-medium"
            >
              hr@company.com
            </a>
          </p>
        </div>
      </motion.div>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </div>
  );
};

export default LeavePage;
