import React from "react";
import { Box, Paper } from "@mui/material";
import PlacementFeed from "../../../components/Placement/PlacementFeed";
import AdminPageHeader from "../../../components/Placement/AdminPageHeader";

const StudentJobs = () => {
  return (
    <Box sx={{ p: 4 }}>
      <AdminPageHeader 
        title="Institutional Job Portal 🏢" 
        description="Explore active recruitment drives from Tier-1 and Tier-2 companies. Filter by role, salary, or eligibility to find your perfect match."
      />

      <Box sx={{ maxWidth: "1000px" }}>
        <PlacementFeed />
      </Box>
    </Box>
  );
};

export default StudentJobs;
