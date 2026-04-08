import { Outlet } from "react-router-dom";
import { Box, useMediaQuery } from "@mui/material";
import ContentTop from "./DashboardHeader";
import { useSelector } from "react-redux";
import { useTheme } from "@emotion/react";

const MainPanel = () => {
  const darkMode = useSelector((state) => state.theme.darkMode);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Box
      component="main"
      sx={{
        flex: 1,
        backgroundColor: darkMode
          ? theme.palette.background.default
          : "#f8f9fa",
        py: 0,
        pb: isMobile ? 3 : 5,
        px: 0,
        display: "flex",
        flexDirection: "column",
        gap: isMobile ? 2 : 5,
        height: "100vh",
        overflow: "auto",
        WebkitOverflowScrolling: "touch", // Smooth scrolling on iOS
        "@media (max-width: 1400px)": {
          px: 5,
        },
        "@media (max-width: 1200px)": {
          px: 4,
        },
        "@media (max-width: 768px)": {
          px: 0,
        },
      }}
    >
      <ContentTop />
      <Box
        sx={{
          flex: 1,
          px: isMobile ? 1.5 : isTablet ? 2 : 3,
          pt: isMobile ? 1.5 : 2,
          pb: isMobile ? 2 : 3,
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default MainPanel;
