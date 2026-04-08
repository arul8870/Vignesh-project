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
  useMediaQuery,
  Card,
  CardContent,
} from "@mui/material";
import {
  Edit,
  School,
  WorkspacePremium,
  Article,
  Save,
  CameraAlt,
  CloudUpload,
  InsertDriveFile,
  CheckCircle,
  Add,
  Email,
  Phone,
  LocationOn,
  Star,
} from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import { alpha } from "@mui/material/styles";
import { useSelector, useDispatch } from "react-redux";
import { selectAuthData, updateUserData } from "../../store/slicers/authSlicer";
import AdminPageHeader from "../../components/Placement/AdminPageHeader";

const StudentProfile = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));
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
      localStorage.setItem(`student_profile_${studentId}`, JSON.stringify(profileData));
      if (resumeName) {
        localStorage.setItem(`student_resume_${studentId}`, resumeName);
      }
      
      dispatch(updateUserData({
        name: profileData.name,
        email: profileData.email,
        phone: profileData.phone,
        department: profileData.department,
        dept: profileData.department,
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
    <Box sx={{ p: isMobile ? 1.5 : isTablet ? 2 : 4 }}>
      {/* Header with Actions */}
      <Paper
        sx={{
          p: isMobile ? 2.5 : 4,
          mb: isMobile ? 2.5 : 4,
          background: "linear-gradient(135deg, rgba(168, 85, 247, 0.15) 0%, rgba(59, 130, 246, 0.1) 100%)",
          border: `1px solid ${alpha("#a855f7", 0.2)}`,
          borderRadius: isMobile ? 3 : 4,
        }}
      >
        <Stack
          direction={isMobile ? "column" : "row"}
          justifyContent="space-between"
          alignItems={isMobile ? "flex-start" : "center"}
          spacing={isMobile ? 2 : 0}
        >
          <Box>
            <Typography
              variant={isMobile ? "h5" : "h4"}
              sx={{
                fontWeight: 800,
                mb: 1,
                background: "linear-gradient(135deg, #a855f7 0%, #3b82f6 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Professional Profile 👤
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: "text.secondary",
                fontSize: isMobile ? "0.875rem" : "1rem",
              }}
            >
              Manage your academic background, skills, and placement documents.
            </Typography>
          </Box>
          
          <Stack direction="row" spacing={isMobile ? 1 : 2}>
            {isEditing && (
              <Button
                variant="outlined"
                onClick={handleCancel}
                sx={{
                  borderColor: alpha(theme.palette.divider, 0.2),
                  color: "text.secondary",
                  fontWeight: 700,
                  borderRadius: 2,
                  px: 3,
                }}
                disabled={isSaving}
              >
                Cancel
              </Button>
            )}
            <Button
              variant="contained"
              startIcon={isEditing ? (isSaving ? <CircularProgress size={20} /> : <Save />) : <Edit />}
              onClick={isEditing ? handleSave : () => setIsEditing(true)}
              sx={{
                bgcolor: isEditing ? "var(--clr-primary)" : alpha(theme.palette.primary.main, 0.1),
                fontWeight: 700,
                borderRadius: 2,
                px: 3,
                transition: "all 0.3s ease",
                "&:hover": {
                  bgcolor: isEditing ? "var(--clr-primary-dark)" : alpha(theme.palette.primary.main, 0.2),
                },
              }}
              disabled={isSaving}
            >
              {isEditing ? (isSaving ? "Saving..." : "Save Profile") : "Edit Profile"}
            </Button>
          </Stack>
        </Stack>
      </Paper>

      <Grid container spacing={isMobile ? 2 : 3}>
        {/* Left: Profile Card */}
        <Grid item xs={12} lg={4}>
          <Card
            sx={{
              borderRadius: 3,
              bgcolor: alpha(theme.palette.background.paper, 0.6),
              border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              overflow: "visible",
            }}
          >
            {/* Avatar Section */}
            <Box
              sx={{
                p: isMobile ? 3 : 4,
                pb: isMobile ? 2.5 : 3,
                textAlign: "center",
                background: "linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(59, 130, 246, 0.08) 100%)",
                position: "relative",
              }}
            >
              <Box sx={{ position: "relative", display: "inline-block", mb: 2 }}>
                <Avatar
                  sx={{
                    width: isMobile ? 100 : 120,
                    height: isMobile ? 100 : 120,
                    bgcolor: "transparent",
                    background: "linear-gradient(135deg, #10b981 0%, #3b82f6 100%)",
                    fontSize: isMobile ? "2.5rem" : "3rem",
                    boxShadow: `0 8px 24px ${alpha("#10b981", 0.3)}`,
                    border: `4px solid ${alpha("#ffffff", 0.2)}`,
                  }}
                >
                  {profileData.name.charAt(0).toUpperCase()}
                </Avatar>
                {isEditing && (
                  <IconButton
                    sx={{
                      position: "absolute",
                      bottom: 0,
                      right: 0,
                      bgcolor: "var(--clr-primary)",
                      border: `3px solid ${theme.palette.background.paper}`,
                      "&:hover": { bgcolor: "var(--clr-primary-dark)" },
                      width: 36,
                      height: 36,
                    }}
                    size="small"
                  >
                    <CameraAlt fontSize="small" />
                  </IconButton>
                )}
              </Box>
              
              {isEditing ? (
                <Stack spacing={1.5} sx={{ mt: 2 }}>
                  <TextField
                    name="name"
                    label="Full Name"
                    value={profileData.name}
                    onChange={handleChange}
                    fullWidth
                    size="small"
                    InputLabelProps={{ shrink: true }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                        bgcolor: alpha(theme.palette.background.default, 0.5),
                      },
                    }}
                  />
                  <TextField
                    name="email"
                    label="Email Address"
                    type="email"
                    value={profileData.email}
                    onChange={handleChange}
                    fullWidth
                    size="small"
                    InputLabelProps={{ shrink: true }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                        bgcolor: alpha(theme.palette.background.default, 0.5),
                      },
                    }}
                  />
                  <TextField
                    name="phone"
                    label="Phone Number"
                    value={profileData.phone}
                    onChange={handleChange}
                    fullWidth
                    size="small"
                    InputLabelProps={{ shrink: true }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                        bgcolor: alpha(theme.palette.background.default, 0.5),
                      },
                    }}
                  />
                </Stack>
              ) : (
                <>
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 800,
                      mb: 0.5,
                      fontSize: isMobile ? "1.25rem" : "1.5rem",
                    }}
                  >
                    {profileData.name || "Student Name"}
                  </Typography>
                  {profileData.email && (
                    <Stack direction="row" alignItems="center" justifyContent="center" spacing={0.5} sx={{ mb: 0.5 }}>
                      <Email sx={{ fontSize: "0.875rem", color: "text.secondary" }} />
                      <Typography variant="body2" color="text.secondary" sx={{ fontSize: isMobile ? "0.8125rem" : "0.875rem" }}>
                        {profileData.email}
                      </Typography>
                    </Stack>
                  )}
                  {profileData.phone && (
                    <Stack direction="row" alignItems="center" justifyContent="center" spacing={0.5}>
                      <Phone sx={{ fontSize: "0.875rem", color: "text.secondary" }} />
                      <Typography variant="body2" color="text.secondary" sx={{ fontSize: isMobile ? "0.8125rem" : "0.875rem" }}>
                        {profileData.phone}
                      </Typography>
                    </Stack>
                  )}
                </>
              )}
            </Box>

            <Divider sx={{ opacity: 0.1 }} />

            {/* Details Section */}
            <CardContent sx={{ p: isMobile ? 2.5 : 4, pt: isMobile ? 2 : 3 }}>
              <Stack spacing={isMobile ? 2 : 2.5}>
                {isEditing ? (
                  <>
                    <TextField
                      name="department"
                      label="Department"
                      value={profileData.department}
                      onChange={handleChange}
                      fullWidth
                      size="small"
                      InputLabelProps={{ shrink: true }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                          bgcolor: alpha(theme.palette.background.default, 0.5),
                        },
                      }}
                    />
                    <TextField
                      name="rollNumber"
                      label="Roll Number"
                      value={profileData.rollNumber}
                      onChange={handleChange}
                      fullWidth
                      size="small"
                      InputLabelProps={{ shrink: true }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                          bgcolor: alpha(theme.palette.background.default, 0.5),
                        },
                      }}
                    />
                    <TextField
                      name="cgpa"
                      label="CGPA (out of 10)"
                      type="number"
                      inputProps={{ step: "0.01", min: "0", max: "10" }}
                      value={profileData.cgpa}
                      onChange={handleChange}
                      fullWidth
                      size="small"
                      InputLabelProps={{ shrink: true }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                          bgcolor: alpha(theme.palette.background.default, 0.5),
                        },
                      }}
                    />
                  </>
                ) : (
                  <>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Avatar sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1), width: 40, height: 40 }}>
                        <School sx={{ color: theme.palette.primary.main, fontSize: "1.25rem" }} />
                      </Avatar>
                      <Box>
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>Department</Typography>
                        <Typography variant="body2" fontWeight={700} sx={{ fontSize: isMobile ? "0.875rem" : "1rem" }}>
                          {profileData.department || "Not specified"}
                        </Typography>
                      </Box>
                    </Box>
                    {profileData.rollNumber && (
                      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Avatar sx={{ bgcolor: alpha("#f59e0b", 0.1), width: 40, height: 40 }}>
                          <WorkspacePremium sx={{ color: "#f59e0b", fontSize: "1.25rem" }} />
                        </Avatar>
                        <Box>
                          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>Roll Number</Typography>
                          <Typography variant="body2" fontWeight={700} sx={{ fontSize: isMobile ? "0.875rem" : "1rem" }}>
                            {profileData.rollNumber}
                          </Typography>
                        </Box>
                      </Box>
                    )}
                    {profileData.cgpa && (
                      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Avatar sx={{ bgcolor: alpha("#10b981", 0.1), width: 40, height: 40 }}>
                          <Star sx={{ color: "#10b981", fontSize: "1.25rem" }} />
                        </Avatar>
                        <Box>
                          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>CGPA</Typography>
                          <Typography variant="body2" fontWeight={800} sx={{ color: "var(--clr-primary)", fontSize: isMobile ? "0.875rem" : "1rem" }}>
                            {profileData.cgpa}/10
                          </Typography>
                        </Box>
                      </Box>
                    )}
                  </>
                )}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Right: Skills & Resume */}
        <Grid item xs={12} lg={8}>
          <Stack spacing={isMobile ? 2 : 3}>
            {/* Skills Card */}
            <Card
              sx={{
                borderRadius: 3,
                bgcolor: alpha(theme.palette.background.paper, 0.6),
                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              }}
            >
              <CardContent sx={{ p: isMobile ? 2.5 : 4 }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 800,
                    mb: isMobile ? 2 : 3,
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    fontSize: isMobile ? "1rem" : "1.25rem",
                  }}
                >
                  <Star sx={{ color: "#fbbf24" }} /> Technical Skill Stack
                </Typography>
                
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: isMobile ? 1 : 1.5, mb: 2 }}>
                  {profileData.skills.map((skill) => (
                    <Chip
                      key={skill}
                      label={skill}
                      onDelete={isEditing ? () => handleRemoveSkill(skill) : undefined}
                      sx={{
                        bgcolor: alpha("#10b981", 0.1),
                        color: "var(--clr-primary)",
                        fontWeight: 700,
                        border: `1px solid ${alpha("#10b981", 0.2)}`,
                        "& .MuiChip-deleteIcon": { color: "var(--clr-primary)" },
                        fontSize: isMobile ? "0.8125rem" : "0.875rem",
                      }}
                    />
                  ))}
                  {profileData.skills.length === 0 && !isEditing && (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ fontSize: isMobile ? "0.875rem" : "1rem" }}
                    >
                      No skills added yet.
                    </Typography>
                  )}
                </Box>
                
                {isEditing && (
                  <Stack direction={isMobile ? "column" : "row"} spacing={isMobile ? 1 : 1.5}>
                    <TextField
                      size="small"
                      placeholder="Add a skill..."
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleAddSkill()}
                      sx={{
                        flex: 1,
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                          bgcolor: alpha(theme.palette.background.default, 0.5),
                        },
                      }}
                    />
                    <Button
                      variant="outlined"
                      startIcon={<Add />}
                      onClick={handleAddSkill}
                      sx={{
                        borderColor: "var(--clr-primary)",
                        color: "var(--clr-primary)",
                        fontWeight: 700,
                        borderRadius: 2,
                        px: 3,
                      }}
                    >
                      Add
                    </Button>
                  </Stack>
                )}
              </CardContent>
            </Card>

            {/* Resume Upload Card */}
            <Card
              sx={{
                borderRadius: 3,
                bgcolor: alpha(theme.palette.background.paper, 0.6),
                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              }}
            >
              <CardContent sx={{ p: isMobile ? 2.5 : 4 }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 800,
                    mb: isMobile ? 2 : 3,
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    fontSize: isMobile ? "1rem" : "1.25rem",
                  }}
                >
                  <Article color="primary" /> Career Credentials
                </Typography>
                
                {resumeName ? (
                  <Paper
                    sx={{
                      p: isMobile ? 3 : 4,
                      borderRadius: 3,
                      border: `2px solid ${alpha("#10b981", 0.2)}`,
                      bgcolor: alpha("#10b981", 0.03),
                      textAlign: "center",
                    }}
                  >
                    <InsertDriveFile
                      sx={{
                        fontSize: isMobile ? "3rem" : "4rem",
                        color: "var(--clr-primary)",
                        mb: 1.5,
                      }}
                    />
                    <Typography
                      variant="subtitle1"
                      fontWeight={700}
                      sx={{ mb: 1, fontSize: isMobile ? "0.875rem" : "1rem" }}
                    >
                      {resumeName}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 0.5,
                        mb: 2.5,
                        fontSize: isMobile ? "0.75rem" : "0.875rem",
                      }}
                    >
                      <CheckCircle sx={{ fontSize: "0.875rem" }} />
                      Resume uploaded successfully
                    </Typography>
                    {isEditing && (
                      <Stack direction={isMobile ? "column" : "row"} spacing={1.5} justifyContent="center">
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
                            sx={{
                              borderColor: "var(--clr-primary)",
                              color: "var(--clr-primary)",
                              fontWeight: 700,
                              borderRadius: 2,
                            }}
                          >
                            Update Resume
                          </Button>
                        </label>
                      </Stack>
                    )}
                  </Paper>
                ) : (
                  <Paper
                    sx={{
                      p: isMobile ? 3 : 4,
                      borderRadius: 3,
                      border: `2px dashed ${alpha(theme.palette.divider, 0.2)}`,
                      bgcolor: alpha(theme.palette.divider, 0.02),
                      textAlign: "center",
                    }}
                  >
                    {isEditing ? (
                      <>
                        <CloudUpload
                          sx={{
                            fontSize: isMobile ? "3rem" : "4rem",
                            color: "text.secondary",
                            opacity: 0.5,
                            mb: 1.5,
                          }}
                        />
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mb: 2, fontSize: isMobile ? "0.875rem" : "1rem" }}
                        >
                          No resume uploaded yet
                        </Typography>
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
                            sx={{
                              bgcolor: "var(--clr-primary)",
                              fontWeight: 700,
                              borderRadius: 2,
                              px: 3,
                            }}
                          >
                            Upload Resume
                          </Button>
                        </label>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{
                            display: "block",
                            mt: 1.5,
                            opacity: 0.7,
                            fontSize: isMobile ? "0.75rem" : "0.875rem",
                          }}
                        >
                          PDF, DOC, DOCX (Max 5MB)
                        </Typography>
                      </>
                    ) : (
                      <>
                        <Article
                          sx={{
                            fontSize: isMobile ? "3rem" : "4rem",
                            color: "text.secondary",
                            opacity: 0.3,
                            mb: 1.5,
                          }}
                        />
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ fontSize: isMobile ? "0.875rem" : "1rem" }}
                        >
                          No resume uploaded
                        </Typography>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{
                            display: "block",
                            opacity: 0.7,
                            fontSize: isMobile ? "0.75rem" : "0.875rem",
                          }}
                        >
                          Click "Edit Profile" to upload
                        </Typography>
                      </>
                    )}
                  </Paper>
                )}
              </CardContent>
            </Card>
          </Stack>
        </Grid>
      </Grid>

      <Snackbar 
        open={toast.open} 
        autoHideDuration={3000} 
        onClose={() => setToast({ ...toast, open: false })}
      >
        <Alert severity={toast.severity} sx={{ width: '100%', fontWeight: 700, borderRadius: 2 }}>
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default StudentProfile;
