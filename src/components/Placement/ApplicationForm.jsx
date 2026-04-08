import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Stack,
  IconButton,
  Alert,
  CircularProgress,
} from "@mui/material";
import {
  CloudUpload,
  InsertDriveFile,
  Close,
  CheckCircle,
} from "@mui/icons-material";
import { useSelector } from "react-redux";
import { selectAuthData } from "../../store/slicers/authSlicer";

const ApplicationForm = ({ open, onClose, jobDetails, onSubmit }) => {
  const authData = useSelector(selectAuthData);
  const user = authData?.user || {};

  const [formData, setFormData] = useState({
    fullName: user.name || "",
    email: user.email || "",
    phone: user.phone || "",
    department: user.department || "",
    rollNumber: user.rollNumber || "",
    cgpa: "",
    tenthMark: "",
    twelfthMark: "",
    degreeMark: "",
    skills: "",
    experience: "",
    coverLetter: "",
  });

  const [resumeFile, setResumeFile] = useState(null);
  const [resumeName, setResumeName] = useState("");
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];
      if (!allowedTypes.includes(file.type)) {
        setErrors((prev) => ({
          ...prev,
          resume: "Only PDF and Word documents are allowed",
        }));
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          resume: "File size must be less than 5MB",
        }));
        return;
      }

      setResumeFile(file);
      setResumeName(file.name);
      setErrors((prev) => ({ ...prev, resume: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Email is invalid";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!formData.department.trim())
      newErrors.department = "Department is required";
    if (!formData.rollNumber.trim())
      newErrors.rollNumber = "Roll number is required";
    if (!formData.cgpa.trim()) newErrors.cgpa = "CGPA is required";
    else if (
      isNaN(formData.cgpa) ||
      parseFloat(formData.cgpa) < 0 ||
      parseFloat(formData.cgpa) > 10
    )
      newErrors.cgpa = "CGPA must be between 0 and 10";
    if (!formData.tenthMark.trim())
      newErrors.tenthMark = "10th mark is required";
    if (!formData.twelfthMark.trim())
      newErrors.twelfthMark = "12th mark is required";
    if (!formData.degreeMark.trim())
      newErrors.degreeMark = "Degree mark is required";
    if (!resumeFile) newErrors.resume = "Resume upload is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Create form data with file upload
      const applicationData = {
        ...formData,
        resume: resumeFile,
        jobDetails: jobDetails,
        studentId: user.username,
        appliedDate: new Date().toISOString(),
      };

      await onSubmit(applicationData);
      handleClose();
    } catch (error) {
      console.error("Error submitting application:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    // Reset form
    setFormData({
      fullName: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      department: user.department || "",
      rollNumber: user.rollNumber || "",
      cgpa: "",
      tenthMark: "",
      twelfthMark: "",
      degreeMark: "",
      skills: "",
      experience: "",
      coverLetter: "",
    });
    setResumeFile(null);
    setResumeName("");
    setErrors({});
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: "rgba(30, 41, 59, 0.95)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          borderRadius: "12px",
        },
      }}
    >
      <DialogTitle
        sx={{
          fontWeight: 800,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          pb: 2,
        }}
      >
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800 }}>
            Application Form
          </Typography>
          {jobDetails && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Applying for: {jobDetails.company} - {jobDetails.role}
            </Typography>
          )}
        </Box>
        <IconButton onClick={handleClose} size="small" sx={{ color: "text.secondary" }}>
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ borderColor: "rgba(255, 255, 255, 0.1)" }}>
        <form onSubmit={handleSubmit}>
          <Stack spacing={3}>
            {/* Personal Information Section */}
            <Box>
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: 700, mb: 2, color: "var(--clr-primary)" }}
              >
                Personal Information
              </Typography>
              <Stack spacing={2}>
                <TextField
                  fullWidth
                  label="Full Name"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  error={!!errors.fullName}
                  helperText={errors.fullName}
                  required
                  InputLabelProps={{ shrink: true }}
                />
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                  <TextField
                    fullWidth
                    label="Email Address"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    error={!!errors.email}
                    helperText={errors.email}
                    required
                    InputLabelProps={{ shrink: true }}
                  />
                  <TextField
                    fullWidth
                    label="Phone Number"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    error={!!errors.phone}
                    helperText={errors.phone}
                    required
                    InputLabelProps={{ shrink: true }}
                  />
                </Stack>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                  <TextField
                    fullWidth
                    label="Department"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    error={!!errors.department}
                    helperText={errors.department}
                    required
                    InputLabelProps={{ shrink: true }}
                  />
                  <TextField
                    fullWidth
                    label="Roll Number"
                    name="rollNumber"
                    value={formData.rollNumber}
                    onChange={handleChange}
                    error={!!errors.rollNumber}
                    helperText={errors.rollNumber}
                    required
                    InputLabelProps={{ shrink: true }}
                  />
                </Stack>
              </Stack>
            </Box>

            {/* Academic Details Section */}
            <Box>
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: 700, mb: 2, color: "var(--clr-primary)" }}
              >
                Academic Details
              </Typography>
              <Stack spacing={2}>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                  <TextField
                    fullWidth
                    label="CGPA (out of 10)"
                    name="cgpa"
                    type="number"
                    inputProps={{ step: "0.01", min: "0", max: "10" }}
                    value={formData.cgpa}
                    onChange={handleChange}
                    error={!!errors.cgpa}
                    helperText={errors.cgpa}
                    required
                    InputLabelProps={{ shrink: true }}
                  />
                  <TextField
                    fullWidth
                    label="10th Mark (%)"
                    name="tenthMark"
                    type="number"
                    inputProps={{ step: "0.01", min: "0", max: "100" }}
                    value={formData.tenthMark}
                    onChange={handleChange}
                    error={!!errors.tenthMark}
                    helperText={errors.tenthMark}
                    required
                    InputLabelProps={{ shrink: true }}
                  />
                  <TextField
                    fullWidth
                    label="12th Mark (%)"
                    name="twelfthMark"
                    type="number"
                    inputProps={{ step: "0.01", min: "0", max: "100" }}
                    value={formData.twelfthMark}
                    onChange={handleChange}
                    error={!!errors.twelfthMark}
                    helperText={errors.twelfthMark}
                    required
                    InputLabelProps={{ shrink: true }}
                  />
                </Stack>
                <TextField
                  fullWidth
                  label="Degree Mark / CGPA"
                  name="degreeMark"
                  value={formData.degreeMark}
                  onChange={handleChange}
                  error={!!errors.degreeMark}
                  helperText={errors.degreeMark}
                  required
                  InputLabelProps={{ shrink: true }}
                />
              </Stack>
            </Box>

            {/* Additional Information Section */}
            <Box>
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: 700, mb: 2, color: "var(--clr-primary)" }}
              >
                Additional Information
              </Typography>
              <Stack spacing={2}>
                <TextField
                  fullWidth
                  label="Skills (comma separated)"
                  name="skills"
                  multiline
                  rows={2}
                  value={formData.skills}
                  onChange={handleChange}
                  placeholder="e.g., React, Node.js, Python, Java"
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  fullWidth
                  label="Work Experience / Internships (if any)"
                  name="experience"
                  multiline
                  rows={3}
                  value={formData.experience}
                  onChange={handleChange}
                  placeholder="Describe your work experience or internships..."
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  fullWidth
                  label="Cover Letter"
                  name="coverLetter"
                  multiline
                  rows={4}
                  value={formData.coverLetter}
                  onChange={handleChange}
                  placeholder="Tell us why you're a great fit for this role..."
                  InputLabelProps={{ shrink: true }}
                />
              </Stack>
            </Box>

            {/* Resume Upload Section */}
            <Box>
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: 700, mb: 2, color: "var(--clr-primary)" }}
              >
                Resume Upload *
              </Typography>
              <Box
                sx={{
                  border: "2px dashed",
                  borderColor: errors.resume ? "error.main" : "rgba(255, 255, 255, 0.2)",
                  borderRadius: "8px",
                  p: 3,
                  textAlign: "center",
                  bgcolor: "rgba(255, 255, 255, 0.02)",
                  transition: "all 0.2s",
                  "&:hover": {
                    borderColor: "var(--clr-primary)",
                    bgcolor: "rgba(16, 185, 129, 0.05)",
                  },
                }}
              >
                <input
                  accept=".pdf,.doc,.docx"
                  style={{ display: "none" }}
                  id="resume-upload"
                  type="file"
                  onChange={handleFileChange}
                />
                <label htmlFor="resume-upload">
                  <Button
                    variant="outlined"
                    component="span"
                    startIcon={<CloudUpload />}
                    sx={{
                      mb: 2,
                      borderColor: "var(--clr-primary)",
                      color: "var(--clr-primary)",
                      fontWeight: 700,
                    }}
                  >
                    Upload Resume
                  </Button>
                </label>
                <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
                  PDF, DOC, DOCX (Max 5MB)
                </Typography>

                {resumeName && (
                  <Box
                    sx={{
                      mt: 2,
                      p: 2,
                      bgcolor: "rgba(16, 185, 129, 0.1)",
                      borderRadius: "6px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 1,
                    }}
                  >
                    <InsertDriveFile sx={{ color: "var(--clr-primary)" }} />
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 600, color: "var(--clr-primary)" }}
                    >
                      {resumeName}
                    </Typography>
                    <CheckCircle sx={{ fontSize: "1rem", color: "var(--clr-primary)" }} />
                  </Box>
                )}

                {errors.resume && (
                  <Alert severity="error" sx={{ mt: 2 }}>
                    {errors.resume}
                  </Alert>
                )}
              </Box>
            </Box>
          </Stack>
        </form>
      </DialogContent>

      <DialogActions
        sx={{
          p: 3,
          borderColor: "rgba(255, 255, 255, 0.1)",
          gap: 2,
        }}
      >
        <Button
          onClick={handleClose}
          variant="outlined"
          sx={{
            borderColor: "rgba(255, 255, 255, 0.2)",
            color: "text.secondary",
            fontWeight: 700,
            px: 3,
          }}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={isSubmitting}
          sx={{
            bgcolor: "var(--clr-primary)",
            fontWeight: 700,
            px: 4,
            minWidth: "150px",
          }}
          startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
        >
          {isSubmitting ? "Submitting..." : "Submit Application"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ApplicationForm;
