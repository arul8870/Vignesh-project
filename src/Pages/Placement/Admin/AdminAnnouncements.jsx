import React, { useState, useEffect } from "react";
import { Box, Grid, Paper, Typography, TextField, Button, Avatar, Stack, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Alert, Snackbar, useMediaQuery, Card, CardContent } from "@mui/material";
import { Campaign, Send, Person, AccessTime, Edit, Delete } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import { alpha } from "@mui/material/styles";
import AdminPageHeader from "../../../components/Placement/AdminPageHeader";
import { placementRepository } from "../../../repositories/placementRepository";

const AdminAnnouncements = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));
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
    <Box sx={{ p: isMobile ? 1.5 : isTablet ? 2 : 4 }}>
      {/* Header */}
      <Paper
        sx={{
          p: isMobile ? 2.5 : 4,
          mb: isMobile ? 2.5 : 4,
          background: "linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(245, 158, 11, 0.1) 100%)",
          border: `1px solid ${alpha("#ef4444", 0.2)}`,
          borderRadius: isMobile ? 3 : 4,
        }}
      >
        <Typography
          variant={isMobile ? "h5" : "h4"}
          sx={{
            fontWeight: 800,
            mb: 1,
            background: "linear-gradient(135deg, #ef4444 0%, #f59e0b 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Broadcast Center 📣
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: "text.secondary",
            fontSize: isMobile ? "0.875rem" : "1rem",
          }}
        >
          Communicate campus-wide updates and institutional news.
        </Typography>
      </Paper>

      <Grid container spacing={isMobile ? 2 : 3}>
        {/* Create Announcement Section */}
        <Grid item xs={12} lg={4}>
          <Card
            sx={{
              borderRadius: 3,
              bgcolor: alpha(theme.palette.background.paper, 0.6),
              border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            }}
          >
            <CardContent sx={{ p: isMobile ? 2.5 : 4 }}>
              <Typography
                variant="h6"
                sx={{
                  mb: isMobile ? 2 : 3,
                  fontWeight: 700,
                  fontSize: isMobile ? "1rem" : "1.25rem",
                }}
              >
                Compose Announcement
              </Typography>
              <Button 
                variant="outlined" 
                onClick={() => handleOpen()}
                fullWidth
                sx={{
                  borderColor: "var(--clr-primary)",
                  color: "var(--clr-primary)",
                  fontWeight: 700,
                  py: 1.5,
                  borderRadius: 2,
                }}
              >
                Create New Announcement
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Existing Announcements Feed */}
        <Grid item xs={12} lg={8}>
          <Stack spacing={isMobile ? 2 : 3}>
            {announcements.map((item) => (
              <Card
                key={item.id}
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
                <CardContent sx={{ p: isMobile ? 2.5 : 4 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                    <Box sx={{ display: "flex", gap: 2, alignItems: "center", flex: 1 }}>
                      <Avatar
                        sx={{
                          bgcolor: alpha("#10b981", 0.1),
                          color: "var(--clr-primary)",
                          width: isMobile ? 40 : 48,
                          height: isMobile ? 40 : 48,
                        }}
                      >
                        <Campaign />
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 800,
                            mb: 0.5,
                            fontSize: isMobile ? "0.9375rem" : "1.25rem",
                          }}
                        >
                          {item.title}
                        </Typography>
                        <Box sx={{ display: "flex", gap: 2, alignItems: "center", flexWrap: "wrap" }}>
                          <Typography
                            variant="caption"
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 0.5,
                              color: "text.secondary",
                              fontSize: isMobile ? "0.6875rem" : "0.75rem",
                            }}
                          >
                            <Person sx={{ fontSize: "0.875rem" }} /> {item.author}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 0.5,
                              color: "text.secondary",
                              fontSize: isMobile ? "0.6875rem" : "0.75rem",
                            }}
                          >
                            <AccessTime sx={{ fontSize: "0.875rem" }} /> {new Date(item.date).toLocaleDateString()}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                    <Box sx={{ display: "flex", gap: 0.5 }}>
                      <IconButton
                        size="small"
                        onClick={() => handleOpen(item)}
                        sx={{
                          color: "text.secondary",
                          "&:hover": { color: "var(--clr-primary)", bgcolor: alpha("#10b981", 0.1) },
                        }}
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(item.id)}
                        sx={{
                          color: "text.secondary",
                          "&:hover": { color: "error.main", bgcolor: alpha("#ef4444", 0.1) },
                        }}
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "text.primary",
                      lineHeight: 1.7,
                      fontSize: isMobile ? "0.875rem" : "1rem",
                    }}
                  >
                    {item.content}
                  </Typography>
                </CardContent>
              </Card>
            ))}
            {announcements.length === 0 && (
              <Paper
                sx={{
                  p: isMobile ? 4 : 6,
                  textAlign: "center",
                  borderRadius: 3,
                  bgcolor: alpha(theme.palette.background.paper, 0.4),
                  border: `1px dashed ${alpha(theme.palette.divider, 0.2)}`,
                }}
              >
                <Campaign sx={{ fontSize: isMobile ? "2.5rem" : "3rem", color: "text.secondary", opacity: 0.3, mb: 2 }} />
                <Typography
                  variant="h6"
                  fontWeight={700}
                  color="text.secondary"
                  sx={{ mb: 1, fontSize: isMobile ? "1rem" : "1.25rem" }}
                >
                  No announcements yet
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ opacity: 0.7 }}>
                  Create your first announcement to get started
                </Typography>
              </Paper>
            )}
          </Stack>
        </Grid>
      </Grid>

      {/* Add/Edit Announcement Dialog */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
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
