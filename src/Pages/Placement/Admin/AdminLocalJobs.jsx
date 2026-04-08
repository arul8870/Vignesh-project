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
  Button,
  Typography,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  MenuItem,
  Card,
  CardContent,
  Grid,
  useMediaQuery,
  Divider,
  Avatar,
  Chip,
  Alert,
  Snackbar,
} from "@mui/material";
import { 
  PostAdd, 
  Search, 
  Edit, 
  Delete, 
  Storefront,
  LocationOn,
  AttachMoney,
  Business,
} from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import { alpha } from "@mui/material/styles";
import { placementRepository } from "../../../repositories/placementRepository";
import AdminPageHeader from "../../../components/Placement/AdminPageHeader";

const AdminLocalJobs = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));
  const [jobs, setJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ company: "", role: "", type: "Startup", location: "", salary: "" });
  const [toast, setToast] = useState({ open: false, message: "", severity: "success" });

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    const res = await placementRepository.getJobs();
    if (res.success) setJobs(res.data);
  };

  const handleOpen = (job = null) => {
    if (job) {
      setEditingId(job.id);
      setFormData({
        company: job.company || job.employer || "",
        role: job.role || job.title || "",
        type: job.type || "Startup",
        location: job.location || "",
        salary: job.salary || job.pay || "",
      });
    } else {
      setEditingId(null);
      setFormData({ company: "", role: "", type: "Startup", location: "", salary: "" });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingId(null);
  };

  const handleAdd = async () => {
    if (!formData.company || !formData.role) return;
    
    let res;
    if (editingId) {
      res = await placementRepository.updateJob(editingId, formData);
    } else {
      res = await placementRepository.addJob(formData);
    }
    
    if (res.success) {
      fetchJobs();
      handleClose();
      setFormData({ company: "", role: "", type: "Startup", location: "", salary: "" });
      setToast({ open: true, message: editingId ? "Job updated successfully!" : "Local job added successfully!", severity: "success" });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this job?")) {
      const res = await placementRepository.deleteJob(id);
      if (res.success) {
        fetchJobs();
        setToast({ open: true, message: "Job deleted successfully!", severity: "success" });
      }
    }
  };

  const filteredJobs = jobs.filter(j => 
    j.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    j.role?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTypeGradient = (type) => {
    switch(type) {
      case "Startup": return "linear-gradient(135deg, #10b981 0%, #059669 100%)";
      case "Shop": return "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)";
      case "Internship": return "linear-gradient(135deg, #a855f7 0%, #9333ea 100%)";
      default: return "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)";
    }
  };

  return (
    <Box sx={{ p: isMobile ? 1.5 : isTablet ? 2 : 4 }}>
      {/* Header */}
      <Paper
        sx={{
          p: isMobile ? 2.5 : 4,
          mb: isMobile ? 2.5 : 4,
          background: "linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(16, 185, 129, 0.1) 100%)",
          border: `1px solid ${alpha("#f59e0b", 0.2)}`,
          borderRadius: isMobile ? 3 : 4,
        }}
      >
        <Stack
          direction={isMobile ? "column" : "row"}
          justifyContent="space-between"
          alignItems={isMobile ? "flex-start" : "center"}
          spacing={isMobile ? 2 : 0}
        >
          <Box>
            <Typography
              variant={isMobile ? "h5" : "h4"}
              sx={{
                fontWeight: 800,
                mb: 1,
                background: "linear-gradient(135deg, #f59e0b 0%, #10b981 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Local Job Hub 📍
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: "text.secondary",
                fontSize: isMobile ? "0.875rem" : "1rem",
              }}
            >
              List part-time opportunities, internships, and neighborhood shop roles.
            </Typography>
          </Box>
          <Button 
            variant="contained" 
            startIcon={<PostAdd />} 
            onClick={() => handleOpen()}
            sx={{
              bgcolor: "var(--clr-primary)",
              fontWeight: 700,
              px: 3,
              borderRadius: 2,
            }}
          >
            Add Neighborhood Job
          </Button>
        </Stack>
      </Paper>

      {/* Search Bar */}
      <Paper
        sx={{
          p: isMobile ? 1.5 : 2,
          mb: isMobile ? 2.5 : 4,
          borderRadius: 3,
          bgcolor: alpha(theme.palette.background.paper, 0.6),
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        }}
      >
        <TextField
          size="small"
          placeholder="Search neighborhood jobs..."
          fullWidth
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
      </Paper>

      {/* Desktop: Table View */}
      {!isMobile && (
        <TableContainer component={Paper} sx={{ p: 2, borderRadius: 3 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 800, color: "text.secondary" }}>COMPANY / SHOP</TableCell>
                <TableCell sx={{ fontWeight: 800, color: "text.secondary" }}>ROLE</TableCell>
                <TableCell sx={{ fontWeight: 800, color: "text.secondary" }}>TYPE</TableCell>
                <TableCell sx={{ fontWeight: 800, color: "text.secondary" }}>LOCATION</TableCell>
                <TableCell sx={{ fontWeight: 800, color: "text.secondary" }}>SALARY</TableCell>
                <TableCell align="right" sx={{ fontWeight: 800, color: "text.secondary" }}>ACTIONS</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredJobs.map((row) => (
                <TableRow key={row.id} sx={{ "&:hover": { bgcolor: alpha(theme.palette.primary.main, 0.02) } }}>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                      <Avatar sx={{ bgcolor: alpha("#10b981", 0.1), width: 40, height: 40 }}>
                        <Storefront sx={{ color: "#10b981", fontSize: "1.25rem" }} />
                      </Avatar>
                      <Typography variant="body2" fontWeight={700}>{row.company || row.employer}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{row.role || row.title}</TableCell>
                  <TableCell>{row.type}</TableCell>
                  <TableCell>{row.location}</TableCell>
                  <TableCell sx={{ color: "var(--clr-primary)", fontWeight: 700 }}>{row.salary || row.pay}</TableCell>
                  <TableCell align="right">
                    <IconButton
                      size="small"
                      onClick={() => handleOpen(row)}
                      sx={{
                        color: "text.secondary",
                        "&:hover": { color: "var(--clr-primary)", bgcolor: alpha("#10b981", 0.1) },
                      }}
                    >
                      <Edit fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDelete(row.id)}
                      sx={{
                        color: "text.secondary",
                        "&:hover": { color: "error.main", bgcolor: alpha("#ef4444", 0.1) },
                      }}
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Mobile: Card View */}
      {isMobile && (
        <Grid container spacing={2}>
          {filteredJobs.map((row) => (
            <Grid item xs={12} key={row.id}>
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
                {/* Type Gradient Header */}
                <Box
                  sx={{
                    p: 2,
                    background: getTypeGradient(row.type),
                    position: "relative",
                  }}
                >
                  <Stack direction="row" alignItems="center" spacing={1.5}>
                    <Avatar sx={{ bgcolor: "rgba(255,255,255,0.2)", width: 48, height: 48 }}>
                      <Storefront sx={{ color: "white", fontSize: "1.5rem" }} />
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle1" fontWeight={800} color="white" sx={{ mb: 0.25 }}>
                        {row.company || row.employer}
                      </Typography>
                      <Typography variant="body2" color="rgba(255,255,255,0.9)" fontWeight={600}>
                        {row.role || row.title}
                      </Typography>
                    </Box>
                    <Chip
                      label={row.type}
                      size="small"
                      sx={{
                        bgcolor: "rgba(255,255,255,0.25)",
                        color: "white",
                        fontWeight: 700,
                        backdropFilter: "blur(10px)",
                      }}
                    />
                  </Stack>
                </Box>

                <CardContent sx={{ p: 2.5 }}>
                  {/* Details */}
                  <Stack spacing={1.5} sx={{ mb: 2 }}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <LocationOn sx={{ fontSize: "1rem", color: "text.secondary" }} />
                      <Typography variant="body2" fontWeight={600} color="text.secondary">
                        {row.location || "Not specified"}
                      </Typography>
                    </Stack>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <AttachMoney sx={{ fontSize: "1rem", color: "#10b981" }} />
                      <Typography variant="body2" fontWeight={700} color="var(--clr-primary)">
                        {row.salary || row.pay || "Negotiable"}
                      </Typography>
                    </Stack>
                  </Stack>

                  {/* Action Buttons */}
                  <Stack direction="row" spacing={1}>
                    <Button
                      size="small"
                      startIcon={<Edit />}
                      onClick={() => handleOpen(row)}
                      sx={{
                        flex: 1,
                        color: "var(--clr-primary)",
                        borderColor: alpha("#10b981", 0.3),
                        bgcolor: alpha("#10b981", 0.05),
                        "&:hover": { bgcolor: alpha("#10b981", 0.1) },
                        borderRadius: 2,
                      }}
                      variant="outlined"
                    >
                      Edit
                    </Button>
                    <Button
                      size="small"
                      startIcon={<Delete />}
                      onClick={() => handleDelete(row.id)}
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
                      Delete
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}

          {filteredJobs.length === 0 && (
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
                <Storefront sx={{ fontSize: "3rem", color: "text.secondary", opacity: 0.3, mb: 2 }} />
                <Typography variant="h6" fontWeight={700} color="text.secondary" sx={{ mb: 1 }}>
                  No local jobs found
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ opacity: 0.7 }}>
                  Try adjusting your search or add a new job
                </Typography>
              </Paper>
            </Grid>
          )}
        </Grid>
      )}

      {/* Add Job Dialog */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle sx={{ fontWeight: 800 }}>
          {editingId ? "Edit Local Opportunity" : "Add Local Opportunity"}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <TextField
              fullWidth
              label="Company / Shop Name"
              variant="outlined"
              value={formData.company}
              onChange={(e) => setFormData({...formData, company: e.target.value})}
            />
            <TextField
              fullWidth
              label="Role"
              variant="outlined"
              value={formData.role}
              onChange={(e) => setFormData({...formData, role: e.target.value})}
            />
            <TextField
              select
              fullWidth
              label="Type"
              variant="outlined"
              value={formData.type}
              onChange={(e) => setFormData({...formData, type: e.target.value})}
            >
              <MenuItem value="Startup">Startup</MenuItem>
              <MenuItem value="Shop">Retail Shop</MenuItem>
              <MenuItem value="Internship">Internship</MenuItem>
              <MenuItem value="Part-time">Part-time</MenuItem>
            </TextField>
            <TextField
              fullWidth
              label="Location (Area)"
              variant="outlined"
              value={formData.location}
              onChange={(e) => setFormData({...formData, location: e.target.value})}
            />
            <TextField
              fullWidth
              label="Salary / Stipend"
              variant="outlined"
              value={formData.salary}
              onChange={(e) => setFormData({...formData, salary: e.target.value})}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleClose} color="inherit">Cancel</Button>
          <Button
            onClick={handleAdd}
            variant="contained"
            sx={{ bgcolor: "var(--clr-primary)", fontWeight: 700 }}
          >
            {editingId ? "Update" : "Post Opportunity"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar 
        open={toast.open} 
        autoHideDuration={3000} 
        onClose={() => setToast({ ...toast, open: false })}
      >
        <Alert severity={toast.severity} sx={{ width: '100%', fontWeight: 700 }}>
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminLocalJobs;
