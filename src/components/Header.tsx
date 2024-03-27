import {
  AppBar,
  Box,
  MenuItem,
  Slide,
  ThemeProvider,
  Toolbar,
  Typography,
  useScrollTrigger,
} from "@mui/material";
import type * as React from "react";
import { NavLink } from "react-router-dom";

import ModeSwitcher from "./ModeSwitcher";
import logo from "../images/logo.svg";
import { darkTheme, paper } from "../theme";

interface Props {
  links: HeaderLink[];
}

interface HeaderLink {
  title: string;
  path: string;
}

function HideOnScroll(props: {
  window?: () => Window;
  children: React.ReactElement;
}) {
  const { children, window } = props;

  const trigger = useScrollTrigger({
    target: window ? window() : undefined,
  });

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

function Header({ links, ...props }: Props) {
  return (
    <ThemeProvider theme={darkTheme}>
      <HideOnScroll {...props}>
        <AppBar
          elevation={0}
          position="sticky"
          sx={{
            bgcolor: paper.dark,
            borderBottom: "solid 1px",
            borderColor: "paper.border",
          }}
        >
          <Toolbar sx={{ height: 72 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                mx: [1, 2],
              }}
            >
              <Box alt="Logo" component="img" src={logo} sx={{ height: 32 }} />
              <Box
                sx={{
                  ml: 2,
                  fontSize: 18,
                  lineHeight: 1,
                  fontWeight: 500,
                  color: "rgba(255,255,255,0.8)",
                  display: ["none", "block"],
                }}
              >
                Gestion du culte
              </Box>
            </Box>

            {links.map((link) => (
              <MenuItem
                component={NavLink}
                key={link.path}
                sx={{ color: "text.secondary", px: [1, 2] }}
                to={link.path}
              >
                <Typography textAlign="center">{link.title}</Typography>
              </MenuItem>
            ))}

            <Box sx={{ ml: "auto" }}>
              <ModeSwitcher />
            </Box>
          </Toolbar>
        </AppBar>
      </HideOnScroll>
    </ThemeProvider>
  );
}

export default Header;
