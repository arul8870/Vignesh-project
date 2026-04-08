import React, { useState, useEffect } from "react";
import { Box, Paper, Grid, Typography, Button, IconButton, Chip, Stack } from "@mui/material";
import { Star, Work, DeleteOutline, Apartment, LocationOn, AttachMoney } from "@mui/icons-material";
import AdminPageHeader from "../../../components/Placement/AdminPageHeader";
import { useSelector } from "react-redux";
import { selectAuthData } from "../../../store/slicers/authSlicer";

const StudentSaved = () => {
  const [savedJobs, setSavedJobs] = useState([]);
  const authData = useSelector(selectAuthData);
  const studentId = authData?.user?.username;

  useEffect(() => {
    loadSavedJobs();
  }, []);

  const loadSavedJobs = () => {
    const saved = localStorage.getItem(`saved_jobs_${studentId}`);
    if (saved) {
      setSavedJobs(JSON.parse(saved));
    }
  };

  const removeSaved = (jobId) => {
    const newSaved = savedJobs.filter(j => j.id !== jobId);
    setSavedJobs(newSaved);
    localStorage.setItem(`saved_jobs_${studentId}`, JSON.stringify(newSaved));
  };

  return (
    <Box sx={{ p: 4 }}>
      <AdminPageHeader 
        title="Saved Opportunities ⭐" 
        description="Your curated list of placement drives. Review your bookmarks, compare roles, and apply when you are ready."
      />

      <Grid container spacing={4}>
        {savedJobs.map((job) => (
          <Grid item xs={12} md={6} key={job.id}>
            <Paper className="glass-card" sx={{ p: 4, position: "relative" }}>
              <Box sx={{ position: "absolute", top: 16, right: 16 }}>
                <IconButton color="primary" sx={{ bgcolor: "rgba(245,158,11,0.1)" }} onClick={() => removeSaved(job.id)}>
                  <DeleteOutline />
                </IconButton>
              </Box>

              <Box sx={{ display: "flex", gap: 2, alignItems: "center", mb: 3 }}>
                <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: "rgba(16,185,129,0.1)", color: "var(--clr-primary)" }}>
                  <Apartment />
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 800 }}>{job.company}</Typography>
                  <Typography variant="body2" color="text.secondary">{job.role}</Typography>
                </Box>
              </Box>

              <Stack spacing={2} sx={{ mb: 3 }}>
                {job.location && (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <LocationOn sx={{ fontSize: "1rem", color: "text.secondary" }} />
                    <Typography variant="body2" color="text.secondary">{job.location}</Typography>
                  </Box>
                )}
                {job.type && (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Work sx={{ fontSize: "1rem", color: "text.secondary" }} />
                    <Typography variant="body2" color="text.secondary">{job.type}</Typography>
                  </Box>
                )}
                {job.package && (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <AttachMoney sx={{ fontSize: "1rem", color: "var(--clr-primary)" }} />
                    <Typography variant="body2" sx={{ fontWeight: 700, color: "var(--clr-primary)" }}>{job.package}</Typography>
                  </Box>
                )}
              </Stack>

              <Box sx={{ display: "flex", gap: 2 }}>
                <Button variant="contained" fullWidth sx={{ bgcolor: "var(--clr-primary)", fontWeight: 700 }}>
                  View Details
                </Button>
              </Box>
            </Paper>
          </Grid>
        ))}

        {savedJobs.length === 0 && (
          <Grid item xs={12}>
            <Box sx={{ py: 10, textAlign: "center" }}>
              <Star sx={{ fontSize: "4rem", color: "rgba(255,255,255,0.05)", mb: 2 }} />
              <Typography variant="h6" color="text.secondary">No saved jobs yet.</Typography>
              <Typography variant="body2" color="text.secondary">Start exploring drives and bookmark your favorites.</Typography>
            </Box>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default StudentSaved;
