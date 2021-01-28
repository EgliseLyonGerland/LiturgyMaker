import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import upperFirst from 'lodash/upperFirst';
import forEach from 'lodash/forEach';
import FontFaceObserver from 'fontfaceobserver';
import * as preview from '../utils/preview';
import { fontFamilies, documentWidth, documentHeight } from '../config/preview';

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

const mapStateToProps = ({ songs, recitations }) => ({
  songs,
  recitations,
});

const Preview = ({ block, songs, recitations, currentFieldPath }) => {
  const classes = useStyles();
  const canvasRef = useRef(null);
  const imageRef = useRef(null);

  const clean = (ctx) => {
    ctx.clearRect(0, 0, documentWidth, documentHeight);
  };

  const draw = async () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    canvas.width = documentWidth;
    canvas.height = documentHeight;

    if (!block) {
      clean(ctx);
      return;
    }

    const { type } = block;
    const funcName = `generate${upperFirst(type)}Preview`;

    if (!preview[funcName]) {
      clean(ctx);
      return;
    }

    ctx.fillStyle = 'white';

    const args = [ctx, block, currentFieldPath];

    if (type === 'songs') {
      args.push(songs.entities);
    }

    if (type === 'recitation') {
      args.push(recitations.data);
    }

    await preview[funcName].apply(this, args);

    imageRef.current.src = canvas.toDataURL('image/png');
  };

  useEffect(() => {
    forEach(fontFamilies, (fontFamily) => {
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

Preview.propTypes = {
  block: PropTypes.object,
  songs: PropTypes.object,
  recitations: PropTypes.object,
  currentFieldPath: PropTypes.array,
};

export default connect(mapStateToProps)(Preview);
