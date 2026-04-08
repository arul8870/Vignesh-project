import React from "react";
import { Grid, Box, Typography, TextField, InputAdornment, Stack, Button } from "@mui/material";
import { Search, FilterList } from "@mui/icons-material";
import JobOpportunityCard from "../../components/Placement/JobOpportunityCard";
import { placementRepository } from "../../repositories/placementRepository";
import { useEffect, useState } from "react";

const LocalJobs = () => {
  const [localJobs, setLocalJobs] = useState([]);

  useEffect(() => {
    const fetchJobs = async () => {
      const res = await placementRepository.getJobs();
      if (res.success) setLocalJobs(res.data);
    };
    fetchJobs();
  }, []);
  return (
    <Box sx={{ p: 4, bgcolor: "var(--clr-neutral)", minHeight: "100vh" }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, color: "var(--clr-primary)", mb: 1 }}>
          Local Opportunities 📍
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Explore part-time jobs, startups, and shops nearby Hindusthan College.
        </Typography>
      </Box>

      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mb: 4 }}>
        <TextField
          fullWidth
          placeholder="Search for roles, companies or categories..."
          variant="outlined"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search sx={{ color: "var(--clr-silver)" }} />
              </InputAdornment>
            ),
          }}
          sx={{ bgcolor: "white", borderRadius: 2 }}
        />
        <Button
          variant="outlined"
          startIcon={<FilterList />}
          sx={{
            borderColor: "var(--clr-silver-v1)",
            color: "var(--clr-font)",
            bgcolor: "white",
            px: 3,
            "&:hover": { borderColor: "var(--clr-primary)" },
          }}
        >
          Filters
        </Button>
      </Stack>

      <Grid container spacing={3}>
        {localJobs.map((job) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={job.id}>
            <JobOpportunityCard job={job} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default LocalJobs;
