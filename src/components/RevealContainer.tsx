import { Box } from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import Reveal from "reveal.js";

interface Props extends Reveal.Options {
  children: JSX.Element;
  currentSlide?: number;
  onCountChanged?: (count: number) => void;
}

function RevealContainer({
  children,
  onCountChanged,
  currentSlide,
  embedded,
  ...revealProps
}: Props) {
  const [ready, setReady] = useState(false);
  const deckRef = useRef<Reveal.Api>();

  const wrapperRef = useCallback(
    (node: HTMLDivElement) => {
      if (node === null || ready) {
        return;
      }

      deckRef.current = new Reveal(node, {
        width: 1920,
        height: 1080,
        controls: false,
        progress: false,
        transition: "none",
        margin: 0,
        minScale: 0,
        maxScale: 1.0,
        embedded,
        ...revealProps,
      });

      deckRef.current?.initialize().then(() => {
        setReady(true);

        if (deckRef.current && onCountChanged) {
          onCountChanged(deckRef.current.getTotalSlides());
        }
      });
    },
    [embedded, onCountChanged, ready, revealProps],
  );

  useEffect(() => {
    if (ready && currentSlide) {
      deckRef.current?.slide(currentSlide);
    }
  }, [currentSlide, ready]);

  return (
    <Box
      className={`reveal${embedded ? " embedded" : ""}`}
      data-embedded
      ref={wrapperRef}
      sx={{
        position: "relative",
        bgcolor: "#02010133",
      }}
    >
      <Box sx={{ paddingBottom: "52.25%" }} />
      <Box
        className="slides"
        sx={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
      >
        {children}
      </Box>
    </Box>
  );
}

export default RevealContainer;
