import React, { useState, useEffect } from "react";
import { Box, Grid, Paper, Typography, TextField, InputAdornment, Button, Chip } from "@mui/material";
import { Search, FilterList, Map, Storefront, LaptopMac } from "@mui/icons-material";
import AdminPageHeader from "../../../components/Placement/AdminPageHeader";
import { placementRepository } from "../../../repositories/placementRepository";

const StudentLocal = () => {
  const [jobs, setJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    const res = await placementRepository.getJobs();
    if (res.success) setJobs(res.data);
  };

  const filteredJobs = jobs.filter(j => 
    (j.company || j.employer)?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (j.role || j.title)?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{ p: 4 }}>
      <AdminPageHeader 
        title="Local Opportunities 📍" 
        description="Explore part-time roles, internships, and startup opportunities in the Hindusthan College neighborhood."
      />

      <Paper className="glass-card" sx={{ p: 2, mb: 4, display: "flex", gap: 3, alignItems: "center" }}>
        <TextField
          size="small"
          placeholder="Search by area or shop name..."
          sx={{ flex: 1 }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: <InputAdornment position="start"><Search fontSize="small" /></InputAdornment>,
          }}
        />
        <Button variant="outlined" startIcon={<FilterList />} sx={{ borderColor: "rgba(255,255,255,0.1)", color: "text.secondary" }}>
          Nearby Only
        </Button>
      </Paper>

      <Grid container spacing={4}>
        {filteredJobs.map((job) => (
          <Grid item xs={12} md={4} key={job.id}>
            <Paper className="glass-card" sx={{ p: 4 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
                <Chip 
                  icon={job.type === "Startup" ? <LaptopMac sx={{ fontSize: "1rem !important" }} /> : <Storefront sx={{ fontSize: "1rem !important" }} />}
                  label={job.type} 
                  size="small" 
                  sx={{ bgcolor: "rgba(16,185,129,0.1)", color: "var(--clr-primary)", fontWeight: 700 }} 
                />
                <Typography variant="body2" color="var(--clr-primary)" fontWeight={800}>{job.salary || job.pay}</Typography>
              </Box>

              <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>{job.role || job.title}</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3, display: "flex", alignItems: "center", gap: 0.5 }}>
                 {job.company || job.employer} • {job.location || "Nearby"}
              </Typography>

              <Button fullWidth variant="outlined" sx={{ borderColor: "var(--clr-primary)", color: "var(--clr-primary)", fontWeight: 700 }}>
                View Job Details
              </Button>
            </Paper>
          </Grid>
        ))}
        {filteredJobs.length === 0 && (
          <Grid item xs={12}>
            <Typography align="center" color="text.secondary" sx={{ py: 10 }}>No neighborhood opportunities found yet.</Typography>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default StudentLocal;
