import React, { useState, useEffect } from "react";
import {
  Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Typography, TextField, InputAdornment, MenuItem, Avatar, Chip
} from "@mui/material";
import { Search, FilterList, School } from "@mui/icons-material";
import { mockStorage } from "../../../api/mockStorage";
import AdminPageHeader from "../../../components/Placement/AdminPageHeader";

const AdminStudents = () => {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [deptFilter, setDeptFilter] = useState("All");

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = () => {
    const data = mockStorage.get("STUDENTS");
    setStudents(data);
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         (student.id && student.id.toString().includes(searchTerm));
    const matchesDept = deptFilter === "All" || student.dept === deptFilter;
    return matchesSearch && matchesDept;
  });

  return (
    <Box sx={{ p: 4 }}>
      <AdminPageHeader 
        title="Student Registry 🏫" 
        description="Complete institutional database of eligible students. Search by name, filter by department, and audit placement history."
      />

      {/* Filter Bar */}
      <Paper className="glass-card" sx={{ p: 2, mb: 4, display: "flex", gap: 3, alignItems: "center" }}>
        <TextField
          size="small"
          placeholder="Search students by name or ID..."
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
          label="Department" 
          value={deptFilter} 
          onChange={(e) => setDeptFilter(e.target.value)}
          sx={{ width: 180 }}
        >
          <MenuItem value="All">All Departments</MenuItem>
          <MenuItem value="CSE">CSE</MenuItem>
          <MenuItem value="IT">IT</MenuItem>
          <MenuItem value="ECE">ECE</MenuItem>
        </TextField>
      </Paper>

      <TableContainer component={Paper} className="grid-common" sx={{ p: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 800, color: "text.secondary" }}>STUDENT</TableCell>
              <TableCell sx={{ fontWeight: 800, color: "text.secondary" }}>DEPARTMENT</TableCell>
              <TableCell sx={{ fontWeight: 800, color: "text.secondary" }}>BATCH</TableCell>
              <TableCell sx={{ fontWeight: 800, color: "text.secondary" }}>PLACEMENT STATUS</TableCell>
              <TableCell align="right" sx={{ fontWeight: 800, color: "text.secondary" }}>LATEST OFFER</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredStudents.map((student) => (
              <TableRow key={student.id} sx={{ "&:hover": { bgcolor: "rgba(255,255,255,0.02)" } }}>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Avatar sx={{ width: 32, height: 32, bgcolor: "var(--clr-primary)", fontSize: "0.875rem" }}>
                      {student.name.charAt(0)}
                    </Avatar>
                    <Typography variant="body2" fontWeight={700}>{student.name}</Typography>
                  </Box>
                </TableCell>
                <TableCell>{student.dept}</TableCell>
                <TableCell>{student.year || "2024"}</TableCell>
                <TableCell>
                  <Chip 
                    label={student.status || "Eligible"} 
                    variant="outlined" 
                    size="small"
                    sx={{ 
                      borderColor: student.status === "Selected" ? "var(--clr-primary)" : "rgba(255,255,255,0.1)",
                      color: student.status === "Selected" ? "var(--clr-primary)" : "text.secondary",
                      fontWeight: 700
                    }}
                  />
                </TableCell>
                <TableCell align="right">
                  <Typography variant="body2" fontWeight={600}>{student.company || "-"}</Typography>
                </TableCell>
              </TableRow>
            ))}
            {filteredStudents.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 4, color: "text.secondary" }}>
                  No students found matching your criteria.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default AdminStudents;
