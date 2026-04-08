import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Avatar,
  Stack,
  Chip,
  Button,
  Divider,
  TextField,
  IconButton,
  Alert,
  Snackbar,
  CircularProgress,
} from "@mui/material";
import { Edit, School, WorkspacePremium, Article, Save, CameraAlt, CloudUpload, InsertDriveFile, CheckCircle, Add } from "@mui/icons-material";
import { useSelector, useDispatch } from "react-redux";
import { selectAuthData, updateUserData } from "../../store/slicers/authSlicer";
import AdminPageHeader from "../../components/Placement/AdminPageHeader";

const StudentProfile = () => {
  const dispatch = useDispatch();
  const authData = useSelector(selectAuthData);
  const user = authData?.user || {};
  const studentId = user.username;
  
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user.name || "",
    email: user.email || "",
    phone: user.phone || "",
    department: user.department || user.dept || "",
    rollNumber: user.rollNumber || "",
    cgpa: user.cgpa || "",
    tenthMark: user.tenthMark || "",
    twelfthMark: user.twelfthMark || "",
    degreeMark: user.degreeMark || "",
    skills: user.skills || [],
    bio: user.bio || "",
  });
  
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeName, setResumeName] = useState(user.resume || "");
  const [newSkill, setNewSkill] = useState("");
  const [toast, setToast] = useState({ open: false, message: "", severity: "success" });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = () => {
    const savedProfile = localStorage.getItem(`student_profile_${studentId}`);
    if (savedProfile) {
      const parsed = JSON.parse(savedProfile);
      setProfileData(parsed);
    }
    const savedResume = localStorage.getItem(`student_resume_${studentId}`);
    if (savedResume) {
      setResumeName(savedResume);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !profileData.skills.includes(newSkill.trim())) {
      setProfileData((prev) => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setProfileData((prev) => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const handleResumeUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const allowedTypes = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
      if (!allowedTypes.includes(file.type)) {
        setToast({ open: true, message: "Only PDF and Word documents are allowed", severity: "error" });
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setToast({ open: true, message: "File size must be less than 5MB", severity: "error" });
        return;
      }
      setResumeFile(file);
      setResumeName(file.name);
      setToast({ open: true, message: "Resume uploaded successfully!", severity: "success" });
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Save to localStorage
      localStorage.setItem(`student_profile_${studentId}`, JSON.stringify(profileData));
      if (resumeName) {
        localStorage.setItem(`student_resume_${studentId}`, resumeName);
      }
      
      // Update Redux store with new user data (especially name)
      dispatch(updateUserData({
        name: profileData.name,
        email: profileData.email,
        phone: profileData.phone,
        department: profileData.department,
        dept: profileData.department, // Keep backward compatibility
        cgpa: profileData.cgpa,
        skills: profileData.skills,
      }));
      
      setToast({ open: true, message: "Profile updated successfully!", severity: "success" });
      setIsEditing(false);
    } catch (error) {
      setToast({ open: true, message: "Error saving profile", severity: "error" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    loadProfileData();
    setIsEditing(false);
  };

  return (
    <Box sx={{ p: 4 }}>
      <AdminPageHeader
        title="Professional Profile 👤"
        description="Manage your academic background, technical skills, and placement documents. This profile is visible to coordinators and recruiters."
        action={
          <Stack direction="row" spacing={2}>
            {isEditing && (
              <Button
                variant="outlined"
                onClick={handleCancel}
                sx={{ borderColor: "rgba(255,255,255,0.2)", color: "text.secondary", fontWeight: 700 }}
                disabled={isSaving}
              >
                Cancel
              </Button>
            )}
            <Button
              variant="contained"
              startIcon={isEditing ? (isSaving ? <CircularProgress size={20} /> : <Save />) : <Edit />}
              onClick={isEditing ? handleSave : () => setIsEditing(true)}
              sx={{ bgcolor: isEditing ? "var(--clr-primary)" : "rgba(255,255,255,0.05)", fontWeight: 700 }}
              disabled={isSaving}
            >
              {isEditing ? (isSaving ? "Saving..." : "Save Profile") : "Edit Profile"}
            </Button>
          </Stack>
        }
      />

      <Grid container spacing={4}>
        {/* Left: Identity Card */}
        <Grid item xs={12} lg={4}>
          <Paper className="glass-card" sx={{ p: 4, textAlign: "center" }}>
            <Box sx={{ position: "relative", display: "inline-block", mb: 3 }}>
              <Avatar
                sx={{ width: 140, height: 140, bgcolor: "var(--clr-primary)", fontSize: "3.5rem", boxShadow: "0 0 40px rgba(16,185,129,0.2)" }}
              >
                {profileData.name.charAt(0).toUpperCase()}
              </Avatar>
              {isEditing && (
                <IconButton sx={{ position: "absolute", bottom: 0, right: 0, bgcolor: "var(--clr-primary)", "&:hover": { bgcolor: "var(--clr-primary)" } }} size="small">
                  <CameraAlt fontSize="small" />
                </IconButton>
              )}
            </Box>
            
            {isEditing ? (
              <Stack spacing={2} sx={{ mb: 3 }}>
                <TextField
                  name="name"
                  label="Full Name"
                  value={profileData.name}
                  onChange={handleChange}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  name="email"
                  label="Email Address"
                  type="email"
                  value={profileData.email}
                  onChange={handleChange}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  name="phone"
                  label="Phone Number"
                  value={profileData.phone}
                  onChange={handleChange}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
              </Stack>
            ) : (
              <>
                <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>{profileData.name || "Student Name"}</Typography>
                {profileData.email && (
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>{profileData.email}</Typography>
                )}
                {profileData.phone && (
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>{profileData.phone}</Typography>
                )}
              </>
            )}

            <Divider sx={{ mb: 4, opacity: 0.1 }} />

            <Stack spacing={3} sx={{ textAlign: "left" }}>
              {isEditing ? (
                <>
                  <TextField
                    name="department"
                    label="Department"
                    value={profileData.department}
                    onChange={handleChange}
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                  />
                  <TextField
                    name="rollNumber"
                    label="Roll Number"
                    value={profileData.rollNumber}
                    onChange={handleChange}
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                  />
                  <TextField
                    name="cgpa"
                    label="CGPA (out of 10)"
                    type="number"
                    inputProps={{ step: "0.01", min: "0", max: "10" }}
                    value={profileData.cgpa}
                    onChange={handleChange}
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                  />
                </>
              ) : (
                <>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <School color="primary" />
                    <Box>
                      <Typography variant="caption" color="text.secondary">Department</Typography>
                      <Typography variant="body2" fontWeight={700}>{profileData.department || "Not specified"}</Typography>
                    </Box>
                  </Box>
                  {profileData.rollNumber && (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <WorkspacePremium color="primary" />
                      <Box>
                        <Typography variant="caption" color="text.secondary">Roll Number</Typography>
                        <Typography variant="body2" fontWeight={700}>{profileData.rollNumber}</Typography>
                      </Box>
                    </Box>
                  )}
                  {profileData.cgpa && (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <WorkspacePremium color="primary" />
                      <Box>
                        <Typography variant="caption" color="text.secondary">CGPA</Typography>
                        <Typography variant="body2" fontWeight={700} sx={{ color: "var(--clr-primary)" }}>{profileData.cgpa}/10</Typography>
                      </Box>
                    </Box>
                  )}
                </>
              )}
            </Stack>
          </Paper>
        </Grid>

        {/* Right: Technical Details */}
        <Grid item xs={12} lg={8}>
          <Stack spacing={4}>
            {/* Academic Details */}
            {isEditing && (
              <Paper className="grid-common" sx={{ p: 4 }}>
                <Typography variant="h6" sx={{ fontWeight: 800, mb: 3, display: "flex", alignItems: "center", gap: 1.5 }}>
                  <School color="primary" /> Academic Details
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={4}>
                    <TextField
                      name="tenthMark"
                      label="10th Mark (%)"
                      type="number"
                      inputProps={{ step: "0.01", min: "0", max: "100" }}
                      value={profileData.tenthMark}
                      onChange={handleChange}
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      name="twelfthMark"
                      label="12th Mark (%)"
                      type="number"
                      inputProps={{ step: "0.01", min: "0", max: "100" }}
                      value={profileData.twelfthMark}
                      onChange={handleChange}
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      name="degreeMark"
                      label="Degree Mark / CGPA"
                      value={profileData.degreeMark}
                      onChange={handleChange}
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                </Grid>
              </Paper>
            )}

            {/* Technical Skills */}
            <Paper className="grid-common" sx={{ p: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 800, mb: 3 }}>Technical Skill Stack</Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 2 }}>
                {profileData.skills.map((skill) => (
                  <Chip
                    key={skill}
                    label={skill}
                    onDelete={isEditing ? () => handleRemoveSkill(skill) : undefined}
                    sx={{
                      bgcolor: "rgba(16, 185, 129, 0.08)",
                      color: "var(--clr-primary)",
                      fontWeight: 700,
                      border: "1px solid rgba(16, 185, 129, 0.2)",
                      "& .MuiChip-deleteIcon": { color: "var(--clr-primary)" }
                    }}
                  />
                ))}
                {profileData.skills.length === 0 && !isEditing && (
                  <Typography variant="body2" color="text.secondary">No skills added yet.</Typography>
                )}
              </Box>
              {isEditing && (
                <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                  <TextField
                    size="small"
                    placeholder="Add a skill..."
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleAddSkill()}
                    sx={{ flex: 1 }}
                  />
                  <Button
                    variant="outlined"
                    startIcon={<Add />}
                    onClick={handleAddSkill}
                    sx={{ borderColor: "var(--clr-primary)", color: "var(--clr-primary)", fontWeight: 700 }}
                  >
                    Add
                  </Button>
                </Box>
              )}
            </Paper>

            {/* Resume Upload */}
            <Paper className="grid-common" sx={{ p: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 800, mb: 3, display: "flex", alignItems: "center", gap: 1.5 }}>
                <Article color="primary" /> Career Credentials
              </Typography>
              
              {resumeName ? (
                <Box sx={{ p: 4, borderRadius: 2, border: "2px solid rgba(16,185,129,0.2)", bgcolor: "rgba(16,185,129,0.03)", textAlign: "center" }}>
                  <InsertDriveFile sx={{ fontSize: "3rem", color: "var(--clr-primary)", mb: 2 }} />
                  <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1 }}>{resumeName}</Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 3 }}>
                    <CheckCircle sx={{ fontSize: "0.9rem", verticalAlign: "middle", mr: 0.5 }} />
                    Resume uploaded successfully
                  </Typography>
                  {isEditing && (
                    <Stack direction="row" spacing={2} justifyContent="center">
                      <input
                        accept=".pdf,.doc,.docx"
                        style={{ display: "none" }}
                        id="resume-upload-edit"
                        type="file"
                        onChange={handleResumeUpload}
                      />
                      <label htmlFor="resume-upload-edit">
                        <Button
                          variant="outlined"
                          component="span"
                          startIcon={<CloudUpload />}
                          size="small"
                          sx={{ borderColor: "var(--clr-primary)", color: "var(--clr-primary)", fontWeight: 700 }}
                        >
                          Update Resume
                        </Button>
                      </label>
                    </Stack>
                  )}
                </Box>
              ) : (
                <Box sx={{ p: 4, borderRadius: 2, border: "2px dashed rgba(255,255,255,0.1)", bgcolor: "rgba(255,255,255,0.01)", textAlign: "center" }}>
                  {isEditing ? (
                    <>
                      <CloudUpload sx={{ fontSize: "3rem", color: "text.secondary", mb: 2 }} />
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>No resume uploaded yet</Typography>
                      <input
                        accept=".pdf,.doc,.docx"
                        style={{ display: "none" }}
                        id="resume-upload-new"
                        type="file"
                        onChange={handleResumeUpload}
                      />
                      <label htmlFor="resume-upload-new">
                        <Button
                          variant="contained"
                          component="span"
                          startIcon={<CloudUpload />}
                          sx={{ bgcolor: "var(--clr-primary)", fontWeight: 700 }}
                        >
                          Upload Resume
                        </Button>
                      </label>
                      <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 2 }}>
                        PDF, DOC, DOCX (Max 5MB)
                      </Typography>
                    </>
                  ) : (
                    <>
                      <Article sx={{ fontSize: "3rem", color: "text.secondary", mb: 2 }} />
                      <Typography variant="body2" color="text.secondary">No resume uploaded</Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>Click "Edit Profile" to upload</Typography>
                    </>
                  )}
                </Box>
              )}
            </Paper>
          </Stack>
        </Grid>
      </Grid>

      <Snackbar 
        open={toast.open} 
        autoHideDuration={3000} 
        onClose={() => setToast({ ...toast, open: false })}
      >
        <Alert severity={toast.severity} sx={{ width: '100%', fontWeight: 700 }}>
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default StudentProfile;
