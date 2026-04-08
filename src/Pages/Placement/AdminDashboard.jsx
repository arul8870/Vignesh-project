import React, { useState, useEffect } from "react";
import {
  Grid,
  Box,
  Paper,
  Typography,
  LinearProgress,
} from "@mui/material";
import { Apartment, PostAdd, Factory, Add } from "@mui/icons-material";
import { placementRepository } from "../../repositories/placementRepository";
import AdminPageHeader from "../../components/Placement/AdminPageHeader";

const AdminDashboard = () => {
  const [updates, setUpdates] = useState([]);

  useEffect(() => {
    fetchUpdates();
  }, []);

  const fetchUpdates = async () => {
    const res = await placementRepository.getUpdates();
    if (res.success) setUpdates(res.data);
  };

  return (
    <Box sx={{ p: 4 }}>
      <AdminPageHeader 
        title="Command Dashboard 🦅" 
        description="Unified overview of Hindusthan College placement activities, real-time stats, and recruitment funnel status."
      />

      <Grid container spacing={4}>
        {/* Top level stats */}
        {[
          { label: "Total Students", value: "1,240", icon: <Factory />, color: "#10b981" },
          { label: "Total Companies", value: "48", icon: <Apartment />, color: "#f59e0b" },
          { label: "Applications", value: "3,850", icon: <PostAdd />, color: "#3b82f6" },
          { label: "Placed Students", value: "852", icon: <Add />, color: "#a855f7" },
        ].map((stat, i) => (
          <Grid item xs={12} sm={6} md={3} key={i}>
            <Paper className="glass-card" sx={{ p: 3, display: "flex", alignItems: "center", gap: 2 }}>
              <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: `${stat.color}20`, color: stat.color }}>
                {stat.icon}
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary" fontWeight={600}>
                  {stat.label}
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 800 }}>
                  {stat.value}
                </Typography>
              </Box>
            </Paper>
          </Grid>
        ))}

        {/* Live Funnel Overview */}
        <Grid item xs={12}>
          <Paper className="grid-common" sx={{ p: 4, border: "none" }}>
            <Typography variant="h6" sx={{ mb: 4, fontWeight: 700, display: "flex", alignItems: "center", gap: 1 }}>
              Active Recruitment Funnels ⚡
            </Typography>
            <Grid container spacing={4}>
              {updates.slice(0, 3).map(update => (
                <Grid item xs={12} md={4} key={update.id}>
                  <Box className="glass-card" sx={{ p: 3, bgcolor: "rgba(255,255,255,0.01)" }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                      <Typography variant="subtitle1" fontWeight={800}>{update.company}</Typography>
                      <Typography variant="caption" color="var(--clr-primary)" fontWeight={800}>
                        {Math.round((update.selectedCount / update.appliedCount) * 100) || 0}% Selection
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1.5 }}>
                      <Typography variant="caption" color="text.secondary">{update.appliedCount} Candidates</Typography>
                      <Typography variant="caption" color="var(--clr-primary)">{update.selectedCount} Hired</Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={(update.selectedCount / update.appliedCount) * 100 || 0} 
                      sx={{ 
                        height: 8, 
                        borderRadius: 4, 
                        bgcolor: "rgba(255,255,255,0.05)",
                        "& .MuiLinearProgress-bar": { bgcolor: "var(--clr-primary)" }
                      }} 
                    />
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminDashboard;
