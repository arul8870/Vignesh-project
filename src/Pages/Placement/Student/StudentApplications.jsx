import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  Chip,
  IconButton,
  Tooltip,
  Stack,
  Card,
  CardContent,
  Divider,
  Avatar,
  useMediaQuery,
  Collapse,
  Button,
} from "@mui/material";
import {
  Info,
  Visibility,
  History,
  Business,
  Work,
  CalendarToday,
  ExpandMore,
  ExpandLess,
  CheckCircle,
  Pending,
  Cancel,
  HourglassTop,
} from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import { alpha } from "@mui/material/styles";
import AdminPageHeader from "../../../components/Placement/AdminPageHeader";
import { placementRepository } from "../../../repositories/placementRepository";
import { useSelector } from "react-redux";
import { selectAuthData } from "../../../store/slicers/authSlicer";

const StudentApplications = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));
  const [apps, setApps] = useState([]);
  const [expandedCard, setExpandedCard] = useState(null);
  const authData = useSelector(selectAuthData);
  const studentId = authData?.user?.username;

  useEffect(() => {
    fetchApps();
  }, []);

  const fetchApps = async () => {
    const res = await placementRepository.getApplications();
    if (res.success) {
      const myApps = res.data.filter(app => app.studentId === studentId);
      setApps(myApps);
    }
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case "Selected":
        return {
          color: "#10b981",
          bg: alpha("#10b981", 0.1),
          gradient: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
          icon: <CheckCircle />,
          label: "Selected",
        };
      case "Shortlisted":
        return {
          color: "#f59e0b",
          bg: alpha("#f59e0b", 0.1),
          gradient: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
          icon: <HourglassTop />,
          label: "Shortlisted",
        };
      case "Rejected":
        return {
          color: "#ef4444",
          bg: alpha("#ef4444", 0.1),
          gradient: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
          icon: <Cancel />,
          label: "Rejected",
        };
      default:
        return {
          color: "#3b82f6",
          bg: alpha("#3b82f6", 0.1),
          gradient: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
          icon: <Pending />,
          label: "Applied",
        };
    }
  };

  const handleToggleExpand = (appId) => {
    setExpandedCard(expandedCard === appId ? null : appId);
  };

  return (
    <Box sx={{ p: isMobile ? 1.5 : isTablet ? 2 : 4 }}>
      {/* Header */}
      <Paper
        sx={{
          p: isMobile ? 2.5 : 4,
          mb: isMobile ? 2.5 : 4,
          background: "linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(16, 185, 129, 0.1) 100%)",
          border: `1px solid ${alpha("#f59e0b", 0.2)}`,
          borderRadius: isMobile ? 3 : 4,
        }}
      >
        <Typography
          variant={isMobile ? "h5" : "h4"}
          sx={{
            fontWeight: 800,
            mb: 1,
            background: "linear-gradient(135deg, #f59e0b 0%, #10b981 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          My Applications 🎯
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: "text.secondary",
            fontSize: isMobile ? "0.875rem" : "1rem",
          }}
        >
          Track your recruitment status, interviews, and offer details in real-time.
        </Typography>
      </Paper>

      {/* Applications Cards - Mobile: Vertical Cards */}
      <Stack spacing={isMobile ? 2 : 3}>
        {apps.map((app) => {
          const statusConfig = getStatusConfig(app.status);
          const isExpanded = expandedCard === app.id;
          
          return (
            <Card
              key={app.id}
              sx={{
                borderRadius: 3,
                bgcolor: alpha(theme.palette.background.paper, 0.6),
                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                overflow: "hidden",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: `0 12px 24px ${alpha(theme.palette.primary.main, 0.15)}`,
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.25)}`,
                },
              }}
            >
              {/* Status Bar at Top */}
              <Box
                sx={{
                  height: 4,
                  background: statusConfig.gradient,
                  width: "100%",
                }}
              />

              <CardContent sx={{ p: isMobile ? 2.5 : 3 }}>
                {/* Header Row */}
                <Stack
                  direction={isMobile ? "column" : "row"}
                  justifyContent="space-between"
                  alignItems={isMobile ? "flex-start" : "center"}
                  spacing={isMobile ? 2 : 0}
                  sx={{ mb: 2 }}
                >
                  {/* Company & Role */}
                  <Box sx={{ flex: 1 }}>
                    <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 1 }}>
                      <Avatar
                        sx={{
                          width: 48,
                          height: 48,
                          bgcolor: alpha(theme.palette.primary.main, 0.1),
                        }}
                      >
                        <Business sx={{ color: theme.palette.primary.main }} />
                      </Avatar>
                      <Box>
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 800,
                            mb: 0.25,
                            fontSize: isMobile ? "1rem" : "1.25rem",
                          }}
                        >
                          {app.company}
                        </Typography>
                        <Stack direction="row" alignItems="center" spacing={0.5}>
                          <Work sx={{ fontSize: "0.875rem", color: "text.secondary" }} />
                          <Typography
                            variant="body2"
                            sx={{
                              color: "text.secondary",
                              fontWeight: 600,
                              fontSize: isMobile ? "0.8125rem" : "0.875rem",
                            }}
                          >
                            {app.role}
                          </Typography>
                        </Stack>
                      </Box>
                    </Stack>
                  </Box>

                  {/* Status Chip */}
                  <Chip
                    icon={statusConfig.icon}
                    label={statusConfig.label}
                    size="medium"
                    sx={{
                      bgcolor: statusConfig.bg,
                      color: statusConfig.color,
                      fontWeight: 800,
                      border: `1.5px solid ${alpha(statusConfig.color, 0.3)}`,
                      px: 1,
                      py: 2.5,
                      "& .MuiChip-icon": {
                        color: statusConfig.color,
                      },
                    }}
                  />
                </Stack>

                {/* Details Row */}
                <Stack
                  direction={isMobile ? "column" : "row"}
                  spacing={isMobile ? 1.5 : 3}
                  sx={{ mb: 2 }}
                >
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <CalendarToday sx={{ fontSize: "1rem", color: "text.secondary" }} />
                    <Typography
                      variant="body2"
                      sx={{
                        color: "text.secondary",
                        fontWeight: 600,
                        fontSize: isMobile ? "0.8125rem" : "0.875rem",
                      }}
                    >
                      Applied: {new Date(app.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </Typography>
                  </Stack>
                  {app.package && (
                    <Typography
                      variant="body2"
                      sx={{
                        color: "var(--clr-primary)",
                        fontWeight: 800,
                        fontSize: isMobile ? "0.875rem" : "1rem",
                      }}
                    >
                      💰 {app.package}
                    </Typography>
                  )}
                </Stack>

                {/* Expand Button */}
                <Button
                  fullWidth
                  onClick={() => handleToggleExpand(app.id)}
                  endIcon={isExpanded ? <ExpandLess /> : <ExpandMore />}
                  sx={{
                    color: theme.palette.primary.main,
                    fontWeight: 700,
                    borderRadius: 2,
                    py: 1,
                    transition: "all 0.3s ease",
                    "&:hover": {
                      bgcolor: alpha(theme.palette.primary.main, 0.05),
                    },
                  }}
                >
                  {isExpanded ? "Hide Details" : "View Details"}
                </Button>

                {/* Expanded Content */}
                <Collapse in={isExpanded}>
                  <Divider sx={{ my: 2, opacity: 0.1 }} />
                  <Box sx={{ pt: 1 }}>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        fontWeight: 700,
                        mb: 1.5,
                        color: "text.secondary",
                        fontSize: isMobile ? "0.8125rem" : "0.875rem",
                      }}
                    >
                      Application Timeline
                    </Typography>
                    <Stack spacing={2}>
                      <Box sx={{ display: "flex", gap: 2 }}>
                        <Avatar
                          sx={{
                            width: 32,
                            height: 32,
                            bgcolor: alpha("#3b82f6", 0.1),
                          }}
                        >
                          <CalendarToday sx={{ fontSize: "0.875rem", color: "#3b82f6" }} />
                        </Avatar>
                        <Box>
                          <Typography
                            variant="body2"
                            fontWeight={700}
                            sx={{ fontSize: isMobile ? "0.875rem" : "1rem" }}
                          >
                            Application Submitted
                          </Typography>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ fontSize: isMobile ? "0.75rem" : "0.8125rem" }}
                          >
                            {new Date(app.date).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </Typography>
                        </Box>
                      </Box>
                      
                      {(app.status === "Shortlisted" || app.status === "Interview" || app.status === "Selected") && (
                        <Box sx={{ display: "flex", gap: 2 }}>
                          <Avatar
                            sx={{
                              width: 32,
                              height: 32,
                              bgcolor: alpha("#f59e0b", 0.1),
                            }}
                          >
                            <HourglassTop sx={{ fontSize: "0.875rem", color: "#f59e0b" }} />
                          </Avatar>
                          <Box>
                            <Typography
                              variant="body2"
                              fontWeight={700}
                              sx={{ fontSize: isMobile ? "0.875rem" : "1rem" }}
                            >
                              Shortlisted
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              sx={{ fontSize: isMobile ? "0.75rem" : "0.8125rem" }}
                            >
                              Your profile matched the requirements
                            </Typography>
                          </Box>
                        </Box>
                      )}

                      {app.status === "Selected" && (
                        <Box sx={{ display: "flex", gap: 2 }}>
                          <Avatar
                            sx={{
                              width: 32,
                              height: 32,
                              bgcolor: alpha("#10b981", 0.1),
                            }}
                          >
                            <CheckCircle sx={{ fontSize: "0.875rem", color: "#10b981" }} />
                          </Avatar>
                          <Box>
                            <Typography
                              variant="body2"
                              fontWeight={700}
                              sx={{
                                fontSize: isMobile ? "0.875rem" : "1rem",
                                color: "#10b981",
                              }}
                            >
                              Offer Received! 🎉
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              sx={{ fontSize: isMobile ? "0.75rem" : "0.8125rem" }}
                            >
                              Congratulations on your selection
                            </Typography>
                          </Box>
                        </Box>
                      )}

                      {app.status === "Rejected" && (
                        <Box sx={{ display: "flex", gap: 2 }}>
                          <Avatar
                            sx={{
                              width: 32,
                              height: 32,
                              bgcolor: alpha("#ef4444", 0.1),
                            }}
                          >
                            <Cancel sx={{ fontSize: "0.875rem", color: "#ef4444" }} />
                          </Avatar>
                          <Box>
                            <Typography
                              variant="body2"
                              fontWeight={700}
                              sx={{ fontSize: isMobile ? "0.875rem" : "1rem" }}
                            >
                              Application Rejected
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              sx={{ fontSize: isMobile ? "0.75rem" : "0.8125rem" }}
                            >
                              Don't worry, keep applying to other opportunities
                            </Typography>
                          </Box>
                        </Box>
                      )}
                    </Stack>
                  </Box>
                </Collapse>
              </CardContent>
            </Card>
          );
        })}

        {/* Empty State */}
        {apps.length === 0 && (
          <Paper
            sx={{
              p: isMobile ? 5 : 8,
              textAlign: "center",
              borderRadius: 3,
              bgcolor: alpha(theme.palette.background.paper, 0.4),
              border: `1px dashed ${alpha(theme.palette.divider, 0.2)}`,
            }}
          >
            <History
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
              No applications yet
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: "text.secondary",
                opacity: 0.7,
                fontSize: isMobile ? "0.875rem" : "1rem",
              }}
            >
              You haven't applied to any drives yet. Start exploring opportunities!
            </Typography>
          </Paper>
        )}
      </Stack>
    </Box>
  );
};

export default StudentApplications;
