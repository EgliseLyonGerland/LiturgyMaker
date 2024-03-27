import CloseIcon from "@mui/icons-material/Close";
import { Box, ThemeProvider, useTheme } from "@mui/material";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import copy from "clipboard-copy";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import okaida from "react-syntax-highlighter/dist/esm/styles/prism/okaidia";

import { darkTheme } from "../theme";

interface Props {
  code: string;
  onHide(): void;
}

function Content({ className, code }: { className?: string; code: string }) {
  return (
    <SyntaxHighlighter className={className} language="js" style={okaida}>
      {code}
    </SyntaxHighlighter>
  );
}

function Code({ code, onHide = () => void 0 }: Props) {
  const theme = useTheme();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (copied) {
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    }
  });

  const handleCopy = () => {
    copy(code);
    setCopied(true);
  };

  return createPortal(
    <ThemeProvider theme={darkTheme}>
      <Box
        sx={{
          position: "fixed",
          width: "100%",
          height: "100%",
          top: 0,
          left: 0,
          zIndex: theme.zIndex.appBar + 100,
          display: "flex",
          bgcolor: "background.default",
        }}
      >
        <Box
          sx={{
            padding: theme.spacing(5),
            overflowX: "auto",
            overflowY: "auto",
            position: "relative",
          }}
        >
          <Box
            code={code}
            component={Content}
            sx={{
              margin: "0 !important",
              borderRadius: "0 !important",
              minHeight: "100%",
              paddingTop: "64px !important",
              background: "transparent !important",
            }}
          />
        </Box>
        <Box
          sx={{
            position: "absolute",
            top: theme.spacing(2),
            right: theme.spacing(2),
            display: "flex",
            alignItems: "center",
          }}
        >
          <Box mr={2}>
            <Button
              onClick={handleCopy}
              size="small"
              style={{ width: 250 }}
              variant="contained"
            >
              {copied ? "Copié !" : "Copier dans le presse-papier"}
            </Button>
          </Box>
          <IconButton onClick={onHide} size="large">
            <CloseIcon />
          </IconButton>
        </Box>
      </Box>
    </ThemeProvider>,
    document.body,
  );
}

export default Code;
