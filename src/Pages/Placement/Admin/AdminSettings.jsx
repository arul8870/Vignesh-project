import React from "react";
import { Box, Grid, Paper, Typography, TextField, Button, Stack, Divider, Switch, FormControlLabel } from "@mui/material";
import { Save, Lock, NotificationsActive, Shield } from "@mui/icons-material";
import AdminPageHeader from "../../../components/Placement/AdminPageHeader";

const AdminSettings = () => {
  return (
    <Box sx={{ p: 4 }}>
      <AdminPageHeader 
        title="Control Settings 🏛️" 
        description="Configure institutional placement parameters, update administrative credentials, and manage system-wide notifications."
      />

      <Grid container spacing={4}>
        {/* Profile & Security */}
        <Grid item xs={12} lg={7}>
          <Paper className="grid-common" sx={{ p: 4 }}>
            <Typography variant="h6" sx={{ mb: 4, fontWeight: 700, display: "flex", alignItems: "center", gap: 1 }}>
              <Shield color="primary" /> Administrative Profile
            </Typography>
            <Stack spacing={4}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField fullWidth label="Full Name" defaultValue="Admin User" />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField fullWidth label="Designation" defaultValue="Placement Director" />
                </Grid>
                <Grid item xs={12}>
                  <TextField fullWidth label="Email Address" defaultValue="admin@HICAS.edu" />
                </Grid>
              </Grid>
              
              <Divider />
              
              <Typography variant="subtitle1" sx={{ fontWeight: 700, display: "flex", alignItems: "center", gap: 1 }}>
                <Lock fontSize="small" color="primary" /> Security Update
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField fullWidth type="password" label="Current Password" />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField fullWidth type="password" label="New Password" />
                </Grid>
              </Grid>

              <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                <Button variant="contained" startIcon={<Save />} sx={{ bgcolor: "var(--clr-primary)", px: 4, fontWeight: 700 }}>
                  Save All Changes
                </Button>
              </Box>
            </Stack>
          </Paper>
        </Grid>

        {/* System Preferences */}
        <Grid item xs={12} lg={5}>
          <Paper className="grid-common" sx={{ p: 4 }}>
            <Typography variant="h6" sx={{ mb: 4, fontWeight: 700, display: "flex", alignItems: "center", gap: 1 }}>
              <NotificationsActive color="primary" /> System Preferences
            </Typography>
            <Stack spacing={3}>
              <Box sx={{ p: 2, borderRadius: 2, bgcolor: "rgba(255,255,255,0.02)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Box>
                  <Typography variant="body1" fontWeight={600}>Email Notifications</Typography>
                  <Typography variant="caption" color="text.secondary">Notify students on new drive posting</Typography>
                </Box>
                <Switch defaultChecked color="primary" />
              </Box>

              <Box sx={{ p: 2, borderRadius: 2, bgcolor: "rgba(255,255,255,0.02)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Box>
                  <Typography variant="body1" fontWeight={600}>Auto-Export Data</Typography>
                  <Typography variant="caption" color="text.secondary">Export placement statistics weekly</Typography>
                </Box>
                <Switch color="primary" />
              </Box>

              <Box sx={{ p: 2, borderRadius: 2, bgcolor: "rgba(255,255,255,0.02)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Box>
                  <Typography variant="body1" fontWeight={600}>Student Registration</Typography>
                  <Typography variant="caption" color="text.secondary">Allow new student profile creation</Typography>
                </Box>
                <Switch defaultChecked color="primary" />
              </Box>
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminSettings;
