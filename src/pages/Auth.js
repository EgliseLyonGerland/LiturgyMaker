import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles(theme => ({
  root: {
    width: "100vw",
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },
  box: { width: 360 },
  header: {
    background: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    ...theme.typography.h6
  },
  content: {
    padding: theme.spacing(2, 3)
  }
}));

export default ({ onSubmit = () => {} }) => {
  const classes = useStyles();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className={classes.root}>
      <Card className={classes.box}>
        <CardContent className={classes.header}>Identification</CardContent>
        <CardContent className={classes.content}>
          <TextField
            label="Email"
            type="email"
            margin="normal"
            variant="filled"
            autoComplete="off"
            value={email}
            onChange={event => {
              setEmail(event.target.value);
            }}
            autoFocus
            fullWidth
          />
          <TextField
            label="Mot de passe"
            type="password"
            margin="normal"
            variant="filled"
            autoComplete="off"
            value={password}
            onChange={event => {
              setPassword(event.target.value);
            }}
            fullWidth
          />
        </CardContent>
        <CardContent className={classes.content}>
          <Button
            color="primary"
            variant="outlined"
            onClick={() => onSubmit(email, password)}
          >
            Valider
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
