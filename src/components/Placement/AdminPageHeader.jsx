import React from "react";
import { Box, Typography, Divider } from "@mui/material";

const AdminPageHeader = ({ title, description, action }) => {
  return (
    <Box sx={{ mb: 6 }}>
      <Box 
        sx={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "flex-start",
          mb: 2 
        }}
      >
        <Box>
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: 800, 
              color: "var(--clr-primary)",
              letterSpacing: "-0.5px",
              mb: 1,
              textShadow: "0 0 20px rgba(16, 185, 129, 0.2)"
            }}
          >
            {title}
          </Typography>
          <Typography 
            variant="body1" 
            sx={{ 
              color: "text.secondary",
              maxWidth: "600px",
              fontWeight: 500,
              lineHeight: 1.6
            }}
          >
            {description}
          </Typography>
        </Box>
        {action && (
          <Box sx={{ pt: 1 }}>
            {action}
          </Box>
        )}
      </Box>
      <Divider sx={{ borderBottomWidth: 2, opacity: 0.1, borderColor: "var(--clr-primary)" }} />
    </Box>
  );
};

export default AdminPageHeader;
