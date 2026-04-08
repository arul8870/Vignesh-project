import React from "react";
import { Box, Typography, Chip, Button, Paper, Stack, IconButton } from "@mui/material";
import { Storefront, AccessTime, Paid, BookmarkBorder } from "@mui/icons-material";

const JobOpportunityCard = ({ job }) => {
  return (
    <Paper
      elevation={0}
      className="grid-common"
      sx={{
        p: 2.5,
        border: "1px solid var(--clr-silver-v1)",
        "&:hover": { borderColor: "var(--clr-primary)", boxShadow: "0 8px 16px -4px rgba(0,0,0,0.1)" },
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <Box sx={{ display: "flex", gap: 1.5 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              bgcolor: "var(--clr-primary-light)",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--clr-primary)",
            }}
          >
            <Storefront />
          </Box>
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
              {job.title}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {job.employer}
            </Typography>
          </Box>
        </Box>
        <IconButton size="small">
          <BookmarkBorder fontSize="small" />
        </IconButton>
      </Box>

      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
        <Chip
          icon={<AccessTime sx={{ fontSize: "0.9rem !important" }} />}
          label={job.type}
          size="small"
          sx={{ bgcolor: "var(--clr-primary-light)", color: "var(--clr-primary)", fontWeight: 600 }}
        />
        <Chip
          icon={<Paid sx={{ fontSize: "0.9rem !important" }} />}
          label={job.pay}
          size="small"
          variant="outlined"
          sx={{ fontWeight: 600 }}
        />
        <Chip label={job.category} size="small" sx={{ fontWeight: 600 }} />
      </Box>

      <Typography variant="body2" color="text.secondary" sx={{ 
        display: "-webkit-box", 
        WebkitLineClamp: 2, 
        WebkitBoxOrient: "vertical", 
        overflow: "hidden", 
        fontSize: "0.8rem" 
      }}>
        {job.description}
      </Typography>

      <Button
        fullWidth
        variant="outlined"
        size="small"
        sx={{
          color: "var(--clr-primary)",
          borderColor: "var(--clr-primary)",
          textTransform: "none",
          fontWeight: 600,
          "&:hover": { bgcolor: "var(--clr-primary-light)" },
        }}
      >
        View Opportunity
      </Button>
    </Paper>
  );
};

export default JobOpportunityCard;
