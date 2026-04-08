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
  IconButton,
  Chip,
  Typography,
  TextField,
  InputAdornment,
  MenuItem,
  Stack,
  Card,
  CardContent,
  Grid,
  useMediaQuery,
  Divider,
  Avatar,
  Button,
  Collapse,
} from "@mui/material";
import { 
  Search, 
  CheckCircle, 
  Cancel, 
  AssignmentTurnedIn, 
  FilterList,
  Business,
  Work,
  ExpandMore,
  ExpandLess,
  Person,
} from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import { alpha } from "@mui/material/styles";
import { placementRepository } from "../../../repositories/placementRepository";
import AdminPageHeader from "../../../components/Placement/AdminPageHeader";

const AdminApplications = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));
  const [applications, setApplications] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [expandedCard, setExpandedCard] = useState(null);

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

  const getStatusConfig = (status) => {
    switch (status) {
      case "Selected":
        return {
          color: "#10b981",
          bg: alpha("#10b981", 0.1),
          gradient: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
          label: "Selected",
        };
      case "Shortlisted":
        return {
          color: "#f59e0b",
          bg: alpha("#f59e0b", 0.1),
          gradient: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
          label: "Shortlisted",
        };
      case "Rejected":
        return {
          color: "#ef4444",
          bg: alpha("#ef4444", 0.1),
          gradient: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
          label: "Rejected",
        };
      default:
        return {
          color: "#3b82f6",
          bg: alpha("#3b82f6", 0.1),
          gradient: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
          label: "Applied",
        };
    }
  };

  const filteredApps = applications.filter(app => {
    const matchesSearch = app.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         app.company?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleToggleExpand = (appId) => {
    setExpandedCard(expandedCard === appId ? null : appId);
  };

  return (
    <Box sx={{ p: isMobile ? 1.5 : isTablet ? 2 : 4 }}>
      {/* Header */}
      <Paper
        sx={{
          p: isMobile ? 2.5 : 4,
          mb: isMobile ? 2.5 : 4,
          background: "linear-gradient(135deg, rgba(168, 85, 247, 0.15) 0%, rgba(59, 130, 246, 0.1) 100%)",
          border: `1px solid ${alpha("#a855f7", 0.2)}`,
          borderRadius: isMobile ? 3 : 4,
        }}
      >
        <Typography
          variant={isMobile ? "h5" : "h4"}
          sx={{
            fontWeight: 800,
            mb: 1,
            background: "linear-gradient(135deg, #a855f7 0%, #3b82f6 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Applicant Tracking 🎯
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: "text.secondary",
            fontSize: isMobile ? "0.875rem" : "1rem",
          }}
        >
          Monitor student applications, update status, and finalize selections.
        </Typography>
      </Paper>

      {/* Control Bar */}
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
            placeholder="Filter by student or company..."
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
            label="Status" 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            sx={{ width: isMobile ? "100%" : 160 }}
          >
            <MenuItem value="All">All Statuses</MenuItem>
            <MenuItem value="Applied">Applied</MenuItem>
            <MenuItem value="Shortlisted">Shortlisted</MenuItem>
            <MenuItem value="Selected">Selected</MenuItem>
            <MenuItem value="Rejected">Rejected</MenuItem>
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
                <TableCell sx={{ fontWeight: 800, color: "text.secondary" }}>COMPANY</TableCell>
                <TableCell sx={{ fontWeight: 800, color: "text.secondary" }}>ROLE</TableCell>
                <TableCell sx={{ fontWeight: 800, color: "text.secondary" }}>STATUS</TableCell>
                <TableCell align="right" sx={{ fontWeight: 800, color: "text.secondary" }}>UPDATE STATUS</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredApps.map((app) => {
                const statusConfig = getStatusConfig(app.status);
                return (
                  <TableRow key={app.id} sx={{ "&:hover": { bgcolor: alpha(theme.palette.primary.main, 0.02) } }}>
                    <TableCell sx={{ fontWeight: 700 }}>{app.name || app.studentId}</TableCell>
                    <TableCell>{app.company}</TableCell>
                    <TableCell>{app.role}</TableCell>
                    <TableCell>
                      <Chip
                        label={statusConfig.label}
                        size="small"
                        sx={{
                          bgcolor: statusConfig.bg,
                          color: statusConfig.color,
                          fontWeight: 800,
                          border: `1.5px solid ${alpha(statusConfig.color, 0.3)}`,
                        }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Stack direction="row" spacing={1} justifyContent="flex-end">
                        <IconButton
                          size="small"
                          title="Shortlist"
                          onClick={() => handleStatusUpdate(app.id, "Shortlisted")}
                          sx={{
                            color: "#f59e0b",
                            "&:hover": { bgcolor: alpha("#f59e0b", 0.1) },
                          }}
                        >
                          <AssignmentTurnedIn fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          title="Select"
                          onClick={() => handleStatusUpdate(app.id, "Selected")}
                          sx={{
                            color: "#10b981",
                            "&:hover": { bgcolor: alpha("#10b981", 0.1) },
                          }}
                        >
                          <CheckCircle fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          title="Reject"
                          onClick={() => handleStatusUpdate(app.id, "Rejected")}
                          sx={{
                            color: "#ef4444",
                            "&:hover": { bgcolor: alpha("#ef4444", 0.1) },
                          }}
                        >
                          <Cancel fontSize="small" />
                        </IconButton>
                      </Stack>
                    </TableCell>
                  </TableRow>
                );
              })}
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
      )}

      {/* Mobile: Card View */}
      {isMobile && (
        <Grid container spacing={2}>
          {filteredApps.map((app) => {
            const statusConfig = getStatusConfig(app.status);
            const isExpanded = expandedCard === app.id;
            
            return (
              <Grid item xs={12} key={app.id}>
                <Card
                  sx={{
                    borderRadius: 3,
                    bgcolor: alpha(theme.palette.background.paper, 0.6),
                    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                    overflow: "hidden",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: `0 8px 16px ${alpha(theme.palette.primary.main, 0.15)}`,
                    },
                  }}
                >
                  {/* Status Bar */}
                  <Box
                    sx={{
                      height: 4,
                      background: statusConfig.gradient,
                      width: "100%",
                    }}
                  />

                  <CardContent sx={{ p: 2.5 }}>
                    {/* Header */}
                    <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2 }}>
                      <Avatar sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1), width: 48, height: 48 }}>
                        <Person sx={{ color: theme.palette.primary.main }} />
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="subtitle1" fontWeight={800} sx={{ mb: 0.25 }}>
                          {app.name || app.studentId}
                        </Typography>
                        <Stack direction="row" alignItems="center" spacing={0.5}>
                          <Work sx={{ fontSize: "0.875rem", color: "text.secondary" }} />
                          <Typography variant="body2" color="text.secondary" fontWeight={600}>
                            {app.role}
                          </Typography>
                        </Stack>
                      </Box>
                      <Chip
                        label={statusConfig.label}
                        size="small"
                        sx={{
                          bgcolor: statusConfig.bg,
                          color: statusConfig.color,
                          fontWeight: 800,
                          border: `1.5px solid ${alpha(statusConfig.color, 0.3)}`,
                        }}
                      />
                    </Stack>

                    <Divider sx={{ mb: 2, opacity: 0.1 }} />

                    {/* Company */}
                    <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                      <Business sx={{ fontSize: "1rem", color: "text.secondary" }} />
                      <Typography variant="body2" fontWeight={700}>
                        {app.company}
                      </Typography>
                    </Stack>

                    {/* Action Buttons */}
                    <Stack direction="row" spacing={1}>
                      <Button
                        size="small"
                        startIcon={<AssignmentTurnedIn />}
                        onClick={() => handleStatusUpdate(app.id, "Shortlisted")}
                        sx={{
                          flex: 1,
                          color: "#f59e0b",
                          borderColor: alpha("#f59e0b", 0.3),
                          bgcolor: alpha("#f59e0b", 0.05),
                          "&:hover": { bgcolor: alpha("#f59e0b", 0.1) },
                          borderRadius: 2,
                        }}
                        variant="outlined"
                      >
                        Shortlist
                      </Button>
                      <Button
                        size="small"
                        startIcon={<CheckCircle />}
                        onClick={() => handleStatusUpdate(app.id, "Selected")}
                        sx={{
                          flex: 1,
                          color: "#10b981",
                          borderColor: alpha("#10b981", 0.3),
                          bgcolor: alpha("#10b981", 0.05),
                          "&:hover": { bgcolor: alpha("#10b981", 0.1) },
                          borderRadius: 2,
                        }}
                        variant="outlined"
                      >
                        Select
                      </Button>
                      <Button
                        size="small"
                        startIcon={<Cancel />}
                        onClick={() => handleStatusUpdate(app.id, "Rejected")}
                        sx={{
                          flex: 1,
                          color: "#ef4444",
                          borderColor: alpha("#ef4444", 0.3),
                          bgcolor: alpha("#ef4444", 0.05),
                          "&:hover": { bgcolor: alpha("#ef4444", 0.1) },
                          borderRadius: 2,
                        }}
                        variant="outlined"
                      >
                        Reject
                      </Button>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}

          {filteredApps.length === 0 && (
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
                <FilterList sx={{ fontSize: "3rem", color: "text.secondary", opacity: 0.3, mb: 2 }} />
                <Typography variant="h6" fontWeight={700} color="text.secondary" sx={{ mb: 1 }}>
                  No applications found
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

export default AdminApplications;
