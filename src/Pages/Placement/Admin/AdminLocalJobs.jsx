import React, { useState, useEffect } from "react";
import {
  Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  IconButton, Button, Typography, TextField, InputAdornment, Dialog,
  DialogTitle, DialogContent, DialogActions, Stack, MenuItem, Alert, Snackbar
} from "@mui/material";
import { PostAdd, Search, Edit, Delete, Storefront } from "@mui/icons-material";
import { placementRepository } from "../../../repositories/placementRepository";
import AdminPageHeader from "../../../components/Placement/AdminPageHeader";

const AdminLocalJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({ company: "", role: "", type: "Startup", location: "", salary: "" });
  const [toast, setToast] = useState({ open: false, message: "", severity: "success" });

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    const res = await placementRepository.getJobs();
    if (res.success) setJobs(res.data);
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleAdd = async () => {
    if (!formData.company || !formData.role) return;
    const res = await placementRepository.addJob(formData);
    if (res.success) {
      fetchJobs();
      handleClose();
      setFormData({ company: "", role: "", type: "Startup", location: "", salary: "" });
      setToast({ open: true, message: "Local job added successfully!", severity: "success" });
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

  return (
    <Box sx={{ p: 4 }}>
      <AdminPageHeader 
        title="Local Job Hub 📍" 
        description="List part-time opportunities, internships, and neighborhood shop roles for students."
        action={
          <Button 
            variant="contained" 
            startIcon={<PostAdd />} 
            onClick={handleOpen}
            sx={{ bgcolor: "var(--clr-primary)", fontWeight: 700, px: 3 }}
          >
            Add Neighborhood Job
          </Button>
        }
      />

      <Paper className="glass-card" sx={{ p: 2, mb: 4 }}>
        <TextField
          size="small"
          placeholder="Search neighborhood jobs..."
          fullWidth
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: <InputAdornment position="start"><Search fontSize="small" /></InputAdornment>,
          }}
        />
      </Paper>

      <TableContainer component={Paper} className="grid-common" sx={{ p: 2 }}>
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
              <TableRow key={row.id} sx={{ "&:hover": { bgcolor: "rgba(255,255,255,0.02)" } }}>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Box sx={{ p: 1, borderRadius: 1, bgcolor: "rgba(16,185,129,0.1)", color: "var(--clr-primary)" }}>
                      <Storefront fontSize="small" />
                    </Box>
                    <Typography variant="body2" fontWeight={700}>{row.company || row.employer}</Typography>
                  </Box>
                </TableCell>
                <TableCell>{row.role || row.title}</TableCell>
                <TableCell>{row.type}</TableCell>
                <TableCell>{row.location}</TableCell>
                <TableCell sx={{ color: "var(--clr-primary)", fontWeight: 700 }}>{row.salary || row.pay}</TableCell>
                <TableCell align="right">
                  <IconButton size="small" sx={{ color: "text.secondary", "&:hover": { color: "var(--clr-primary)" } }}><Edit fontSize="small" /></IconButton>
                  <IconButton size="small" sx={{ color: "text.secondary", "&:hover": { color: "error.main" } }} onClick={() => handleDelete(row.id)}><Delete fontSize="small" /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add Job Dialog */}
      <Dialog open={open} onClose={handleClose} PaperProps={{ className: "glass-card", sx: { minWidth: 450 } }}>
        <DialogTitle sx={{ fontWeight: 800 }}>Add Local Opportunity</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <TextField fullWidth label="Company / Shop Name" variant="outlined" value={formData.company} onChange={(e) => setFormData({...formData, company: e.target.value})} />
            <TextField fullWidth label="Role" variant="outlined" value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})} />
            <TextField select fullWidth label="Type" variant="outlined" value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})}>
              <MenuItem value="Startup">Startup</MenuItem>
              <MenuItem value="Shop">Retail Shop</MenuItem>
              <MenuItem value="Internship">Internship</MenuItem>
              <MenuItem value="Part-time">Part-time</MenuItem>
            </TextField>
            <TextField fullWidth label="Location (Area)" variant="outlined" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} />
            <TextField fullWidth label="Salary / Stipend" variant="outlined" value={formData.salary} onChange={(e) => setFormData({...formData, salary: e.target.value})} />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleClose} color="inherit">Cancel</Button>
          <Button onClick={handleAdd} variant="contained" sx={{ bgcolor: "var(--clr-primary)", fontWeight: 700 }}>Post Opportunity</Button>
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
