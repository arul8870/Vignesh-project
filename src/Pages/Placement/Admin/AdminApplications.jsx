import React, { useState, useEffect } from "react";
import {
  Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  IconButton, Chip, Typography, TextField, InputAdornment, MenuItem, Stack
} from "@mui/material";
import { Search, CheckCircle, Cancel, AssignmentTurnedIn, FilterList } from "@mui/icons-material";
import { placementRepository } from "../../../repositories/placementRepository";
import AdminPageHeader from "../../../components/Placement/AdminPageHeader";

const AdminApplications = () => {
  const [applications, setApplications] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    const res = await placementRepository.getApplications();
    if (res.success) setApplications(res.data);
  };

  const handleStatusUpdate = async (id, newStatus) => {
    const res = await placementRepository.updateApplication(id, { status: newStatus });
    if (res.success) {
      fetchApplications();
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Selected": return "#10b981";
      case "Shortlisted": return "#f59e0b";
      case "Rejected": return "#ef4444";
      default: return "#94a3b8";
    }
  };

  const filteredApps = applications.filter(app => {
    const matchesSearch = app.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         app.company?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <Box sx={{ p: 4 }}>
      <AdminPageHeader 
        title="Applicant Tracking 🎯" 
        description="Monitor student applications in real-time. Shortlist candidates, update interview status, and finalize selections."
      />

      {/* Control Bar */}
      <Paper className="glass-card" sx={{ p: 2, mb: 4, display: "flex", gap: 3, alignItems: "center" }}>
        <TextField
          size="small"
          placeholder="Filter by student or company..."
          sx={{ flex: 1 }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: <InputAdornment position="start"><Search fontSize="small" /></InputAdornment>,
          }}
        />
        <TextField 
          select 
          size="small" 
          label="Status" 
          value={statusFilter} 
          onChange={(e) => setStatusFilter(e.target.value)}
          sx={{ width: 160 }}
        >
          <MenuItem value="All">All Statuses</MenuItem>
          <MenuItem value="Applied">Applied</MenuItem>
          <MenuItem value="Shortlisted">Shortlisted</MenuItem>
          <MenuItem value="Selected">Selected</MenuItem>
          <MenuItem value="Rejected">Rejected</MenuItem>
        </TextField>
      </Paper>

      <TableContainer component={Paper} className="grid-common" sx={{ p: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 800, color: "text.secondary" }}>STUDENT</TableCell>
              <TableCell sx={{ fontWeight: 800, color: "text.secondary" }}>COMPANY</TableCell>
              <TableCell sx={{ fontWeight: 800, color: "text.secondary" }}>ROLE</TableCell>
              <TableCell sx={{ fontWeight: 800, color: "text.secondary" }}>STATUS</TableCell>
              <TableCell align="right" sx={{ fontWeight: 800, color: "text.secondary" }}>UPDATE STATUS</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredApps.map((app) => (
              <TableRow key={app.id} sx={{ "&:hover": { bgcolor: "rgba(255,255,255,0.02)" } }}>
                <TableCell sx={{ fontWeight: 700 }}>{app.name || app.studentId}</TableCell>
                <TableCell>{app.company}</TableCell>
                <TableCell>{app.role}</TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: getStatusColor(app.status) }} />
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{app.status || "Applied"}</Typography>
                  </Box>
                </TableCell>
                <TableCell align="right">
                  <Stack direction="row" spacing={1} justifyContent="flex-end">
                    <IconButton size="small" title="Shortlist" color="warning" onClick={() => handleStatusUpdate(app.id, "Shortlisted")}>
                      <AssignmentTurnedIn fontSize="small" />
                    </IconButton>
                    <IconButton size="small" title="Select" sx={{ color: "#10b981" }} onClick={() => handleStatusUpdate(app.id, "Selected")}>
                      <CheckCircle fontSize="small" />
                    </IconButton>
                    <IconButton size="small" title="Reject" color="error" onClick={() => handleStatusUpdate(app.id, "Rejected")}>
                      <Cancel fontSize="small" />
                    </IconButton>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
            {filteredApps.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 4, color: "text.secondary" }}>
                  No applications found matching your criteria.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default AdminApplications;
