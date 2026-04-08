import React, { useEffect, useState } from "react";
import { Box, Typography, Chip, Button, Stack, Paper, Alert, Snackbar, Divider, Dialog, DialogTitle, DialogContent, DialogActions, IconButton } from "@mui/material";
import { Apartment, CalendarToday, LocationOn, Work, CheckCircle, AttachMoney, School, Close, Bookmark, BookmarkBorder, Description } from "@mui/icons-material";
import { placementRepository } from "../../repositories/placementRepository";
import { useSelector } from "react-redux";
import { selectAuthData } from "../../store/slicers/authSlicer";
import ApplicationForm from "./ApplicationForm";

const PlacementFeed = () => {
  const [updates, setUpdates] = useState([]);
  const [applications, setApplications] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [toast, setToast] = useState({ open: false, message: "" });
  const [formOpen, setFormOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const authData = useSelector(selectAuthData);
  const studentId = authData?.user?.username;

  useEffect(() => {
    fetchData();
    loadSavedJobs();
  }, []);

  const fetchData = async () => {
    const [uRes, aRes] = await Promise.all([
      placementRepository.getUpdates(),
      placementRepository.getApplications()
    ]);
    if (uRes.success) setUpdates(uRes.data);
    if (aRes.success) setApplications(aRes.data);
  };

  const loadSavedJobs = () => {
    const saved = localStorage.getItem(`saved_jobs_${studentId}`);
    if (saved) {
      setSavedJobs(JSON.parse(saved));
    }
  };

  const saveJob = (job) => {
    const newSaved = [...savedJobs, job];
    setSavedJobs(newSaved);
    localStorage.setItem(`saved_jobs_${studentId}`, JSON.stringify(newSaved));
    setToast({ open: true, message: `Saved ${job.company} to your list!` });
  };

  const unsaveJob = (jobId) => {
    const newSaved = savedJobs.filter(j => j.id !== jobId);
    setSavedJobs(newSaved);
    localStorage.setItem(`saved_jobs_${studentId}`, JSON.stringify(newSaved));
    setToast({ open: true, message: "Removed from saved jobs" });
  };

  const isSaved = (jobId) => {
    return savedJobs.some(j => j.id === jobId);
  };

  const handleApplyClick = (update) => {
    setSelectedJob(update);
    setFormOpen(true);
  };

  const handleViewDetails = (update) => {
    setSelectedJob(update);
    setDetailsOpen(true);
  };

  const handleFormSubmit = async (applicationData) => {
    if (!studentId) return;
    
    const res = await placementRepository.addApplication({
      studentId: studentId,
      name: applicationData.fullName,
      email: applicationData.email,
      phone: applicationData.phone,
      department: applicationData.department,
      rollNumber: applicationData.rollNumber,
      cgpa: applicationData.cgpa,
      tenthMark: applicationData.tenthMark,
      twelfthMark: applicationData.twelfthMark,
      degreeMark: applicationData.degreeMark,
      skills: applicationData.skills,
      experience: applicationData.experience,
      coverLetter: applicationData.coverLetter,
      resume: applicationData.resume.name,
      placementId: selectedJob.id,
      company: selectedJob.company,
      role: selectedJob.role,
      status: "Applied",
      date: new Date().toISOString()
    });
    
    if (res.success) {
      setToast({ open: true, message: `Successfully applied to ${selectedJob.company}!` });
      fetchData();
    }
  };

  const isApplied = (placementId) => {
    return applications.some(app => app.placementId === placementId && app.studentId === studentId);
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ mb: 3, fontWeight: 700, color: "var(--clr-primary)" }}>
        Active Placement Drives
      </Typography>
      <Stack spacing={2}>
        {updates.map((update) => {
          const applied = isApplied(update.id);
          return (
            <Paper
              key={update.id}
              elevation={0}
              className="glass-card"
              sx={{
                p: 3,
                display: "flex",
                flexDirection: "column",
                gap: 2,
                transition: "transform 0.2s",
                "&:hover": { transform: "translateY(-4px)" },
              }}
            >
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      bgcolor: "rgba(16, 185, 129, 0.1)",
                      borderRadius: 2,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Apartment sx={{ color: "var(--clr-primary)" }} />
                  </Box>
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                      {update.company}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {update.role}
                    </Typography>
                  </Box>
                </Box>
                <Chip
                  label={update.status}
                  size="small"
                  sx={{ 
                    fontWeight: 800, 
                    fontSize: "0.75rem",
                    bgcolor: "rgba(16, 185, 129, 0.1)",
                    color: "var(--clr-primary)"
                  }}
                />
              </Box>

              <Stack direction="row" spacing={3} sx={{ color: "text.secondary" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <CalendarToday sx={{ fontSize: "1rem" }} />
                  <Typography variant="caption">{update.date}</Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <LocationOn sx={{ fontSize: "1rem" }} />
                  <Typography variant="caption">{update.location || "Coimbatore"}</Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <Work sx={{ fontSize: "1rem" }} />
                  <Typography variant="caption">{update.type || "Full-time"}</Typography>
                </Box>
                {update.package && (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <AttachMoney sx={{ fontSize: "1rem" }} />
                    <Typography variant="caption" sx={{ color: "var(--clr-primary)", fontWeight: 700 }}>{update.package}</Typography>
                  </Box>
                )}
              </Stack>

              {update.eligibility && (
                <>
                  <Divider sx={{ borderColor: "rgba(255,255,255,0.05)" }} />
                  <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
                    <School sx={{ fontSize: "1rem", color: "text.secondary", mt: 0.2 }} />
                    <Typography variant="caption" sx={{ color: "text.secondary" }}>
                      <Typography component="span" variant="caption" sx={{ fontWeight: 700, color: "text.primary" }}>Eligibility: </Typography>
                      {update.eligibility}
                    </Typography>
                  </Box>
                </>
              )}

              <Box sx={{ display: "flex", gap: 2, mt: 1 }}>
                <Button
                  variant="contained"
                  disabled={applied}
                  startIcon={applied ? <CheckCircle /> : null}
                  onClick={() => handleApplyClick(update)}
                  sx={{
                    bgcolor: applied ? "rgba(16, 185, 129, 0.2)" : "var(--clr-primary)",
                    fontWeight: 700,
                    textTransform: "none",
                    px: 3
                  }}
                >
                  {applied ? "Applied" : "Apply Now"}
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Description />}
                  onClick={() => handleViewDetails(update)}
                  sx={{
                    color: "text.secondary",
                    borderColor: "rgba(255,255,255,0.2)",
                    textTransform: "none",
                    "&:hover": { borderColor: "var(--clr-primary)", color: "var(--clr-primary)" }
                  }}
                >
                  Details
                </Button>
                <IconButton
                  onClick={() => isSaved(update.id) ? unsaveJob(update.id) : saveJob(update)}
                  sx={{
                    color: isSaved(update.id) ? "#f59e0b" : "text.secondary",
                    bgcolor: isSaved(update.id) ? "rgba(245, 158, 11, 0.1)" : "transparent",
                    "&:hover": { bgcolor: "rgba(255,255,255,0.05)" }
                  }}
                >
                  {isSaved(update.id) ? <Bookmark /> : <BookmarkBorder />}
                </IconButton>
              </Box>
            </Paper>
          );
        })}
        {updates.length === 0 && (
          <Typography color="text.secondary" align="center">No active drives found.</Typography>
        )}
      </Stack>

      <Snackbar 
        open={toast.open} 
        autoHideDuration={4000} 
        onClose={() => setToast({ ...toast, open: false })}
      >
        <Alert severity="success" sx={{ width: '100%', fontWeight: 700 }}>
          {toast.message}
        </Alert>
      </Snackbar>

      <ApplicationForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        jobDetails={selectedJob}
        onSubmit={handleFormSubmit}
      />

      {/* Job Details Dialog */}
      <Dialog
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
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
        {selectedJob && (
          <>
            <DialogTitle
              sx={{
                fontWeight: 800,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                pb: 2,
              }}
            >
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>
                  {selectedJob.company}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {selectedJob.role}
                </Typography>
              </Box>
              <IconButton onClick={() => setDetailsOpen(false)} size="small" sx={{ color: "text.secondary" }}>
                <Close />
              </IconButton>
            </DialogTitle>

            <DialogContent dividers sx={{ borderColor: "rgba(255, 255, 255, 0.1)" }}>
              <Stack spacing={3}>
                <Stack direction="row" spacing={3} flexWrap="wrap" useFlexGap>
                  {selectedJob.location && (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <LocationOn sx={{ fontSize: "1.2rem", color: "var(--clr-primary)" }} />
                      <Typography variant="body2">{selectedJob.location}</Typography>
                    </Box>
                  )}
                  {selectedJob.type && (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Work sx={{ fontSize: "1.2rem", color: "var(--clr-primary)" }} />
                      <Typography variant="body2">{selectedJob.type}</Typography>
                    </Box>
                  )}
                  {selectedJob.package && (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <AttachMoney sx={{ fontSize: "1.2rem", color: "var(--clr-primary)" }} />
                      <Typography variant="body2" sx={{ fontWeight: 700, color: "var(--clr-primary)" }}>{selectedJob.package}</Typography>
                    </Box>
                  )}
                  {selectedJob.date && (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <CalendarToday sx={{ fontSize: "1.2rem", color: "var(--clr-primary)" }} />
                      <Typography variant="body2">Drive Date: {selectedJob.date}</Typography>
                    </Box>
                  )}
                </Stack>

                <Divider sx={{ borderColor: "rgba(255,255,255,0.1)" }} />

                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1, color: "text.secondary" }}>Status</Typography>
                  <Chip label={selectedJob.status || "Upcoming"} sx={{ bgcolor: "rgba(16,185,129,0.1)", color: "var(--clr-primary)", fontWeight: 700 }} />
                </Box>

                {selectedJob.eligibility && (
                  <>
                    <Divider sx={{ borderColor: "rgba(255,255,255,0.1)" }} />
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1, color: "text.secondary", display: "flex", alignItems: "center", gap: 1 }}>
                        <School sx={{ fontSize: "1rem" }} /> Eligibility Criteria
                      </Typography>
                      <Typography variant="body2" sx={{ lineHeight: 1.7 }}>{selectedJob.eligibility}</Typography>
                    </Box>
                  </>
                )}

                {selectedJob.description && (
                  <>
                    <Divider sx={{ borderColor: "rgba(255,255,255,0.1)" }} />
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1, color: "text.secondary" }}>Job Description</Typography>
                      <Typography variant="body2" sx={{ lineHeight: 1.7, whiteSpace: "pre-wrap" }}>{selectedJob.description}</Typography>
                    </Box>
                  </>
                )}
              </Stack>
            </DialogContent>

            <DialogActions sx={{ p: 3, borderColor: "rgba(255, 255, 255, 0.1)" }}>
              <Button onClick={() => setDetailsOpen(false)} variant="outlined" sx={{ borderColor: "rgba(255,255,255,0.2)", color: "text.secondary", fontWeight: 700 }}>
                Close
              </Button>
              {!isApplied(selectedJob.id) && (
                <Button 
                  onClick={() => { setDetailsOpen(false); handleApplyClick(selectedJob); }} 
                  variant="contained" 
                  sx={{ bgcolor: "var(--clr-primary)", fontWeight: 700, px: 4 }}
                >
                  Apply Now
                </Button>
              )}
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default PlacementFeed;
