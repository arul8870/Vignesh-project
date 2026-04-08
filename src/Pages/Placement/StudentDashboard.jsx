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
  useMediaQuery,
  Chip,
  Avatar,
} from "@mui/material";
import { 
  TrackChanges, 
  Work, 
  Assessment, 
  Star, 
  Campaign,
  TrendingUp,
  EmojiEvents,
  Speed,
  ArrowForward,
} from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import { alpha } from "@mui/material/styles";
import AdminPageHeader from "../../components/Placement/AdminPageHeader";
import { app_routes } from "../../utils/constants";
import { useNavigate } from "react-router-dom";
import PlacementFeed from "../../components/Placement/PlacementFeed";
import { placementRepository } from "../../repositories/placementRepository";
import { useSelector } from "react-redux";
import { selectAuthData } from "../../store/slicers/authSlicer";

const StudentDashboard = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));
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

  const total = stats.applied || 1;

  return (
    <Box sx={{ p: isMobile ? 1.5 : isTablet ? 2 : 4 }}>
      {/* Welcome Section */}
      <Paper
        sx={{
          p: isMobile ? 2.5 : 4,
          mb: 4,
          background: "linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(59, 130, 246, 0.1) 50%, rgba(168, 85, 247, 0.08) 100%)",
          border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
          borderRadius: isMobile ? 3 : 4,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative Background */}
        <Box
          sx={{
            position: "absolute",
            top: -50,
            right: -50,
            width: 200,
            height: 200,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(16, 185, 129, 0.2) 0%, transparent 70%)",
            filter: "blur(40px)",
          }}
        />
        
        <Box sx={{ position: "relative", zIndex: 1 }}>
          <Typography
            variant={isMobile ? "h5" : "h4"}
            sx={{
              fontWeight: 800,
              mb: 1.5,
              background: "linear-gradient(135deg, #10b981 0%, #3b82f6 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Welcome back, {user.name || 'Student'}! 🎓
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: "text.secondary",
              maxWidth: "600px",
              lineHeight: 1.7,
              fontSize: isMobile ? "0.875rem" : "1rem",
            }}
          >
            Your personal placement command center. Track your recruitment status and stay updated.
          </Typography>
        </Box>
      </Paper>

      {/* Stats Cards - Mobile: Grid, Desktop: Horizontal */}
      <Grid container spacing={isMobile ? 2 : 3} sx={{ mb: 4 }}>
        {[
          { label: "Applied", count: stats.applied, icon: Work, color: "#3b82f6", gradient: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)" },
          { label: "Shortlisted", count: stats.shortlisted, icon: Speed, color: "#f59e0b", gradient: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)" },
          { label: "Interviews", count: stats.interviews, icon: Assessment, color: "#a855f7", gradient: "linear-gradient(135deg, #a855f7 0%, #9333ea 100%)" },
          { label: "Offers", count: stats.offers, icon: EmojiEvents, color: "#10b981", gradient: "linear-gradient(135deg, #10b981 0%, #059669 100%)" },
        ].map((stat, i) => (
          <Grid item xs={6} md={3} key={i}>
            <Paper
              sx={{
                p: isMobile ? 2 : 3,
                background: stat.gradient,
                borderRadius: 3,
                position: "relative",
                overflow: "hidden",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: `0 12px 24px ${alpha(stat.color, 0.3)}`,
                },
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  top: -10,
                  right: -10,
                  width: 80,
                  height: 80,
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.15)",
                  filter: "blur(20px)",
                }}
              />
              <Avatar
                sx={{
                  width: isMobile ? 40 : 48,
                  height: isMobile ? 40 : 48,
                  bgcolor: "rgba(255,255,255,0.2)",
                  mb: 1.5,
                }}
              >
                <stat.icon sx={{ fontSize: "1.5rem" }} />
              </Avatar>
              <Typography
                variant={isMobile ? "h4" : "h3"}
                sx={{
                  fontWeight: 800,
                  color: "white",
                  mb: 0.5,
                }}
              >
                {loading ? <CircularProgress size={isMobile ? 24 : 32} sx={{ color: "white" }} /> : stat.count}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: "rgba(255,255,255,0.9)",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                {stat.label}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Progress & Recommendations */}
      <Grid container spacing={isMobile ? 2 : 4}>
        {/* Recruitment Progress */}
        <Grid item xs={12} lg={4}>
          <Paper
            sx={{
              p: isMobile ? 2.5 : 4,
              borderRadius: 3,
              height: "100%",
              bgcolor: alpha(theme.palette.background.paper, 0.6),
              border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            }}
          >
            <Typography
              variant="h6"
              sx={{
                mb: isMobile ? 2.5 : 4,
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                fontSize: isMobile ? "1rem" : "1.25rem",
              }}
            >
              <TrendingUp color="primary" /> My Progress
            </Typography>
            
            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                <CircularProgress size={40} sx={{ color: "var(--clr-primary)" }} />
              </Box>
            ) : (
              <Stack spacing={isMobile ? 2.5 : 3}>
                {[
                  { label: "Applied", count: stats.applied, total: total, color: "#3b82f6" },
                  { label: "Shortlisted", count: stats.shortlisted, total: total, color: "#f59e0b" },
                  { label: "Interviews", count: stats.interviews, total: total, color: "#a855f7" },
                  { label: "Offers", count: stats.offers, total: total, color: "#10b981" },
                ].map((stage, i) => (
                  <Box key={i}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                      <Typography
                        variant="subtitle2"
                        fontWeight={700}
                        sx={{ fontSize: isMobile ? "0.8125rem" : "0.875rem" }}
                      >
                        {stage.label}
                      </Typography>
                      <Typography
                        variant="caption"
                        fontWeight={800}
                        sx={{
                          color: stage.color,
                          fontSize: isMobile ? "0.75rem" : "0.875rem",
                        }}
                      >
                        {stage.count}
                      </Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={(stage.count / stage.total) * 100} 
                      sx={{ 
                        height: isMobile ? 6 : 8, 
                        borderRadius: 4, 
                        bgcolor: alpha(theme.palette.divider, 0.1),
                        "& .MuiLinearProgress-bar": { bgcolor: stage.color }
                      }} 
                    />
                  </Box>
                ))}
              </Stack>
            )}
          </Paper>
        </Grid>

        {/* AI Recommendation & Feed */}
        <Grid item xs={12} lg={8}>
          <Stack spacing={isMobile ? 2 : 4}>
            {/* AI Recommendation Card */}
            <Paper 
              sx={{ 
                p: isMobile ? 2.5 : 4,
                borderRadius: 3,
                background: "linear-gradient(135deg, rgba(16,185,129,0.12) 0%, rgba(59,130,246,0.08) 100%)",
                border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  mb: isMobile ? 1.5 : 2,
                  fontWeight: 800,
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  fontSize: isMobile ? "1rem" : "1.25rem",
                }}
              >
                <Star sx={{ color: "#fbbf24" }} /> AI Recommendation
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "text.primary",
                  mb: isMobile ? 2 : 3,
                  maxWidth: "600px",
                  lineHeight: 1.7,
                  fontSize: isMobile ? "0.875rem" : "1rem",
                }}
              >
                We found a **94% match** with the **Cloud Engineering** role at **AWS**. Your projects align perfectly.
              </Typography>
              <Button 
                variant="contained" 
                onClick={() => navigate(app_routes.student_jobs)}
                endIcon={<ArrowForward />}
                sx={{
                  bgcolor: "var(--clr-primary)",
                  fontWeight: 700,
                  px: isMobile ? 3 : 4,
                  py: isMobile ? 1 : 1.25,
                  fontSize: isMobile ? "0.875rem" : "1rem",
                }}
              >
                View Details
              </Button>
            </Paper>

            {/* Latest Placement Feed */}
            <Box>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 800,
                  mb: isMobile ? 2 : 3,
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  fontSize: isMobile ? "1.125rem" : "1.5rem",
                }}
              >
                <Campaign sx={{ color: "var(--clr-primary)" }} /> Latest Placement Feed
              </Typography>
              <Box sx={{ maxHeight: isMobile ? "400px" : "600px", overflow: "hidden", position: "relative" }}>
                <PlacementFeed />
                <Box sx={{ 
                  position: "absolute", 
                  bottom: 0, 
                  left: 0, 
                  right: 0, 
                  height: isMobile ? "60px" : "100px", 
                  background: isMobile
                    ? "linear-gradient(to top, rgba(5,5,5,0.95), transparent)"
                    : "linear-gradient(to top, #050505, transparent)", 
                  display: "flex", 
                  alignItems: "flex-end", 
                  justifyContent: "center",
                  pb: 2
                }}>
                  <Button 
                    variant="text" 
                    onClick={() => navigate(app_routes.student_jobs)}
                    endIcon={<ArrowForward />}
                    sx={{
                      color: "var(--clr-primary)",
                      fontWeight: 800,
                      fontSize: isMobile ? "0.875rem" : "1rem",
                    }}
                  >
                    View All Drives
                  </Button>
                </Box>
              </Box>
            </Box>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
};

export default StudentDashboard;
