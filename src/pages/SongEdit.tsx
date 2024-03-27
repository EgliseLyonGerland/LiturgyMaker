import { yupResolver } from "@hookform/resolvers/yup";
import type { BoxProps } from "@mui/material";
import { Box, Container, Typography } from "@mui/material";
import isString from "lodash/isString";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import BeatLoader from "react-spinners/BeatLoader";
import { InferType } from "yup";

import TextFieldControl from "../components/controls/TextFieldControl";
import LyricsField from "../components/fields/LyricsField";
import SaveButton from "../components/SaveButton";
import { songSchema } from "../config/schemas";
import { fetchSongs, persistSong, selectSongById } from "../redux/slices/songs";
import { useAppDispatch, useAppSelector } from "../redux/store";
import type { SongDocument } from "../types";

function Block({
  header = "",
  children,
  ...props
}: {
  header: string;
} & BoxProps) {
  return (
    <Box
      bgcolor="paper.background.main"
      border="solid 1px"
      borderColor="paper.border"
      borderRadius="4px"
      boxShadow="4px 4px 10px rgba(0,0,0,0.05)"
      {...props}
    >
      {header && (
        <Box
          alignItems="center"
          bgcolor="paper.header"
          borderBottom="solid 1px"
          borderColor="paper.border"
          borderRadius="4px 4px 0 0"
          display="flex"
          height={72}
          px={5}
        >
          {isString(header) ? (
            <Typography variant="h6">{header}</Typography>
          ) : (
            header
          )}
        </Box>
      )}
      <Box p={5} px={8}>
        {children}
      </Box>
    </Box>
  );
}

type FormValues = InferType<typeof songSchema>;

function SongEdit() {
  const params = useParams();
  const navigate = useNavigate();
  const songsStatus = useAppSelector((state) => state.songs.status);
  const song = useAppSelector((state) =>
    selectSongById(state, `${params.songId}`),
  );
  const dispatch = useAppDispatch();
  const [persisting, setPersisting] = useState(false);
  const [persisted, setPersisted] = useState(false);

  const form = useForm<FormValues>({
    mode: "onChange",
    resolver: yupResolver(songSchema),
    defaultValues: {
      lyrics: [{ text: "", type: "verse" }],
    },
  });
  const {
    reset,
    handleSubmit: submitForm,
    formState: { isDirty, isSubmitting },
  } = form;

  const handleSubmit = async (data: FormValues) => {
    setPersisting(true);

    const song = songSchema.cast(data);

    const { payload } = await dispatch(
      persistSong({
        ...song,
        lyrics: song.lyrics.filter((part) => part.text.trim() !== "") || [],
      }),
    );

    setPersisted(true);
    setPersisting(false);

    if (!params.songId) {
      navigate(`/songs/${(payload as SongDocument).id}/edit`, {
        replace: true,
      });
    }
  };

  useEffect(() => {
    if (song) {
      reset({
        ...song,
        lyrics: song.lyrics.length
          ? song.lyrics
          : [{ text: "", type: "verse" }],
      });
    }
  }, [song, reset]);

  useEffect(() => {
    if (songsStatus === "idle") {
      dispatch(fetchSongs());
    }
  }, [dispatch, songsStatus]);

  if (params.songId && !song) {
    return (
      <Box display="flex" justifyContent="center" m={5}>
        <BeatLoader color="#DDD" />
      </Box>
    );
  }

  return (
    <Container maxWidth="md">
      <FormProvider {...form}>
        <Block header="Informations générales">
          <TextFieldControl
            disabled={isSubmitting}
            label="Titre"
            name="title"
          />
          <TextFieldControl disabled={isSubmitting} label="AKA" name="aka" />
          <TextFieldControl
            disabled={isSubmitting}
            helperText="Séparés par une virgule (ex. Paul Baloche, Matt Redman)"
            label="Auteurs"
            name="authors"
          />
          <TextFieldControl
            disabled={isSubmitting}
            label="Position dans le recueil"
            name="number"
            transformOut={(value) => (value === "" ? null : value)}
          />
          <TextFieldControl
            disabled={isSubmitting}
            label="Copyright"
            name="copyright"
          />
          <TextFieldControl
            disabled={isSubmitting}
            label="Traduction"
            name="translation"
          />
          <TextFieldControl
            disabled={isSubmitting}
            helperText="Séparées par une virgule (ex. ARC 123, JEM 456)"
            label="Collections"
            name="collection"
          />
        </Block>
        <Block header="Liens" mt={5}>
          <TextFieldControl
            disabled={isSubmitting}
            helperText="URL vers Google Drive, YouTube, DailyMotion, etc."
            label="Lien de l'aperçu audio"
            name="previewUrl"
          />
        </Block>
        <Block header="Paroles" mt={5}>
          <LyricsField disabled={isSubmitting} name="lyrics" />
        </Block>

        <SaveButton
          dirty={isDirty}
          onClick={submitForm(handleSubmit)}
          onHide={() => setPersisted(false)}
          persisted={persisted}
          persisting={persisting}
        />
      </FormProvider>
    </Container>
  );
}

export default SongEdit;
