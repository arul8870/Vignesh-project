import { useLocation } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  styled,
  alpha,
  Breadcrumbs,
  Link,
  useMediaQuery,
} from "@mui/material";
import {
  LightMode as LightModeIcon,
  DarkMode as DarkModeIcon,
  Home as HomeIcon,
  Menu as MenuIcon,
  CalendarToday as CalendarIcon,
} from "@mui/icons-material";
import { useSelector, useDispatch } from "react-redux";
import { toggleTheme } from "../../../store/slicers/themeSlice";
import { useSidebar } from "../../../CustomHooks/useSidebar";
import { formatDate, getNowStr } from "../../../utils/time_utils";
import { date_formats } from "../../../utils/constants";

const IconWrapper = styled(IconButton)(({ theme }) => ({
  backgroundColor: alpha(theme.palette.common.white, 0.08),
  border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
  borderRadius: 12,
  padding: theme.spacing(0.875),
  marginLeft: theme.spacing(0.75),
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    transform: "scale(1.05)",
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
  },
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(0.75),
    marginLeft: theme.spacing(0.5),
    borderRadius: 10,
  },
}));

const DateBox = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0.75, 1.25),
  borderRadius: 12,
  border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
  backgroundColor: alpha(theme.palette.common.white, 0.06),
  backdropFilter: "blur(10px)",
  fontSize: "0.875rem",
  fontWeight: 600,
  whiteSpace: "nowrap",
  transition: "all 0.3s ease",
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.1),
  },
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(0.5, 1),
    fontSize: "0.75rem",
    borderRadius: 10,
  },
}));

const MenuButton = styled(IconButton)(({ theme }) => ({
  background: "linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(5, 150, 105, 0.1) 100%)",
  border: `1.5px solid ${alpha(theme.palette.primary.main, 0.3)}`,
  borderRadius: 12,
  padding: theme.spacing(0.75),
  marginRight: theme.spacing(1),
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  "&:hover": {
    background: "linear-gradient(135deg, rgba(16, 185, 129, 0.25) 0%, rgba(5, 150, 105, 0.18) 100%)",
    transform: "scale(1.08)",
    boxShadow: `0 4px 16px ${alpha(theme.palette.primary.main, 0.3)}`,
    border: `1.5px solid ${alpha(theme.palette.primary.main, 0.5)}`,
  },
  "&:active": {
    transform: "scale(0.95)",
  },
}));

const ContentTop = () => {
  const theme = useTheme();
  const location = useLocation();
  const darkMode = useSelector((state) => state.theme.darkMode);
  const dispatch = useDispatch();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { toggleSidebar, toggleMobile } = useSidebar();

  const handleMenuClick = () => {
    if (isMobile) {
      toggleMobile();
    } else {
      toggleSidebar();
    }
  };

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === "/" || path === "") return "Home";
    return path
      .split("/")
      .filter(Boolean)
      .map(segment => segment.charAt(0).toUpperCase() + segment.slice(1))
      .join(" / ");
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backgroundColor: darkMode 
          ? alpha("#0a0a0a", 0.95) 
          : alpha("#ffffff", 0.95),
        backdropFilter: "blur(20px)",
        color: theme.palette.text.primary,
        borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        px: isMobile ? 1.5 : 3,
        py: 0,
        backgroundImage: "none",
        width: "100%",
        transition: "all 0.3s ease",
      }}
    >
      <Toolbar
        disableGutters
        sx={{
          minHeight: isMobile ? 56 : 64,
          justifyContent: "space-between",
          gap: isMobile ? 1 : 2,
        }}
      >
        {/* Left side: Menu icon and breadcrumbs */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flexGrow: 1,
            minWidth: 0,
          }}
        >
          {isMobile && (
            <MenuButton
              edge="start"
              onClick={handleMenuClick}
              aria-label="menu"
              sx={{ flexShrink: 0 }}
            >
              <MenuIcon sx={{ color: theme.palette.primary.main, fontSize: "1.35rem" }} />
            </MenuButton>
          )}

          <Breadcrumbs
            aria-label="breadcrumb"
            separator="›"
            sx={{ 
              color: theme.palette.text.secondary,
              "& .MuiBreadcrumbs-separator": {
                mx: isMobile ? 0.5 : 0.75,
              },
            }}
          >
            <Link
              underline="hover"
              color="inherit"
              href="#"
              sx={{ 
                display: "flex", 
                alignItems: "center",
                transition: "all 0.2s ease",
                "&:hover": {
                  color: theme.palette.primary.main,
                },
              }}
            >
              <HomeIcon sx={{ mr: isMobile ? 0.4 : 0.5 }} fontSize="inherit" />
              <Typography
                component="span"
                sx={{ 
                  fontSize: isMobile ? "0.8125rem" : "0.875rem",
                  fontWeight: 600,
                }}
              >
                Home
              </Typography>
            </Link>
            <Typography
              color="text.primary"
              sx={{ 
                fontWeight: 700,
                fontSize: isMobile ? "0.8125rem" : "0.875rem",
              }}
              noWrap
            >
              {getPageTitle()}
            </Typography>
          </Breadcrumbs>
        </Box>

        {/* Right side: Date and theme toggle */}
        <Box 
          sx={{ 
            display: "flex", 
            alignItems: "center", 
            flexShrink: 0,
            gap: isMobile ? 0.5 : 1,
          }}
        >
          {!isMobile && (
            <DateBox>
              <CalendarIcon
                sx={{
                  mr: 0.75,
                  fontSize: "1.125rem",
                  color: theme.palette.primary.main,
                }}
              />
              <Typography
                sx={{
                  fontWeight: 600,
                  fontSize: "0.8125rem",
                }}
              >
                {formatDate(new Date(), date_formats.DD_MMM_YYYY)}
              </Typography>
            </DateBox>
          )}

          <IconWrapper 
            onClick={() => dispatch(toggleTheme())}
            aria-label="toggle theme"
          >
            {darkMode ? (
              <LightModeIcon 
                fontSize="small" 
                sx={{ 
                  color: "#fbbf24",
                  transition: "transform 0.3s ease",
                }} 
              />
            ) : (
              <DarkModeIcon 
                fontSize="small" 
                sx={{ 
                  color: "#60a5fa",
                  transition: "transform 0.3s ease",
                }} 
              />
            )}
          </IconWrapper>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default ContentTop;
