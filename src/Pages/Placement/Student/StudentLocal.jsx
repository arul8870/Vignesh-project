import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Paper,
  Typography,
  TextField,
  InputAdornment,
  Button,
  Chip,
  useMediaQuery,
  Avatar,
  Stack,
  Card,
  CardContent,
  IconButton,
} from "@mui/material";
import {
  Search,
  FilterList,
  Map,
  Storefront,
  LaptopMac,
  LocationOn,
  AttachMoney,
  ArrowForward,
  Business,
} from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import { alpha } from "@mui/material/styles";
import AdminPageHeader from "../../../components/Placement/AdminPageHeader";
import { placementRepository } from "../../../repositories/placementRepository";

const StudentLocal = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));
  const [jobs, setJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    const res = await placementRepository.getJobs();
    if (res.success) setJobs(res.data);
  };

  const filteredJobs = jobs.filter(j => 
    (j.company || j.employer)?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (j.role || j.title)?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTypeIcon = (type) => {
    switch(type) {
      case "Startup": return <LaptopMac />;
      case "Shop": return <Storefront />;
      default: return <Business />;
    }
  };

  const getTypeGradient = (type) => {
    switch(type) {
      case "Startup": return "linear-gradient(135deg, #10b981 0%, #059669 100%)";
      case "Shop": return "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)";
      default: return "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)";
    }
  };

  return (
    <Box sx={{ p: isMobile ? 1.5 : isTablet ? 2 : 4 }}>
      {/* Header */}
      <Paper
        sx={{
          p: isMobile ? 2.5 : 4,
          mb: isMobile ? 2.5 : 4,
          background: "linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(16, 185, 129, 0.1) 100%)",
          border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
          borderRadius: isMobile ? 3 : 4,
        }}
      >
        <Typography
          variant={isMobile ? "h5" : "h4"}
          sx={{
            fontWeight: 800,
            mb: 1,
            background: "linear-gradient(135deg, #3b82f6 0%, #10b981 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Local Opportunities 📍
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: "text.secondary",
            fontSize: isMobile ? "0.875rem" : "1rem",
          }}
        >
          Explore part-time roles, internships, and startup opportunities nearby.
        </Typography>
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
        <Stack
          direction={isMobile ? "column" : "row"}
          spacing={isMobile ? 1.5 : 2}
          alignItems={isMobile ? "stretch" : "center"}
        >
          <TextField
            size="small"
            placeholder="Search by area or shop name..."
            sx={{ flex: 1 }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ color: theme.palette.primary.main }} />
                </InputAdornment>
              ),
              sx: {
                borderRadius: 2,
                bgcolor: alpha(theme.palette.background.default, 0.5),
              },
            }}
          />
          <Button
            variant="outlined"
            startIcon={<FilterList />}
            sx={{
              borderColor: alpha(theme.palette.divider, 0.2),
              color: "text.secondary",
              fontWeight: 700,
              borderRadius: 2,
              px: 3,
              py: isMobile ? 1 : "inherit",
            }}
          >
            Nearby Only
          </Button>
        </Stack>
      </Paper>

      {/* Jobs Grid - Mobile: Single Column Cards */}
      <Grid container spacing={isMobile ? 2 : 3}>
        {filteredJobs.map((job) => (
          <Grid item xs={12} sm={6} lg={4} key={job.id}>
            <Card
              sx={{
                borderRadius: 3,
                bgcolor: alpha(theme.palette.background.paper, 0.6),
                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                overflow: "hidden",
                "&:hover": {
                  transform: "translateY(-6px)",
                  boxShadow: `0 12px 24px ${alpha(theme.palette.primary.main, 0.15)}`,
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.3)}`,
                },
              }}
            >
              {/* Card Header with Gradient */}
              <Box
                sx={{
                  p: isMobile ? 2 : 2.5,
                  pb: isMobile ? 1.5 : 2,
                  background: getTypeGradient(job.type),
                  position: "relative",
                }}
              >
                {/* Decorative Circle */}
                <Box
                  sx={{
                    position: "absolute",
                    top: -20,
                    right: -20,
                    width: 100,
                    height: 100,
                    borderRadius: "50%",
                    background: "rgba(255,255,255,0.15)",
                    filter: "blur(30px)",
                  }}
                />
                
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ position: "relative", zIndex: 1 }}>
                  <Avatar
                    sx={{
                      width: 48,
                      height: 48,
                      bgcolor: "rgba(255,255,255,0.2)",
                      backdropFilter: "blur(10px)",
                    }}
                  >
                    {getTypeIcon(job.type)}
                  </Avatar>
                  <Chip
                    label={job.salary || job.pay || "Negotiable"}
                    size="small"
                    sx={{
                      bgcolor: "rgba(255,255,255,0.25)",
                      color: "white",
                      fontWeight: 800,
                      backdropFilter: "blur(10px)",
                      border: "1px solid rgba(255,255,255,0.3)",
                    }}
                  />
                </Stack>
              </Box>

              {/* Card Content */}
              <CardContent sx={{ p: isMobile ? 2 : 2.5, pt: isMobile ? 1.5 : 2 }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 800,
                    mb: 1,
                    fontSize: isMobile ? "1rem" : "1.25rem",
                  }}
                >
                  {job.role || job.title}
                </Typography>
                
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                  <Business sx={{ fontSize: "1rem", color: "text.secondary" }} />
                  <Typography
                    variant="body2"
                    sx={{
                      color: "text.secondary",
                      fontWeight: 600,
                      fontSize: isMobile ? "0.8125rem" : "0.875rem",
                    }}
                  >
                    {job.company || job.employer}
                  </Typography>
                </Stack>

                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2.5 }}>
                  <LocationOn sx={{ fontSize: "1rem", color: theme.palette.primary.main }} />
                  <Typography
                    variant="body2"
                    sx={{
                      color: "text.secondary",
                      fontWeight: 600,
                      fontSize: isMobile ? "0.8125rem" : "0.875rem",
                    }}
                  >
                    {job.location || "Nearby"}
                  </Typography>
                </Stack>

                <Button
                  fullWidth
                  variant="outlined"
                  endIcon={<ArrowForward />}
                  sx={{
                    borderColor: theme.palette.primary.main,
                    color: theme.palette.primary.main,
                    fontWeight: 700,
                    borderRadius: 2,
                    py: 1.25,
                    transition: "all 0.3s ease",
                    "&:hover": {
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                      transform: "translateX(4px)",
                    },
                  }}
                >
                  View Job Details
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
        
        {filteredJobs.length === 0 && (
          <Grid item xs={12}>
            <Paper
              sx={{
                p: isMobile ? 4 : 6,
                textAlign: "center",
                borderRadius: 3,
                bgcolor: alpha(theme.palette.background.paper, 0.4),
                border: `1px dashed ${alpha(theme.palette.divider, 0.2)}`,
              }}
            >
              <Map
                sx={{
                  fontSize: isMobile ? "3rem" : "4rem",
                  color: "text.secondary",
                  opacity: 0.3,
                  mb: 2,
                }}
              />
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  mb: 1,
                  color: "text.secondary",
                  fontSize: isMobile ? "1rem" : "1.25rem",
                }}
              >
                No opportunities found
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "text.secondary",
                  opacity: 0.7,
                  fontSize: isMobile ? "0.875rem" : "1rem",
                }}
              >
                Try adjusting your search or check back later
              </Typography>
            </Paper>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default StudentLocal;
