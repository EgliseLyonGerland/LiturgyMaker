import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import _ from "lodash";
import uuid from "uuid/v1";

import AnnouncementsBlock from "./blocks/AnnouncementsBlock";
import SongsBlock from "./blocks/SongsBlock";

const useStyles = makeStyles(theme => ({
  root: {
    marginBottom: theme.spacing(6)
  },
  divider: {
    margin: theme.spacing(4, 0),
    height: 1,
    backgroundImage:
      "linear-gradient(to right, #DDD 40%, rgba(255,255,255,0) 0%)",
    backgroundPosition: "bottom",
    backgroundSize: [[15, 1]],
    backgroundRepeat: "repeat-x"
  }
}));

const defaultBlocks = [
  {
    id: uuid(),
    type: "announcements",
    value: [
      {
        title: "Dimanche 8 septembre",
        detail: "Culte à 10h au théâtre « Lulu sur la colline »"
      },
      {
        title: "Groupes de maison",
        detail: "Reprise la semaine du 16 septembre"
      },
      {
        title: "Retraite de rentrée au Chatelard",
        detail:
          "Samedi 14 septembre, accueil/café à 9h30.\nPlus d’info sur http://www.chatelard-sj.org"
      },
      {
        title: "Groupe d’ados",
        detail: "Dimanche 22 septembre à 12h30"
      }
    ]
  },
  {
    id: uuid(),
    type: "songs",
    value: [{ title: "Nous t'adorons, ô père (107)" }]
  }
];

const components = {
  AnnouncementsBlock,
  SongsBlock
};

export default ({ firebase }) => {
  const classes = useStyles();
  const [blocks, setBlocks] = useState(defaultBlocks);

  const renderBlock = (block, index) => {
    const Component = components[`${_.capitalize(block.type)}Block`];

    return (
      <Component
        block={block}
        onChange={value => {
          blocks[index].value = value;
          setBlocks([...blocks]);
        }}
      />
    );
  };

  const renderDivider = () => {
    return <div className={classes.divider} />;
  };

  return (
    <div>
      {blocks.map((block, index) => (
        <div key={block.id}>
          {renderBlock(block, index)}
          {index + 1 < blocks.length && renderDivider()}
        </div>
      ))}
    </div>
  );
};
