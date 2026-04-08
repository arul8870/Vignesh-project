import React, { useState, useEffect } from "react";
import { Box, Paper, Typography, Avatar, Stack, Chip } from "@mui/material";
import { Campaign, AccessTime, Person, PriorityHigh } from "@mui/icons-material";
import AdminPageHeader from "../../../components/Placement/AdminPageHeader";
import { placementRepository } from "../../../repositories/placementRepository";

const StudentNotifications = () => {
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    const res = await placementRepository.getAnnouncements();
    if (res.success) setAnnouncements(res.data);
  };

  return (
    <Box sx={{ p: 4, maxWidth: "900px" }}>
      <AdminPageHeader 
        title="Institutional Broadcasts 📣" 
        description="Stay updated with real-time drive announcements, results, and critical campus recruitment reminders."
      />

      <Stack spacing={3}>
        {announcements.map((item) => (
          <Paper key={item.id} className="glass-card" sx={{ p: 4 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
              <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                <Avatar sx={{ bgcolor: "rgba(16, 185, 129, 0.1)", color: "var(--clr-primary)" }}><Campaign /></Avatar>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 800 }}>{item.title}</Typography>
                  <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                    <Typography variant="caption" sx={{ display: "flex", alignItems: "center", gap: 0.5, color: "text.secondary" }}>
                      <Person sx={{ fontSize: "1rem" }} /> {item.author || "Placement Cell"}
                    </Typography>
                    <Typography variant="caption" sx={{ display: "flex", alignItems: "center", gap: 0.5, color: "text.secondary" }}>
                      <AccessTime sx={{ fontSize: "1rem" }} /> {new Date(item.date).toLocaleDateString()}
                    </Typography>
                  </Box>
                </Box>
              </Box>
              {item.type === "Urgent" && (
                <Chip 
                  icon={<PriorityHigh sx={{ fontSize: "0.8rem !important" }} />} 
                  label="Urgent" 
                  size="small" 
                  color="error" 
                  sx={{ fontWeight: 800, borderRadius: "6px" }} 
                />
              )}
            </Box>
            <Typography variant="body1" sx={{ color: "text.primary", lineHeight: 1.7 }}>
              {item.content}
            </Typography>
          </Paper>
        ))}
        {announcements.length === 0 && (
          <Box sx={{ py: 10, textAlign: "center", border: "2px dashed rgba(255,255,255,0.05)", borderRadius: 4 }}>
            <Typography color="text.secondary">No institutional broadcasts found.</Typography>
          </Box>
        )}
      </Stack>
    </Box>
  );
};

export default StudentNotifications;
