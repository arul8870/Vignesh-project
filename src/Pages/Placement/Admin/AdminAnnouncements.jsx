import React, { useState, useEffect } from "react";
import { Box, Grid, Paper, Typography, TextField, Button, Avatar, Stack, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Alert, Snackbar } from "@mui/material";
import { Campaign, Send, Person, AccessTime, Edit, Delete } from "@mui/icons-material";
import AdminPageHeader from "../../../components/Placement/AdminPageHeader";
import { placementRepository } from "../../../repositories/placementRepository";

const AdminAnnouncements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [formData, setFormData] = useState({ title: "", content: "" });
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [toast, setToast] = useState({ open: false, message: "", severity: "success" });

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    const res = await placementRepository.getAnnouncements();
    if (res.success) setAnnouncements(res.data);
  };

  const handleOpen = (announcement = null) => {
    if (announcement) {
      setEditingId(announcement.id);
      setFormData({ title: announcement.title || "", content: announcement.content || "" });
    } else {
      setEditingId(null);
      setFormData({ title: "", content: "" });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingId(null);
  };

  const handleBroadcast = async () => {
    if (!formData.title || !formData.content) return;
    
    let res;
    if (editingId) {
      res = await placementRepository.updateAnnouncement(editingId, {
        ...formData,
        author: "Placement Cell Admin",
      });
    } else {
      res = await placementRepository.addAnnouncement({
        ...formData,
        author: "Placement Cell Admin",
      });
    }
    
    if (res.success) {
      fetchAnnouncements();
      handleClose();
      setFormData({ title: "", content: "" });
      setToast({ 
        open: true, 
        message: editingId ? "Announcement updated successfully!" : "Announcement broadcasted successfully!", 
        severity: "success" 
      });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this announcement?")) {
      const res = await placementRepository.deleteAnnouncement(id);
      if (res.success) {
        fetchAnnouncements();
        setToast({ open: true, message: "Announcement deleted successfully!", severity: "success" });
      }
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <AdminPageHeader 
        title="Broadcast Center 📣" 
        description="Communicate campus-wide updates, drive reminders, and institutional news directly to student dashboards."
      />

      <Grid container spacing={4}>
        {/* Create Announcement Section */}
        <Grid item xs={12} lg={4}>
          <Paper className="grid-common" sx={{ p: 4 }}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 700 }}>Compose Announcement</Typography>
            <Stack spacing={3}>
              <Button 
                variant="outlined" 
                onClick={() => handleOpen()}
                sx={{ borderColor: "var(--clr-primary)", color: "var(--clr-primary)", fontWeight: 700, py: 1.5 }}
              >
                Create New Announcement
              </Button>
            </Stack>
          </Paper>
        </Grid>

        {/* Existing Announcements Feed */}
        <Grid item xs={12} lg={8}>
          <Stack spacing={3}>
            {announcements.map((item) => (
              <Paper key={item.id} className="glass-card" sx={{ p: 4 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                  <Box sx={{ display: "flex", gap: 2, alignItems: "center", flex: 1 }}>
                    <Avatar sx={{ bgcolor: "rgba(16,185,129,0.1)", color: "var(--clr-primary)" }}><Campaign /></Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 800 }}>{item.title}</Typography>
                      <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                        <Typography variant="caption" sx={{ display: "flex", alignItems: "center", gap: 0.5, color: "text.secondary" }}>
                          <Person sx={{ fontSize: "1rem" }} /> {item.author}
                        </Typography>
                        <Typography variant="caption" sx={{ display: "flex", alignItems: "center", gap: 0.5, color: "text.secondary" }}>
                          <AccessTime sx={{ fontSize: "1rem" }} /> {new Date(item.date).toLocaleDateString()}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <IconButton size="small" sx={{ color: "text.secondary", "&:hover": { color: "var(--clr-primary)" } }} onClick={() => handleOpen(item)}>
                      <Edit fontSize="small" />
                    </IconButton>
                    <IconButton size="small" sx={{ color: "text.secondary", "&:hover": { color: "error.main" } }} onClick={() => handleDelete(item.id)}>
                      <Delete fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>
                <Typography variant="body1" sx={{ color: "text.primary", lineHeight: 1.7 }}>
                  {item.content}
                </Typography>
              </Paper>
            ))}
            {announcements.length === 0 && (
              <Box sx={{ py: 10, textAlign: "center", border: "2px dashed rgba(255,255,255,0.05)", borderRadius: 4 }}>
                <Typography color="text.secondary">No announcements broadcasted yet.</Typography>
              </Box>
            )}
          </Stack>
        </Grid>
      </Grid>

      {/* Add/Edit Announcement Dialog */}
      <Dialog open={open} onClose={handleClose} PaperProps={{ className: "glass-card", sx: { minWidth: 500 } }}>
        <DialogTitle sx={{ fontWeight: 800 }}>
          {editingId ? "Edit Announcement" : "Create New Announcement"}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <TextField 
              fullWidth 
              label="Notice Title" 
              variant="outlined" 
              placeholder="e.g. Schedule Update" 
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
            <TextField 
              fullWidth 
              multiline 
              rows={6} 
              label="Content" 
              variant="outlined" 
              placeholder="Detailed message..." 
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleClose} color="inherit">Cancel</Button>
          <Button 
            onClick={handleBroadcast} 
            variant="contained" 
            startIcon={<Send />}
            sx={{ bgcolor: "var(--clr-primary)", fontWeight: 700 }}
          >
            {editingId ? "Update" : "Broadcast Now"}
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

export default AdminAnnouncements;
