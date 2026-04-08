import React, { useState, useEffect } from "react";
import {
  Grid,
  Box,
  Paper,
  Typography,
  LinearProgress,
  useMediaQuery,
  Avatar,
  Stack,
  Card,
  CardContent,
} from "@mui/material";
import { 
  Apartment, 
  PostAdd, 
  Factory, 
  Add,
  TrendingUp,
  ArrowForward,
} from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import { alpha } from "@mui/material/styles";
import { placementRepository } from "../../repositories/placementRepository";
import AdminPageHeader from "../../components/Placement/AdminPageHeader";

const AdminDashboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));
  const [updates, setUpdates] = useState([]);

  useEffect(() => {
    fetchUpdates();
  }, []);

  const fetchUpdates = async () => {
    const res = await placementRepository.getUpdates();
    if (res.success) setUpdates(res.data);
  };

  return (
    <Box sx={{ p: isMobile ? 1.5 : isTablet ? 2 : 4 }}>
      {/* Header Banner */}
      <Paper
        sx={{
          p: isMobile ? 2.5 : 4,
          mb: isMobile ? 2.5 : 4,
          background: "linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(59, 130, 246, 0.1) 100%)",
          border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
          borderRadius: isMobile ? 3 : 4,
          position: "relative",
          overflow: "hidden",
        }}
      >
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
              mb: 1,
              background: "linear-gradient(135deg, #10b981 0%, #3b82f6 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Command Dashboard 🦅
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
            Unified overview of Hindusthan College placement activities and real-time stats.
          </Typography>
        </Box>
      </Paper>

      {/* Stats Cards - Mobile: 2x2 Grid */}
      <Grid container spacing={isMobile ? 2 : 3} sx={{ mb: 4 }}>
        {[
          { label: "Total Students", value: "1,240", icon: Factory, color: "#10b981", gradient: "linear-gradient(135deg, #10b981 0%, #059669 100%)" },
          { label: "Total Companies", value: "48", icon: Apartment, color: "#f59e0b", gradient: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)" },
          { label: "Applications", value: "3,850", icon: PostAdd, color: "#3b82f6", gradient: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)" },
          { label: "Placed Students", value: "852", icon: Add, color: "#a855f7", gradient: "linear-gradient(135deg, #a855f7 0%, #9333ea 100%)" },
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
                {stat.value}
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

      {/* Recruitment Funnels */}
      <Paper
        sx={{
          p: isMobile ? 2.5 : 4,
          borderRadius: 3,
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
            gap: 1,
            fontSize: isMobile ? "1rem" : "1.25rem",
          }}
        >
          <TrendingUp color="primary" /> Active Recruitment Funnels ⚡
        </Typography>
        
        <Grid container spacing={isMobile ? 2 : 4}>
          {updates.slice(0, 3).map(update => (
            <Grid item xs={12} md={4} key={update.id}>
              <Card
                sx={{
                  borderRadius: 3,
                  bgcolor: alpha(theme.palette.background.paper, 0.4),
                  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: `0 8px 16px ${alpha(theme.palette.primary.main, 0.15)}`,
                  },
                }}
              >
                <CardContent sx={{ p: isMobile ? 2.5 : 3 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                    <Typography
                      variant="subtitle1"
                      fontWeight={800}
                      sx={{ fontSize: isMobile ? "0.9375rem" : "1rem" }}
                    >
                      {update.company}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="var(--clr-primary)"
                      fontWeight={800}
                      sx={{ fontSize: isMobile ? "0.75rem" : "0.875rem" }}
                    >
                      {Math.round((update.selectedCount / update.appliedCount) * 100) || 0}% Selection
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1.5 }}>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ fontWeight: 600 }}
                    >
                      {update.appliedCount} Candidates
                    </Typography>
                    <Typography
                      variant="caption"
                      color="var(--clr-primary)"
                      sx={{ fontWeight: 700 }}
                    >
                      {update.selectedCount} Hired
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={(update.selectedCount / update.appliedCount) * 100 || 0} 
                    sx={{ 
                      height: isMobile ? 6 : 8, 
                      borderRadius: 4, 
                      bgcolor: alpha(theme.palette.divider, 0.1),
                      "& .MuiLinearProgress-bar": { bgcolor: "var(--clr-primary)" }
                    }} 
                  />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Box>
  );
};

export default AdminDashboard;
