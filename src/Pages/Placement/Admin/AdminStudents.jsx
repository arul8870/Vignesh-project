import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  TextField,
  InputAdornment,
  MenuItem,
  Avatar,
  Chip,
  Stack,
  Card,
  CardContent,
  Grid,
  useMediaQuery,
  Divider,
} from "@mui/material";
import { Search, FilterList, School, Email, Phone } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import { alpha } from "@mui/material/styles";
import { mockStorage } from "../../../api/mockStorage";
import AdminPageHeader from "../../../components/Placement/AdminPageHeader";

const AdminStudents = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));
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
    <Box sx={{ p: isMobile ? 1.5 : isTablet ? 2 : 4 }}>
      {/* Header */}
      <Paper
        sx={{
          p: isMobile ? 2.5 : 4,
          mb: isMobile ? 2.5 : 4,
          background: "linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(16, 185, 129, 0.1) 100%)",
          border: `1px solid ${alpha("#3b82f6", 0.2)}`,
          borderRadius: isMobile ? 3 : 4,
        }}
      >
        <Typography
          variant={isMobile ? "h5" : "h4"}
          sx={{
            fontWeight: 800,
            mb: 1,
            background: "linear-gradient(135deg, #3b82f6 0%, #10b981 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Student Registry 🏫
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: "text.secondary",
            fontSize: isMobile ? "0.875rem" : "1rem",
          }}
        >
          Complete institutional database of eligible students. Search and filter by department.
        </Typography>
      </Paper>

      {/* Filter Bar */}
      <Paper
        sx={{
          p: isMobile ? 1.5 : 2,
          mb: isMobile ? 2.5 : 4,
          borderRadius: 3,
          bgcolor: alpha(theme.palette.background.paper, 0.6),
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        }}
      >
        <Stack
          direction={isMobile ? "column" : "row"}
          spacing={isMobile ? 1.5 : 2}
          alignItems={isMobile ? "stretch" : "center"}
        >
          <TextField
            size="small"
            placeholder="Search students by name or ID..."
            sx={{ flex: 1 }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ color: theme.palette.primary.main }} />
                </InputAdornment>
              ),
            }}
          />
          <TextField 
            select 
            size="small" 
            label="Department" 
            value={deptFilter} 
            onChange={(e) => setDeptFilter(e.target.value)}
            sx={{
              width: isMobile ? "100%" : 180,
            }}
          >
            <MenuItem value="All">All Departments</MenuItem>
            <MenuItem value="CSE">CSE</MenuItem>
            <MenuItem value="IT">IT</MenuItem>
            <MenuItem value="ECE">ECE</MenuItem>
          </TextField>
        </Stack>
      </Paper>

      {/* Desktop: Table View */}
      {!isMobile && (
        <TableContainer component={Paper} sx={{ p: 2, borderRadius: 3 }}>
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
                <TableRow key={student.id} sx={{ "&:hover": { bgcolor: alpha(theme.palette.primary.main, 0.02) } }}>
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
                        borderColor: student.status === "Selected" ? "var(--clr-primary)" : alpha(theme.palette.divider, 0.2),
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
      )}

      {/* Mobile: Card View */}
      {isMobile && (
        <Grid container spacing={2}>
          {filteredStudents.map((student) => (
            <Grid item xs={12} key={student.id}>
              <Card
                sx={{
                  borderRadius: 3,
                  bgcolor: alpha(theme.palette.background.paper, 0.6),
                  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: `0 8px 16px ${alpha(theme.palette.primary.main, 0.15)}`,
                  },
                }}
              >
                <CardContent sx={{ p: 2.5 }}>
                  {/* Header with Avatar & Name */}
                  <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
                    <Avatar
                      sx={{
                        width: 48,
                        height: 48,
                        bgcolor: "var(--clr-primary)",
                        fontSize: "1.25rem",
                        fontWeight: 700,
                      }}
                    >
                      {student.name.charAt(0)}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle1" fontWeight={800} sx={{ mb: 0.25 }}>
                        {student.name}
                      </Typography>
                      <Chip 
                        label={student.status || "Eligible"} 
                        size="small"
                        sx={{
                          bgcolor: student.status === "Selected" ? alpha("#10b981", 0.1) : alpha(theme.palette.divider, 0.1),
                          color: student.status === "Selected" ? "#10b981" : "text.secondary",
                          fontWeight: 700,
                          border: `1px solid ${student.status === "Selected" ? alpha("#10b981", 0.2) : alpha(theme.palette.divider, 0.2)}`,
                        }}
                      />
                    </Box>
                  </Stack>

                  <Divider sx={{ mb: 2, opacity: 0.1 }} />

                  {/* Details */}
                  <Stack spacing={1.5}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <School sx={{ fontSize: "1rem", color: "text.secondary" }} />
                        <Typography variant="body2" color="text.secondary" fontWeight={600}>
                          Department
                        </Typography>
                      </Stack>
                      <Typography variant="body2" fontWeight={700}>
                        {student.dept}
                      </Typography>
                    </Stack>
                    
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Email sx={{ fontSize: "1rem", color: "text.secondary" }} />
                        <Typography variant="body2" color="text.secondary" fontWeight={600}>
                          Batch
                        </Typography>
                      </Stack>
                      <Typography variant="body2" fontWeight={700}>
                        {student.year || "2024"}
                      </Typography>
                    </Stack>

                    {student.company && (
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Phone sx={{ fontSize: "1rem", color: "text.secondary" }} />
                          <Typography variant="body2" color="text.secondary" fontWeight={600}>
                            Latest Offer
                          </Typography>
                        </Stack>
                        <Typography variant="body2" fontWeight={700} color="var(--clr-primary)">
                          {student.company}
                        </Typography>
                      </Stack>
                    )}
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
          
          {filteredStudents.length === 0 && (
            <Grid item xs={12}>
              <Paper
                sx={{
                  p: 5,
                  textAlign: "center",
                  borderRadius: 3,
                  bgcolor: alpha(theme.palette.background.paper, 0.4),
                  border: `1px dashed ${alpha(theme.palette.divider, 0.2)}`,
                }}
              >
                <School sx={{ fontSize: "3rem", color: "text.secondary", opacity: 0.3, mb: 2 }} />
                <Typography variant="h6" fontWeight={700} color="text.secondary" sx={{ mb: 1 }}>
                  No students found
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ opacity: 0.7 }}>
                  Try adjusting your search or filter criteria
                </Typography>
              </Paper>
            </Grid>
          )}
        </Grid>
      )}
    </Box>
  );
};

export default AdminStudents;
