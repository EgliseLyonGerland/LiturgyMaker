import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import { useTheme } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import TextField from "@mui/material/TextField";
import type { Auth as FirebaseAuth } from "firebase/auth";
import { sendPasswordResetEmail } from "firebase/auth";
import type { OptionsObject } from "notistack";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";

import ModeSwitcher from "../components/ModeSwitcher";

interface Props {
  firebaseAuth: FirebaseAuth;
}

function isErrorWithMessage(error: unknown): error is { message: string } {
  return (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof (error as Record<string, unknown>).message === "string"
  );
}

const defaultSnackbarOptions: OptionsObject = {
  anchorOrigin: { vertical: "top", horizontal: "center" },
  preventDuplicate: true,
  autoHideDuration: 8000,
};

function Auth({ firebaseAuth }: Props) {
  const theme = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [lostPasswordShown, setLostPasswordShown] = useState(false);
  const [signInWithEmailAndPassword, , , authError] =
    useSignInWithEmailAndPassword(firebaseAuth);
  const { enqueueSnackbar } = useSnackbar();

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    if (email && password) {
      signInWithEmailAndPassword(email, password);
    }
  };

  const handleLostPassword = async (event: FormEvent) => {
    event.preventDefault();

    try {
      await sendPasswordResetEmail(firebaseAuth, email);
    } catch (error) {
      let message = "Impossible d'envoyer l'email de reinitialisation";

      if (isErrorWithMessage(error)) {
        message += ` (${error.message})`;
      }

      enqueueSnackbar(message, { ...defaultSnackbarOptions, variant: "error" });
    }
  };

  useEffect(() => {
    if (authError) {
      enqueueSnackbar(`Impossible de s'authentifier (${authError.message})`, {
        ...defaultSnackbarOptions,
        variant: "error",
      });
    }
  }, [authError, enqueueSnackbar]);

  return (
    <>
      <Box
        sx={{
          position: "fixed",
          width: "100vw",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          transition: theme.transitions.create(["transform", "opacity"]),
          ...(lostPasswordShown
            ? {
                transform: "translateX(-100px)",
                opacity: 0,
                pointerEvents: "none",
              }
            : { transform: "none" }),
        }}
      >
        <form onSubmit={handleSubmit}>
          <Box width={360}>
            <Card
              sx={{
                border: "solid 1px",
                borderRadius: "4px",
                borderColor: "paper.border",
                boxShadow: "4px 4px 10px rgba(0,0,0,0.05)",
              }}
            >
              <CardContent
                sx={{
                  bgcolor: "paper.header",
                  borderBottom: "solid 1px",
                  borderColor: "paper.border",
                  ...theme.typography.h6,
                }}
              >
                Identification
              </CardContent>
              <CardContent sx={{ padding: theme.spacing(2, 3) }}>
                <TextField
                  autoComplete="off"
                  autoFocus
                  fullWidth
                  label="Email"
                  margin="normal"
                  onChange={(event) => {
                    setEmail(event.target.value);
                  }}
                  type="email"
                  value={email}
                  variant="filled"
                />
                <TextField
                  autoComplete="off"
                  fullWidth
                  label="Mot de passe"
                  margin="normal"
                  onChange={(event) => {
                    setPassword(event.target.value);
                  }}
                  type="password"
                  value={password}
                  variant="filled"
                />
              </CardContent>
              <CardContent sx={{ padding: theme.spacing(2, 3) }}>
                <Button color="primary" type="submit" variant="outlined">
                  Valider
                </Button>
              </CardContent>
            </Card>
          </Box>
          <Box sx={{ mt: 4, display: "flex", justifyContent: "right" }}>
            <Button
              color="inherit"
              onClick={() => setLostPasswordShown(true)}
              variant="text"
            >
              Mot de passe perdu <ChevronRight />
            </Button>
          </Box>
        </form>
      </Box>
      <Box
        sx={{
          position: "fixed",
          width: "100vw",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          transition: theme.transitions.create(["transform", "opacity"]),
          ...(lostPasswordShown
            ? { transform: "none" }
            : {
                transform: "translateX(100px)",
                opacity: 0,
                pointerEvents: "none",
              }),
        }}
      >
        <form onSubmit={handleLostPassword}>
          <Box width={360}>
            <Card
              sx={{
                border: "solid 1px",
                borderRadius: "4px",
                borderColor: "paper.border",
                boxShadow: "4px 4px 10px rgba(0,0,0,0.05)",
              }}
            >
              <CardContent
                sx={{
                  bgcolor: "paper.header",
                  borderBottom: "solid 1px",
                  borderColor: "paper.border",
                  ...theme.typography.h6,
                }}
              >
                Mot de passe perdu
              </CardContent>
              <CardContent sx={{ padding: theme.spacing(2, 3) }}>
                <TextField
                  autoComplete="off"
                  autoFocus
                  fullWidth
                  label="Email"
                  margin="normal"
                  onChange={(event) => {
                    setEmail(event.target.value);
                  }}
                  type="email"
                  value={email}
                  variant="filled"
                />
              </CardContent>
              <CardContent sx={{ padding: theme.spacing(2, 3) }}>
                <Button color="primary" type="submit" variant="outlined">
                  Valider
                </Button>
              </CardContent>
            </Card>
          </Box>
          <Box sx={{ mt: 4 }}>
            <Button
              color="inherit"
              onClick={() => setLostPasswordShown(false)}
              variant="text"
            >
              <ChevronLeft /> Retour
            </Button>
          </Box>
        </form>
      </Box>

      <Box sx={{ position: "fixed", top: 32, right: 32 }}>
        <ModeSwitcher />
      </Box>
    </>
  );
}

export default Auth;
