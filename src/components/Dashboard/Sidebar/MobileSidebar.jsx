import React, { useState } from "react";
import PropTypes from "prop-types";
import { Link, useLocation } from "react-router-dom";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Typography,
  Box,
  IconButton,
  Badge,
  Divider,
} from "@mui/material";
import {
  Close,
  AccountCircle,
  Logout,
  Sparkles,
} from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import { alpha } from "@mui/material/styles";
import { useSelector } from "react-redux";
import { selectAuthData } from "../../../store/slicers/authSlicer";
import { capitalizeWords } from "../../../utils/string_utils";
import {
  COMPANY_NAME,
  getAdminMenu,
  getStudentMenu,
} from "../../../../src/utils/constants";
import { isAdmin } from "../../../store/slicers/authSlicer";
import { service } from "../../../services/usersService";

const MobileSidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const theme = useTheme();
  const expandedWidth = 300;
  const authData = useSelector(selectAuthData);
  const isUserAdmin = useSelector(isAdmin);
  const user = authData?.user || {};

  // Get icons for the menu
  const menuIcons = {};
  const menuGroups = isUserAdmin ? getAdminMenu(menuIcons) : getStudentMenu(menuIcons);
  const allowedRoutes = authData?.allowedRoutes || [];

  const handleLogout = () => {
    onClose();
    service.logout();
  };

  const isDarkMode = theme.palette.mode === "dark";

  return (
    <Drawer
      variant="temporary"
      open={isOpen}
      onClose={onClose}
      ModalProps={{
        keepMounted: true,
        BackdropProps: {
          sx: {
            backdropFilter: "blur(4px)",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          },
        },
      }}
      sx={{
        "& .MuiDrawer-paper": {
          width: expandedWidth,
          boxSizing: "border-box",
          backgroundColor: isDarkMode 
            ? "linear-gradient(180deg, #0a0a0a 0%, #121212 100%)"
            : "linear-gradient(180deg, #ffffff 0%, #f8f9fa 100%)",
          backgroundImage: isDarkMode 
            ? "linear-gradient(180deg, #0a0a0a 0%, #121212 100%)"
            : "linear-gradient(180deg, #ffffff 0%, #f8f9fa 100%)",
          color: theme.palette.text.primary,
          borderRight: "none",
          boxShadow: isDarkMode 
            ? "10px 0 40px rgba(0,0,0,0.8)" 
            : "10px 0 40px rgba(0,0,0,0.15)",
        },
      }}
    >
      {/* Premium Mobile Header */}
      <Box
        sx={{
          position: "relative",
          p: 3,
          pb: 2,
          background: isDarkMode
            ? "linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(5, 150, 105, 0.08) 100%)"
            : "linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.05) 100%)",
          borderBottom: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
        }}
      >
        {/* Close Button */}
        <IconButton 
          onClick={onClose} 
          size="small"
          sx={{
            position: "absolute",
            top: 16,
            right: 16,
            bgcolor: alpha(theme.palette.text.primary, 0.05),
            "&:hover": {
              bgcolor: alpha(theme.palette.text.primary, 0.1),
            },
          }}
        >
          <Close fontSize="small" />
        </IconButton>

        {/* Logo & Brand */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2.5 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 2,
              background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 12px rgba(16, 185, 129, 0.3)",
            }}
          >
            <Sparkles sx={{ color: "white", fontSize: "1.5rem" }} />
          </Box>
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 800,
              background: "linear-gradient(135deg, #10b981 0%, #34d399 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontSize: "1.25rem",
            }}
          >
            {COMPANY_NAME}
          </Typography>
        </Box>

        {/* User Profile Card */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            p: 2,
            borderRadius: 3,
            bgcolor: alpha(theme.palette.background.paper, 0.6),
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            backdropFilter: "blur(10px)",
          }}
        >
          <Avatar
            sx={{
              width: 48,
              height: 48,
              bgcolor: "transparent",
              background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
              boxShadow: "0 4px 12px rgba(16, 185, 129, 0.3)",
              fontSize: "1.5rem",
              fontWeight: 700,
            }}
          >
            {user.name?.charAt(0).toUpperCase() || user.username?.charAt(0).toUpperCase() || "U"}
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography 
              variant="subtitle1" 
              sx={{ 
                fontWeight: 700,
                mb: 0.25,
              }}
              noWrap
            >
              {capitalizeWords(user.name || user.username || "User")}
            </Typography>
            <Typography 
              variant="caption" 
              sx={{
                px: 1,
                py: 0.25,
                borderRadius: 1,
                bgcolor: alpha(theme.palette.primary.main, 0.15),
                color: theme.palette.primary.main,
                fontWeight: 600,
                display: "inline-block",
              }}
            >
              {user.roles?.[0] || "Student"}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Enhanced Mobile Navigation */}
      <Box sx={{ flexGrow: 1, overflow: "auto", py: 2, px: 1.5 }}>
        {menuGroups.map((group, groupIndex) => (
          <Box key={group.title} sx={{ mb: groupIndex < menuGroups.length - 1 ? 3 : 0 }}>
            {/* Section Header */}
            <Typography
              variant="overline"
              sx={{
                display: "block",
                px: 2,
                pb: 1,
                pt: groupIndex > 0 ? 2 : 0,
                color: theme.palette.text.secondary,
                fontWeight: 700,
                fontSize: "0.7rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              {group.title}
            </Typography>
            
            {/* Menu Items */}
            <List disablePadding>
              {group.items
                .filter((item) => {
                  if (allowedRoutes.length > 0 && !allowedRoutes.includes("*")) {
                    return allowedRoutes.includes(item.path);
                  }
                  return true;
                })
                .map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
                      <ListItemButton
                        component={Link}
                        to={item.path}
                        onClick={onClose}
                        sx={{
                          borderRadius: 2.5,
                          minHeight: "52px",
                          py: 1.25,
                          px: 2,
                          position: "relative",
                          overflow: "hidden",
                          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                          bgcolor: isActive 
                            ? alpha(theme.palette.primary.main, isDarkMode ? 0.2 : 0.12)
                            : "transparent",
                          border: isActive 
                            ? `1.5px solid ${alpha(theme.palette.primary.main, 0.3)}`
                            : `1.5px solid transparent`,
                          "&::before": isActive ? {
                            content: '""',
                            position: "absolute",
                            left: 0,
                            top: "50%",
                            transform: "translateY(-50%)",
                            width: 4,
                            height: "60%",
                            bgcolor: theme.palette.primary.main,
                            borderRadius: "0 4px 4px 0",
                          } : {},
                          "&:hover": {
                            bgcolor: alpha(theme.palette.primary.main, isDarkMode ? 0.12 : 0.06),
                            transform: "translateX(4px)",
                            border: `1.5px solid ${alpha(theme.palette.primary.main, 0.15)}`,
                          },
                          "&.Mui-selected": {
                            bgcolor: alpha(theme.palette.primary.main, isDarkMode ? 0.2 : 0.12),
                            border: `1.5px solid ${alpha(theme.palette.primary.main, 0.3)}`,
                            "&:hover": {
                              bgcolor: alpha(theme.palette.primary.main, isDarkMode ? 0.25 : 0.16),
                            },
                          },
                        }}
                      >
                        <ListItemIcon
                          sx={{
                            minWidth: "40px",
                            mr: 1.5,
                            color: isActive 
                              ? theme.palette.primary.main 
                              : theme.palette.text.secondary,
                            transition: "all 0.3s ease",
                            "& > *": {
                              fontSize: "1.35rem",
                            },
                          }}
                        >
                          {item.title === "Live Tracking" ? (
                            <Badge 
                              color="error" 
                              variant="dot"
                              sx={{
                                "& .MuiBadge-badge": {
                                  right: 2,
                                  top: 2,
                                  border: `2px solid ${theme.palette.background.paper}`,
                                },
                              }}
                            >
                              {item.icon}
                            </Badge>
                          ) : (
                            item.icon
                          )}
                        </ListItemIcon>
                        <ListItemText
                          primary={item.title}
                          primaryTypographyProps={{
                            fontWeight: isActive ? 700 : 600,
                            fontSize: "0.95rem",
                            color: isActive ? theme.palette.primary.main : theme.palette.text.primary,
                          }}
                        />
                      </ListItemButton>
                    </ListItem>
                  );
                })}
            </List>
          </Box>
        ))}
      </Box>

      {/* Premium Footer with Logout */}
      <Box
        sx={{
          p: 2,
          borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          background: isDarkMode
            ? "linear-gradient(0deg, rgba(10,10,10,0.95) 0%, rgba(18,18,18,0.9) 100%)"
            : "linear-gradient(0deg, rgba(255,255,255,0.95) 0%, rgba(248,249,250,0.9) 100%)",
        }}
      >
        <ListItemButton
          onClick={handleLogout}
          sx={{
            borderRadius: 2.5,
            py: 1.5,
            px: 2,
            bgcolor: alpha(theme.palette.error.main, isDarkMode ? 0.1 : 0.06),
            border: `1.5px solid ${alpha(theme.palette.error.main, 0.2)}`,
            transition: "all 0.3s ease",
            "&:hover": {
              bgcolor: alpha(theme.palette.error.main, isDarkMode ? 0.18 : 0.12),
              border: `1.5px solid ${alpha(theme.palette.error.main, 0.35)}`,
              transform: "translateY(-2px)",
              boxShadow: `0 4px 12px ${alpha(theme.palette.error.main, 0.2)}`,
            },
          }}
        >
          <ListItemIcon
            sx={{
              minWidth: "40px",
              mr: 1.5,
              color: theme.palette.error.main,
            }}
          >
            <Logout sx={{ fontSize: "1.35rem" }} />
          </ListItemIcon>
          <ListItemText
            primary="Logout"
            primaryTypographyProps={{
              fontWeight: 700,
              fontSize: "0.95rem",
              color: theme.palette.error.main,
            }}
          />
        </ListItemButton>
        
        {/* App Version */}
        <Typography
          variant="caption"
          sx={{
            display: "block",
            textAlign: "center",
            mt: 1.5,
            color: theme.palette.text.secondary,
            opacity: 0.6,
            fontSize: "0.7rem",
          }}
        >
          v1.0.0 • Made with ❤️
        </Typography>
      </Box>
    </Drawer>
  );
};

MobileSidebar.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default MobileSidebar;
