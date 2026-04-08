import React from "react";
import { Box, Typography, Paper, Grid, Avatar, Chip, Stack, TextField, InputAdornment } from "@mui/material";
import { Search, Apartment, WorkspacePremium } from "@mui/icons-material";
import { placementRepository } from "../../repositories/placementRepository";
import { useEffect, useState } from "react";

const PlacedStudents = () => {
  const [placedStudents, setPlacedStudents] = useState([]);

  useEffect(() => {
    const fetchStudents = async () => {
      const res = await placementRepository.getHallOfFame();
      if (res.success) setPlacedStudents(res.data);
    };
    fetchStudents();
  }, []);
  return (
    <Box sx={{ p: 4, bgcolor: "var(--clr-neutral)", minHeight: "100vh" }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, color: "var(--clr-primary)", mb: 1 }}>
          Hall of Fame 🏆
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Celebrating the success of our students in the 2024 placement season.
        </Typography>
      </Box>

      <TextField
        fullWidth
        placeholder="Search by name, company or department..."
        sx={{ mb: 4, bgcolor: "white", borderRadius: 2 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search sx={{ color: "var(--clr-silver)" }} />
            </InputAdornment>
          ),
        }}
      />

      <Grid container spacing={3}>
        {placedStudents.map((student, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
            <Paper
              elevation={0}
              className="grid-common"
              sx={{
                p: 3,
                textAlign: "center",
                position: "relative",
                overflow: "hidden",
                "&:hover": { borderColor: "var(--clr-primary)", transform: "translateY(-4px)" },
                transition: "all 0.3s ease",
              }}
            >
              <Box sx={{ position: "absolute", top: 10, right: 10 }}>
                <WorkspacePremium sx={{ color: "#f59e0b" }} />
              </Box>
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  mx: "auto",
                  mb: 2,
                  bgcolor: "var(--clr-primary-light)",
                  color: "var(--clr-primary)",
                  fontSize: "1.5rem",
                  fontWeight: 700,
                  border: "4px solid white",
                  boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                }}
              >
                {student.name.split(" ").map((n) => n[0]).join("")}
              </Avatar>
              <Typography variant="h6" sx={{ fontWeight: 800 }}>
                {student.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {student.dept} | Class of {student.year}
              </Typography>

              <Box
                sx={{
                  bgcolor: "var(--clr-primary-light)",
                  p: 1.5,
                  borderRadius: 2,
                  display: "flex",
                  flexDirection: "column",
                  gap: 0.5,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0.5 }}>
                  <Apartment sx={{ fontSize: "1rem", color: "var(--clr-primary)" }} />
                  <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                    {student.company}
                  </Typography>
                </Box>
                <Typography variant="caption" sx={{ color: "#10b981", fontWeight: 800 }}>
                  {student.package}
                </Typography>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default PlacedStudents;
