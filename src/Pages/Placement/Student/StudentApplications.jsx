import React, { useState, useEffect } from "react";
import {
  Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Typography, Chip, IconButton, Tooltip
} from "@mui/material";
import { Info, Visibility, History } from "@mui/icons-material";
import AdminPageHeader from "../../../components/Placement/AdminPageHeader";
import { placementRepository } from "../../../repositories/placementRepository";
import { useSelector } from "react-redux";
import { selectAuthData } from "../../../store/slicers/authSlicer";

const StudentApplications = () => {
  const [apps, setApps] = useState([]);
  const authData = useSelector(selectAuthData);
  const studentId = authData?.user?.username;

  useEffect(() => {
    fetchApps();
  }, []);

  const fetchApps = async () => {
    const res = await placementRepository.getApplications();
    if (res.success) {
      // Filter for current student's applications
      const myApps = res.data.filter(app => app.studentId === studentId);
      setApps(myApps);
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "Selected": return { color: "#10b981", bg: "rgba(16,185,129,0.1)" };
      case "Shortlisted": return { color: "#f59e0b", bg: "rgba(245,158,11,0.1)" };
      case "Rejected": return { color: "#ef4444", bg: "rgba(239,68,68,0.1)" };
      default: return { color: "#3b82f6", bg: "rgba(59,130,246,0.1)" };
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <AdminPageHeader 
        title="My Applications 🎯" 
        description="Track your personal recruitment funnel. View real-time status updates, scheduled interview dates, and offer details."
      />

      <TableContainer component={Paper} className="grid-common" sx={{ p: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 800, color: "text.secondary" }}>COMPANY</TableCell>
              <TableCell sx={{ fontWeight: 800, color: "text.secondary" }}>ROLE / PACKAGE</TableCell>
              <TableCell sx={{ fontWeight: 800, color: "text.secondary" }}>APPLIED DATE</TableCell>
              <TableCell sx={{ fontWeight: 800, color: "text.secondary" }}>STATUS</TableCell>
              <TableCell align="right" sx={{ fontWeight: 800, color: "text.secondary" }}>DETAILS</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {apps.map((app) => {
              const style = getStatusStyle(app.status);
              return (
                <TableRow key={app.id} sx={{ "&:hover": { bgcolor: "rgba(255,255,255,0.02)" } }}>
                  <TableCell sx={{ fontWeight: 700 }}>{app.company}</TableCell>
                  <TableCell>{app.role}</TableCell>
                  <TableCell sx={{ color: "text.secondary" }}>{new Date(app.date).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Chip 
                      label={app.status || "Applied"} 
                      size="small" 
                      sx={{ 
                        bgcolor: style.bg, 
                        color: style.color, 
                        fontWeight: 800,
                        borderRadius: "6px",
                        px: 1
                      }} 
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="View Feedback">
                      <IconButton size="small" sx={{ color: "text.secondary" }}>
                        <Visibility fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              );
            })}
            {apps.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 6, color: "text.secondary" }}>
                  <Box sx={{ opacity: 0.5 }}>
                    <History sx={{ fontSize: "3rem", mb: 1 }} />
                    <Typography>You haven't applied to any drives yet.</Typography>
                  </Box>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default StudentApplications;
