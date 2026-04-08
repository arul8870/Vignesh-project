import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  TextField,
  InputAdornment,
  MenuItem,
} from "@mui/material";
import { Search, FilterList, CheckCircle, Cancel, Stars, AssignmentTurnedIn } from "@mui/icons-material";
import { mockStorage } from "../../api/mockStorage";

const ApplicationManager = () => {
  const [applications, setApplications] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Seeding some application-like data from students locally
    const students = mockStorage.get("STUDENTS");
    setApplications(students);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "Selected": return "success";
      case "Shortlisted": return "warning";
      case "Rejected": return "error";
      default: return "default";
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, color: "var(--clr-primary)", mb: 1 }}>
          Application Tracking Board 📋
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Track student progress across different drives. Update status in real-time.
        </Typography>
      </Box>

      {/* Filters & Search */}
      <Paper className="glass-card" sx={{ p: 2, mb: 4, display: "flex", gap: 2, alignItems: "center" }}>
        <TextField
          size="small"
          placeholder="Search students or companies..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ flex: 1 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search sx={{ color: "text.secondary" }} />
              </InputAdornment>
            ),
          }}
        />
        <TextField select size="small" label="Drive" defaultValue="All" sx={{ width: 200 }}>
          <MenuItem value="All">All Drives</MenuItem>
          <MenuItem value="Google">Google</MenuItem>
          <MenuItem value="Amazon">Amazon</MenuItem>
        </TextField>
      </Paper>

      {/* Applications Table */}
      <TableContainer component={Paper} className="grid-common">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 700 }}>Student Name</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Target Company</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Department</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Current Status</TableCell>
              <TableCell align="right" sx={{ fontWeight: 700 }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {applications.map((app) => (
              <TableRow key={app.id}>
                <TableCell sx={{ fontWeight: 600 }}>{app.name}</TableCell>
                <TableCell>{app.company}</TableCell>
                <TableCell>{app.dept}</TableCell>
                <TableCell>
                  <Chip 
                    label={app.status || "Applied"} 
                    size="small" 
                    color={getStatusColor(app.status)} 
                    sx={{ fontWeight: 700 }}
                  />
                </TableCell>
                <TableCell align="right">
                  <IconButton size="small" title="Shortlist" color="warning"><AssignmentTurnedIn /></IconButton>
                  <IconButton size="small" title="Select" color="success"><CheckCircle /></IconButton>
                  <IconButton size="small" title="Reject" color="error"><Cancel /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ApplicationManager;
