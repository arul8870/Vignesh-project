import React, { useState, useEffect } from "react";
import {
  Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  IconButton, Button, Chip, Typography, TextField, InputAdornment, Dialog,
  DialogTitle, DialogContent, DialogActions, Stack, Alert, Snackbar
} from "@mui/material";
import { Edit, Delete, PostAdd, Apartment, Search } from "@mui/icons-material";
import { placementRepository } from "../../../repositories/placementRepository";
import AdminPageHeader from "../../../components/Placement/AdminPageHeader";

const AdminPlacements = () => {
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
    <Box sx={{ p: 4 }}>
      <AdminPageHeader 
        title="Recruitment Drives 💼" 
        description="Schedule and manage upcoming corporate placement drives, update eligibility, and monitor drive status."
        action={
          <Button 
            variant="contained" 
            startIcon={<PostAdd />} 
            onClick={handleOpen}
            sx={{ bgcolor: "var(--clr-primary)", fontWeight: 700, px: 3 }}
          >
            Schedule New Drive
          </Button>
        }
      />

      <Paper className="glass-card" sx={{ p: 2, mb: 4, display: "flex", gap: 3, alignItems: "center" }}>
        <TextField
          size="small"
          placeholder="Search by company or role..."
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
              <TableCell sx={{ fontWeight: 800, color: "text.secondary" }}>COMPANY</TableCell>
              <TableCell sx={{ fontWeight: 800, color: "text.secondary" }}>ROLE</TableCell>
              <TableCell sx={{ fontWeight: 800, color: "text.secondary" }}>VISIT DATE</TableCell>
              <TableCell sx={{ fontWeight: 800, color: "text.secondary" }}>STATUS</TableCell>
              <TableCell align="right" sx={{ fontWeight: 800, color: "text.secondary" }}>ACTIONS</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUpdates.map((row) => (
              <TableRow key={row.id} sx={{ "&:hover": { bgcolor: "rgba(255,255,255,0.02)" } }}>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Box sx={{ p: 1, borderRadius: 1, bgcolor: "rgba(16,185,129,0.1)", color: "var(--clr-primary)" }}>
                      <Apartment fontSize="small" />
                    </Box>
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
                      bgcolor: "rgba(16,185,129,0.1)", 
                      color: "var(--clr-primary)", 
                      fontWeight: 800,
                      borderRadius: "6px"
                    }} 
                  />
                </TableCell>
                <TableCell align="right">
                  <IconButton size="small" sx={{ color: "text.secondary", "&:hover": { color: "var(--clr-primary)" } }} onClick={() => handleOpen(row)}>
                    <Edit fontSize="small" />
                  </IconButton>
                  <IconButton size="small" sx={{ color: "text.secondary", "&:hover": { color: "error.main" } }} onClick={() => handleDelete(row.id)}>
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

      {/* Add/Edit Drive Dialog */}
      <Dialog open={open} onClose={handleClose} PaperProps={{ className: "glass-card", sx: { minWidth: 550 } }}>
        <DialogTitle sx={{ fontWeight: 800 }}>
          {editingId ? "Edit Recruitment Drive" : "Schedule New Recruitment Drive"}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <TextField fullWidth label="Company Name" variant="outlined" value={formData.company} onChange={(e) => setFormData({...formData, company: e.target.value})} />
            <TextField fullWidth label="Role / Designation" variant="outlined" value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})} />
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField fullWidth label="Job Location" variant="outlined" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} />
              <TextField fullWidth label="Package (e.g., 12 LPA)" variant="outlined" value={formData.package} onChange={(e) => setFormData({...formData, package: e.target.value})} />
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
          <Button onClick={handleAdd} variant="contained" sx={{ bgcolor: "var(--clr-primary)", fontWeight: 700 }}>
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
