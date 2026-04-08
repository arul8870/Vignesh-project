import React, { useState, useEffect } from "react";
import {
  Grid,
  Box,
  Typography,
  Paper,
  Stack,
  Button,
  LinearProgress,
  CircularProgress,
} from "@mui/material";
import { TrackChanges, Work, Assessment, Star, Campaign } from "@mui/icons-material";
import AdminPageHeader from "../../components/Placement/AdminPageHeader";
import { app_routes } from "../../utils/constants";
import { useNavigate } from "react-router-dom";
import PlacementFeed from "../../components/Placement/PlacementFeed";
import { placementRepository } from "../../repositories/placementRepository";
import { useSelector } from "react-redux";
import { selectAuthData } from "../../store/slicers/authSlicer";

const StudentDashboard = () => {
  const navigate = useNavigate();
  const authData = useSelector(selectAuthData);
  const user = authData?.user || {};
  const studentId = user.username;
  
  const [stats, setStats] = useState({
    applied: 0,
    shortlisted: 0,
    interviews: 0,
    offers: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await placementRepository.getApplications();
      if (res.success) {
        const myApps = res.data.filter(app => app.studentId === studentId);
        setStats({
          applied: myApps.length,
          shortlisted: myApps.filter(a => a.status === "Shortlisted").length,
          interviews: myApps.filter(a => a.status === "Interview").length,
          offers: myApps.filter(a => a.status === "Selected").length,
        });
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const total = stats.applied || 1; // Avoid division by zero

  return (
    <Box sx={{ p: 4 }}>
      <AdminPageHeader 
        title={`Welcome back, ${user.name || 'Student'}! 🎓`} 
        description="Your personal placement command center. Track your recruitment status, view AI recommendations, and stay updated with the latest campus drives."
      />

      <Grid container spacing={4}>
        {/* Recruitment Progress Section */}
        <Grid item xs={12} lg={4}>
          <Paper className="glass-card" sx={{ p: 4, height: "100%" }}>
            <Typography variant="h6" sx={{ mb: 4, fontWeight: 700, display: "flex", alignItems: "center", gap: 1.5 }}>
              <Assessment color="primary" /> My Progress
            </Typography>
            
            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                <CircularProgress size={40} sx={{ color: "var(--clr-primary)" }} />
              </Box>
            ) : (
              <Stack spacing={4}>
                {[
                  { label: "Applied", count: stats.applied, total: total, color: "#3b82f6" },
                  { label: "Shortlisted", count: stats.shortlisted, total: total, color: "#f59e0b" },
                  { label: "Interviews", count: stats.interviews, total: total, color: "#a855f7" },
                  { label: "Offers", count: stats.offers, total: total, color: "#10b981" },
                ].map((stage, i) => (
                  <Box key={i}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1.5 }}>
                      <Typography variant="subtitle2" fontWeight={700}>{stage.label}</Typography>
                      <Typography variant="caption" fontWeight={800} sx={{ color: stage.color }}>{stage.count}</Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={(stage.count / stage.total) * 100} 
                      sx={{ 
                        height: 8, 
                        borderRadius: 4, 
                        bgcolor: "rgba(255,255,255,0.05)",
                        "& .MuiLinearProgress-bar": { bgcolor: stage.color }
                      }} 
                    />
                  </Box>
                ))}
              </Stack>
            )}
          </Paper>
        </Grid>

        {/* Recommendations & Quick Insights */}
        <Grid item xs={12} lg={8}>
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <Paper 
                className="grid-common" 
                sx={{ 
                  p: 4, 
                  background: "linear-gradient(135deg, rgba(16,185,129,0.1) 0%, rgba(59,130,246,0.1) 100%)",
                  border: "1px solid rgba(16,185,129,0.2)"
                }}
              >
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 800, display: "flex", alignItems: "center", gap: 1.5 }}>
                  <Star sx={{ color: "#f59e0b" }} /> AI Recommendation
                </Typography>
                <Typography variant="body1" sx={{ color: "text.primary", mb: 3, maxWidth: "600px", lineHeight: 1.7 }}>
                  We found a **94% match** with the **Cloud Engineering** role at **AWS**. Your projects in React and AWS Lambda align perfectly with their requirements.
                </Typography>
                <Button 
                  variant="contained" 
                  onClick={() => navigate(app_routes.student_jobs)}
                  sx={{ bgcolor: "var(--clr-primary)", fontWeight: 700, px: 4 }}
                >
                  View Details
                </Button>
              </Paper>
            </Grid>

            {/* Live Feed Preview Header */}
            <Grid item xs={12}>
              <Box sx={{ mt: 2 }}>
                <Typography variant="h5" sx={{ fontWeight: 800, mb: 3, display: "flex", alignItems: "center", gap: 2 }}>
                  <Campaign sx={{ color: "var(--clr-primary)" }} /> Latest Placement Feed
                </Typography>
                <Box sx={{ maxHeight: "600px", overflow: "hidden", position: "relative" }}>
                  <PlacementFeed />
                  <Box sx={{ 
                    position: "absolute", 
                    bottom: 0, 
                    left: 0, 
                    right: 0, 
                    height: "100px", 
                    background: "linear-gradient(to top, #050505, transparent)", 
                    display: "flex", 
                    alignItems: "flex-end", 
                    justifyContent: "center",
                    pb: 2
                  }}>
                    <Button 
                      variant="text" 
                      onClick={() => navigate(app_routes.student_jobs)}
                      sx={{ color: "var(--clr-primary)", fontWeight: 800 }}
                    >
                      View All Drives
                    </Button>
                  </Box>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default StudentDashboard;
