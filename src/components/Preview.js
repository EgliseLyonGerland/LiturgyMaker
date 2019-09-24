import React, { useRef, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import capitalize from 'lodash/capitalize';
import * as preview from '../utils/preview';
import { documentWidth, documentHeight } from '../config/preview';

const useStyles = makeStyles(
  theme => ({
    root: {
      background: '#DDD',
    },
    canvas: {
      width: '100%',
      backgroundImage: 'url(https://wallpapercave.com/wp/wp2445766.jpg)',
      backgroundSize: 'cover',
    },
  }),
  { name: 'Preview' },
);

export default ({ block, currentFieldPath }) => {
  const classes = useStyles();
  const canvasRef = useRef(null);

  const clean = ctx => {
    ctx.clearRect(0, 0, documentWidth, documentHeight);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    canvas.width = documentWidth;
    canvas.height = documentHeight;

    if (!block) {
      clean(ctx);
      return;
    }

    const { type } = block;
    const funcName = `generate${capitalize(type)}Preview`;

    if (!preview[funcName]) {
      clean(ctx);
      return;
    }

    ctx.fillStyle = 'white';

    preview[funcName](ctx, block, currentFieldPath);
  });

  return (
    <div className={classes.root}>
      <canvas ref={canvasRef} className={classes.canvas} />
    </div>
  );
};
