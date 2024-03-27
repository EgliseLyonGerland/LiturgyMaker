import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import BeatLoader from "react-spinners/BeatLoader";

import RevealContainer from "../components/RevealContainer";
import SectionSlides from "../components/slides/SectionSlides";
import SongsSlides from "../components/slides/SongsSlides";
import { Message } from "../libs/SlideshowWindowManager";
import type { LiturgyBlock, LiturgyDocument, SongDocument } from "../types";

function Slideshow() {
  const [data, setData] = useState<LiturgyDocument | null>(null);
  const [songs, setSongs] = useState<SongDocument[] | null>(null);

  useEffect(() => {
    window.opener.postMessage({ namespace: "reveal", method: "ready" }, "*");
  }, []);

  useEffect(() => {
    const handleMessage = (event: MessageEvent<Message>) => {
      if (event.data.namespace !== "reveal") {
        return;
      }

      switch (event.data.method) {
        case "updateLiturgy":
          setData(event.data.args[0]);
          break;
        case "updateSongs":
          setSongs(event.data.args[0]);
          break;
        default:
      }
    };

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  if (!data) {
    return (
      <Box
        alignItems="center"
        display="flex"
        height="100vh"
        justifyContent="center"
        width="100vw"
      >
        <BeatLoader color="#DDD" />
      </Box>
    );
  }

  const renderSlides = (block: LiturgyBlock) => {
    switch (block.type) {
      case "section":
        return <SectionSlides data={block.data} />;
      case "songs":
        return <SongsSlides data={block.data} songs={songs || []} />;
      default:
        return null;
    }
  };

  return (
    <RevealContainer>
      <>
        {data.blocks.reduce<JSX.Element[]>((acc, block) => {
          const slides = renderSlides(block);

          if (slides === null) {
            return acc;
          }

          const result = acc.concat(slides);
          return result;
        }, [])}
      </>
    </RevealContainer>
  );
}

export default Slideshow;
