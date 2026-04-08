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
  Chip,
  Typography,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  Card,
  CardContent,
  Grid,
  useMediaQuery,
  Divider,
  Avatar,
  Alert,
  Snackbar,
} from "@mui/material";
import { 
  Edit, 
  Delete, 
  PostAdd, 
  Apartment, 
  Search,
  CalendarToday,
  LocationOn,
  AttachMoney,
} from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import { alpha } from "@mui/material/styles";
import { placementRepository } from "../../../repositories/placementRepository";
import AdminPageHeader from "../../../components/Placement/AdminPageHeader";

const AdminPlacements = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));
  const [updates, setUpdates] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [toast, setToast] = useState({ open: false, message: "", severity: "success" });
  const [formData, setFormData] = useState({ 
    company: "", 
    role: "", 
    date: "", 
    status: "Upcoming", 
    location: "",
    type: "Full-time",
    description: "",
    eligibility: "",
    package: ""
  });

  useEffect(() => {
    fetchUpdates();
  }, []);

  const fetchUpdates = async () => {
    const res = await placementRepository.getUpdates();
    if (res.success) setUpdates(res.data);
  };

  const handleOpen = (update = null) => {
    if (update) {
      setEditingId(update.id);
      setFormData({
        company: update.company || "",
        role: update.role || "",
        date: update.date || "",
        status: update.status || "Upcoming",
        location: update.location || "",
        type: update.type || "Full-time",
        description: update.description || "",
        eligibility: update.eligibility || "",
        package: update.package || ""
      });
    } else {
      setEditingId(null);
      setFormData({ 
        company: "", 
        role: "", 
        date: "", 
        status: "Upcoming", 
        location: "",
        type: "Full-time",
        description: "",
        eligibility: "",
        package: ""
      });
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
      res = await placementRepository.updateUpdate(editingId, formData);
    } else {
      res = await placementRepository.addUpdate(formData);
    }
    
    if (res.success) {
      fetchUpdates();
      handleClose();
      setToast({ 
        open: true, 
        message: editingId ? "Drive updated successfully!" : "Drive added successfully!", 
        severity: "success" 
      });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this recruitment drive?")) {
      const res = await placementRepository.deleteUpdate(id);
      if (res.success) {
        fetchUpdates();
        setToast({ open: true, message: "Drive deleted successfully!", severity: "success" });
      }
    }
  };

  const filteredUpdates = updates.filter(u => 
    u.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.role?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{ p: isMobile ? 1.5 : isTablet ? 2 : 4 }}>
      {/* Header */}
      <Paper
        sx={{
          p: isMobile ? 2.5 : 4,
          mb: isMobile ? 2.5 : 4,
          background: "linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(59, 130, 246, 0.1) 100%)",
          border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
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
                background: "linear-gradient(135deg, #10b981 0%, #3b82f6 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Recruitment Drives 💼
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: "text.secondary",
                fontSize: isMobile ? "0.875rem" : "1rem",
              }}
            >
              Schedule and manage corporate placement drives.
            </Typography>
          </Box>
          <Button 
            variant="contained" 
            startIcon={<PostAdd />} 
            onClick={handleOpen}
            sx={{
              bgcolor: "var(--clr-primary)",
              fontWeight: 700,
              px: 3,
              borderRadius: 2,
            }}
          >
            Schedule New Drive
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
          placeholder="Search by company or role..."
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
                <TableCell sx={{ fontWeight: 800, color: "text.secondary" }}>COMPANY</TableCell>
                <TableCell sx={{ fontWeight: 800, color: "text.secondary" }}>ROLE</TableCell>
                <TableCell sx={{ fontWeight: 800, color: "text.secondary" }}>VISIT DATE</TableCell>
                <TableCell sx={{ fontWeight: 800, color: "text.secondary" }}>STATUS</TableCell>
                <TableCell align="right" sx={{ fontWeight: 800, color: "text.secondary" }}>ACTIONS</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUpdates.map((row) => (
                <TableRow key={row.id} sx={{ "&:hover": { bgcolor: alpha(theme.palette.primary.main, 0.02) } }}>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                      <Avatar sx={{ bgcolor: alpha("#10b981", 0.1), width: 40, height: 40 }}>
                        <Apartment sx={{ color: "#10b981", fontSize: "1.25rem" }} />
                      </Avatar>
                      <Typography variant="body2" fontWeight={700}>{row.company}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{row.role}</TableCell>
                  <TableCell>{row.date}</TableCell>
                  <TableCell>
                    <Chip 
                      label={row.status} 
                      size="small" 
                      sx={{ 
                        bgcolor: alpha("#10b981", 0.1), 
                        color: "var(--clr-primary)", 
                        fontWeight: 800,
                        borderRadius: "6px"
                      }} 
                    />
                  </TableCell>
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
              {filteredUpdates.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 4, color: "text.secondary" }}>
                    No matching recruitment drives found.
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
          {filteredUpdates.map((row) => (
            <Grid item xs={12} key={row.id}>
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
                  {/* Header */}
                  <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2 }}>
                    <Avatar sx={{ bgcolor: alpha("#10b981", 0.1), width: 48, height: 48 }}>
                      <Apartment sx={{ color: "#10b981", fontSize: "1.5rem" }} />
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle1" fontWeight={800} sx={{ mb: 0.25 }}>
                        {row.company}
                      </Typography>
                      <Stack direction="row" alignItems="center" spacing={0.5}>
                        <CalendarToday sx={{ fontSize: "0.875rem", color: "text.secondary" }} />
                        <Typography variant="body2" color="text.secondary" fontWeight={600}>
                          {row.date}
                        </Typography>
                      </Stack>
                    </Box>
                    <Chip
                      label={row.status}
                      size="small"
                      sx={{
                        bgcolor: alpha("#10b981", 0.1),
                        color: "var(--clr-primary)",
                        fontWeight: 800,
                        border: `1px solid ${alpha("#10b981", 0.2)}`,
                      }}
                    />
                  </Stack>

                  <Divider sx={{ mb: 2, opacity: 0.1 }} />

                  {/* Role */}
                  <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                    <LocationOn sx={{ fontSize: "1rem", color: "text.secondary" }} />
                    <Typography variant="body2" fontWeight={700}>
                      {row.role}
                    </Typography>
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

          {filteredUpdates.length === 0 && (
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
                <Apartment sx={{ fontSize: "3rem", color: "text.secondary", opacity: 0.3, mb: 2 }} />
                <Typography variant="h6" fontWeight={700} color="text.secondary" sx={{ mb: 1 }}>
                  No drives found
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ opacity: 0.7 }}>
                  Try adjusting your search or add a new drive
                </Typography>
              </Paper>
            </Grid>
          )}
        </Grid>
      )}

      {/* Add/Edit Drive Dialog */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle sx={{ fontWeight: 800 }}>
          {editingId ? "Edit Recruitment Drive" : "Schedule New Recruitment Drive"}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <TextField
              fullWidth
              label="Company Name"
              variant="outlined"
              value={formData.company}
              onChange={(e) => setFormData({...formData, company: e.target.value})}
            />
            <TextField
              fullWidth
              label="Role / Designation"
              variant="outlined"
              value={formData.role}
              onChange={(e) => setFormData({...formData, role: e.target.value})}
            />
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField
                fullWidth
                label="Job Location"
                variant="outlined"
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
              />
              <TextField
                fullWidth
                label="Package (e.g., 12 LPA)"
                variant="outlined"
                value={formData.package}
                onChange={(e) => setFormData({...formData, package: e.target.value})}
              />
            </Stack>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField 
                fullWidth 
                label="Visit Date" 
                type="date" 
                InputLabelProps={{ shrink: true }} 
                value={formData.date} 
                onChange={(e) => setFormData({...formData, date: e.target.value})} 
              />
              <TextField 
                select 
                fullWidth 
                label="Job Type" 
                variant="outlined" 
                value={formData.type} 
                onChange={(e) => setFormData({...formData, type: e.target.value})}
                SelectProps={{ native: true }}
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Internship">Internship</option>
              </TextField>
            </Stack>
            <TextField 
              select 
              fullWidth 
              label="Status" 
              variant="outlined" 
              value={formData.status} 
              onChange={(e) => setFormData({...formData, status: e.target.value})}
              SelectProps={{ native: true }}
            >
              <option value="Upcoming">Upcoming</option>
              <option value="Open">Open</option>
              <option value="Closed">Closed</option>
              <option value="Completed">Completed</option>
            </TextField>
            <TextField 
              fullWidth 
              label="Eligibility Criteria" 
              variant="outlined" 
              placeholder="e.g., CGPA > 7.5, No backlogs"
              multiline
              rows={2}
              value={formData.eligibility} 
              onChange={(e) => setFormData({...formData, eligibility: e.target.value})} 
            />
            <TextField 
              fullWidth 
              label="Job Description" 
              variant="outlined" 
              placeholder="Brief description of the role..."
              multiline
              rows={3}
              value={formData.description} 
              onChange={(e) => setFormData({...formData, description: e.target.value})} 
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
            {editingId ? "Update Drive" : "Save Drive"}
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

export default AdminPlacements;
