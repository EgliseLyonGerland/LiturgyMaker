import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import classnames from 'classnames';
import { verseTemplates } from '../config/preview';

import { ReactComponent as TopBottomLeftPreview } from '../images/templates/topBottomLeft.svg';
import { ReactComponent as TopBottomCenterPreview } from '../images/templates/topBottomCenter.svg';
import { ReactComponent as TopBottomRightPreview } from '../images/templates/topBottomRight.svg';
import { ReactComponent as BottomTopLeftPreview } from '../images/templates/bottomTopLeft.svg';
import { ReactComponent as BottomTopCenterPreview } from '../images/templates/bottomTopCenter.svg';
import { ReactComponent as BottomTopRightPreview } from '../images/templates/bottomTopRight.svg';
import { ReactComponent as LeftRightCenterPreview } from '../images/templates/leftRightCenter.svg';
import { ReactComponent as RightLeftCenterPreview } from '../images/templates/rightLeftCenter.svg';

const useStyles = makeStyles(
  theme => ({
    root: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr 1fr 1fr',
      gridColumnGap: 16,
      gridRowGap: 16,
    },
    item: {
      opacity: 0.5,
      cursor: 'pointer',
      transition: 'opacity .3s',

      '&:hover': {
        opacity: 1,
      },
    },
    current: {
      outline: [['solid', 1, theme.palette.secondary.light]],
      opacity: 0.7,
    },
    img: {
      width: '100%',
      display: 'block',
    },
  }),
  { name: 'VerseTemplatePicker' },
);

const previews = {
  topBottomLeft: TopBottomLeftPreview,
  topBottomCenter: TopBottomCenterPreview,
  topBottomRight: TopBottomRightPreview,
  bottomTopLeft: BottomTopLeftPreview,
  bottomTopCenter: BottomTopCenterPreview,
  bottomTopRight: BottomTopRightPreview,
  leftRightCenter: LeftRightCenterPreview,
  rightLeftCenter: RightLeftCenterPreview,
};

export default ({ current = 'topBottomLeft', onSelect }) => {
  const classes = useStyles();

  const renderImg = name => {
    const Component = previews[name];

    return <Component className={classes.img} />;
  };

  return (
    <div className={classes.root}>
      {verseTemplates.map(name => (
        <div
          key={name}
          className={classnames(classes.item, {
            [classes.current]: name === current,
          })}
          onClick={() => {
            onSelect(name);
          }}
        >
          {renderImg(name)}
        </div>
      ))}
    </div>
  );
};
