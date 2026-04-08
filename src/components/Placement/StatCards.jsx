import React from "react";
import { Grid, Paper, Typography, Box } from "@mui/material";
import { TrendingUp, People, Business, School } from "@mui/icons-material";

const stats = [
  { label: "Total Offers", value: "450+", icon: <TrendingUp />, color: "#10b981" },
  { label: "Students Placed", value: "380", icon: <People />, color: "#3b82f6" },
  { label: "Companies Visited", value: "85", icon: <Business />, color: "#f59e0b" },
  { label: "Highest Package", value: "24 LPA", icon: <School />, color: "#8b5cf6" },
];

const StatCards = () => {
  return (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      {stats.map((stat, index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
          <Paper
            className="grid-common"
            sx={{
              p: 3,
              display: "flex",
              alignItems: "center",
              gap: 2,
              borderLeft: `6px solid ${stat.color}`,
            }}
          >
            <Box
              sx={{
                width: 50,
                height: 50,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: `${stat.color}20`,
                color: stat.color,
              }}
            >
              {stat.icon}
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: "var(--clr-silver)", fontWeight: 600 }}>
                {stat.label}
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 800, color: "var(--clr-font)" }}>
                {stat.value}
              </Typography>
            </Box>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
};

export default StatCards;
