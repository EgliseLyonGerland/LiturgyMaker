import React, { useRef, useEffect } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import FontFaceObserver from 'fontfaceobserver';
import forEach from 'lodash/forEach';
import upperFirst from 'lodash/upperFirst';
import { useSelector } from 'react-redux';

import { documentWidth, documentHeight } from '../config/preview';
import { selectAllRecitations } from '../redux/slices/recitations';
import { selectAllSongs } from '../redux/slices/songs';
import type { LiturgyBlock } from '../types';
import { FontFamily } from '../types';
import type { FieldPath, PreviewGenerateFunction } from '../utils/preview';
import generateAnnouncementsPreview from '../utils/previews/announcements';
import generateOpenDoorsPreview from '../utils/previews/openDoors';
import generateReadingPreview from '../utils/previews/reading';
import generateRecitationPreview from '../utils/previews/recitation';
import generateSectionPreview from '../utils/previews/section';
import generateSermonPreview from '../utils/previews/sermon';
import generateSongsPreview from '../utils/previews/songs';

const previews: Record<string, PreviewGenerateFunction<any, any>> = {
  generateAnnouncementsPreview,
  generateReadingPreview,
  generateSectionPreview,
  generateSermonPreview,
  generateSongsPreview,
  generateRecitationPreview,
  generateOpenDoorsPreview,
};

const useStyles = makeStyles(
  {
    root: {
      background: '#DDD',
    },
    canvas: {
      display: 'none',
    },
    image: {
      display: 'block',
      width: '100%',
      backgroundImage: 'url(https://wallpapercave.com/wp/wp2445766.jpg)',
      backgroundSize: 'cover',
      boxShadow: '0 0 20px rgba(0, 0, 0, .1)',
    },
  },
  { name: 'Preview' },
);

const Preview: React.FC<{
  block: LiturgyBlock;
  currentFieldPath: FieldPath;
}> = ({ block, currentFieldPath }) => {
  const classes = useStyles();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const songs = useSelector(selectAllSongs);
  const recitations = useSelector(selectAllRecitations);

  const clean = (ctx: CanvasRenderingContext2D) => {
    ctx.clearRect(0, 0, documentWidth, documentHeight);
  };

  const draw = async () => {
    const canvas = canvasRef.current;

    if (canvas === null) {
      return;
    }

    const ctx = canvas.getContext('2d');

    if (ctx === null) {
      return;
    }

    canvas.width = documentWidth;
    canvas.height = documentHeight;

    if (!block) {
      clean(ctx);
      return;
    }

    const { type } = block;
    const funcName = `generate${upperFirst(type)}Preview`;

    if (!previews[funcName]) {
      clean(ctx);
      return;
    }

    ctx.fillStyle = 'white';

    let data;
    if (type === 'songs') {
      data = songs;
    } else if (type === 'recitation') {
      data = recitations;
    }

    await previews[funcName].apply(this, [ctx, block, currentFieldPath, data]);

    if (imageRef && imageRef.current) {
      imageRef.current.src = canvas.toDataURL('image/png');
    }
  };

  useEffect(() => {
    forEach(FontFamily, (fontFamily) => {
      const font = new FontFaceObserver(fontFamily);
      font.load().then(() => {
        draw();
      });
    });
  });

  useEffect(() => {
    draw();
  });

  return (
    <div className={classes.root}>
      <canvas ref={canvasRef} className={classes.canvas} />
      <img ref={imageRef} className={classes.image} alt="Preview" />
    </div>
  );
};

export default Preview;
