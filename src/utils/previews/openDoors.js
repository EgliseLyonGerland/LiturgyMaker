import { documentWidth, documentHeight } from '../../config/preview';
import openDoorsImage from '../../images/openDoors.png';

function drawSlide1(ctx, data, image) {
  ctx.save();
  ctx.setFont('openDoorsTitle');
  const { width: titleWidth } = ctx.measureText(data.title);
  const titleHeight = ctx.getCurrentLineHeight();
  ctx.restore();

  ctx.save();
  ctx.setFont('openDoorsDetail');
  const detailWidth = Math.max(1000, titleWidth);
  const { height: detailHeight } = ctx.measureMultiligneText(
    data.detail,
    detailWidth,
  );
  ctx.restore();

  const imageMarginBottom = 138;
  const titleMarginBottom = 32;
  const totalHeight =
    image.height +
    titleHeight +
    detailHeight +
    imageMarginBottom +
    titleMarginBottom;

  const imageX = (documentWidth - image.width) / 2;
  const imageY = (documentHeight - totalHeight) / 2;
  ctx.drawImage(image, imageX, imageY);

  ctx.setFont('openDoorsTitle');
  const titleX = (documentWidth - titleWidth) / 2;
  const titleY = imageY + image.height + imageMarginBottom;
  ctx.fillText(data.title, titleX, titleY);

  ctx.setFont('openDoorsDetail');
  const detailX = (documentWidth - detailWidth) / 2;
  const detailY = titleY + titleHeight + titleMarginBottom;
  ctx.fillMultilineText(data.detail, detailX, detailY, detailWidth);
}

function drawSlide2(ctx, data, image) {
  ctx.save();
  ctx.fillStyle = '#432B7E';
  ctx.beginPath();
  ctx.moveTo(0, 487 + 60);
  ctx.lineTo(documentWidth, 487);
  ctx.lineTo(documentWidth, documentHeight);
  ctx.lineTo(0, documentHeight);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  ctx.save();
  ctx.setFont('openDoorsPrayerTopicsHeadline');
  ctx.fillStyle = 'white';
  ctx.textBaseline = 'top';
  ctx.textAlign = 'center';
  ctx.fillText(
    data.prayerTopics.length === 1 ? 'SUJET DE PRIÈRE' : 'SUJETS DE PRIÈRE',
    documentWidth / 2,
    614,
  );
  ctx.restore();

  const prayerTopicGutters = 120;
  const prayerTopicMargins = 180;
  const prayerTopicWidth =
    (documentWidth - prayerTopicMargins * 2 - prayerTopicGutters * 2) / 3;
  let prayerTopicMaxHeight = 0;

  const topics = data.prayerTopics.map(topic => {
    ctx.save();
    ctx.setFont('openDoorsPrayerTopic');
    const { width, height } = ctx.measureMultiligneText(
      topic,
      prayerTopicWidth,
    );
    ctx.restore();

    prayerTopicMaxHeight = Math.max(prayerTopicMaxHeight, height);

    return { width, height, text: topic };
  });

  const separatorHeight = (prayerTopicMaxHeight * 80) / 100;

  topics.forEach((topic, index) => {
    ctx.save();
    ctx.setFont('openDoorsPrayerTopic');
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';

    const totalWidth =
      prayerTopicWidth * topics.length +
      prayerTopicGutters * (topics.length - 1);
    const textX =
      documentWidth / 2 -
      totalWidth / 2 +
      prayerTopicWidth * (index + 0.5) +
      prayerTopicGutters * index;
    const textY = 890 - topic.height / 2;

    ctx.fillMultilineText(topic.text, textX, textY, prayerTopicWidth);
    ctx.restore();

    if (index) {
      ctx.save();
      ctx.fillStyle = '#F0BB60';

      const lineX = textX - prayerTopicWidth / 2 - prayerTopicGutters / 2 - 1;
      const lineY = 890 - separatorHeight / 2;

      ctx.fillRect(lineX, lineY, 2, separatorHeight);
      ctx.restore();
    }
  });

  ctx.save();
  ctx.setFont('openDoorsTitle');
  const { width: titleWidth } = ctx.measureText(data.title);
  const titleHeight = ctx.getCurrentLineHeight();
  ctx.restore();

  ctx.save();
  ctx.setFont('openDoorsDetail');
  const detailWidth = Math.max(1000, titleWidth);
  const { height: detailHeight } = ctx.measureMultiligneText(
    data.detail,
    detailWidth,
  );
  ctx.restore();

  const contentHeight = 540;
  const imageMarginRight = 88;
  const titleMarginBottom = 32;

  const imageX =
    (documentWidth -
      Math.max(titleWidth, detailWidth) -
      image.width -
      imageMarginRight) /
    2;
  const imageY = (contentHeight - image.height) / 2;

  ctx.drawImage(image, imageX, imageY);

  ctx.setFont('openDoorsTitle');
  ctx.textBaseline = 'top';
  const titleX = imageX + image.width + imageMarginRight;
  const titleY =
    (contentHeight - titleHeight - titleMarginBottom - detailHeight) / 2;

  ctx.fillText(data.title, titleX, titleY);

  ctx.setFont('openDoorsDetail');
  ctx.textBaseline = 'top';
  const detailX = titleX;
  const detailY = titleY + titleHeight + titleMarginBottom;
  ctx.fillMultilineText(data.detail, detailX, detailY, detailWidth);
}

export default async function generate(ctx, block) {
  const data = {
    ...block.data,
    title: block.data.title || 'Lorem Ipsum',
    detail:
      block.data.detail ||
      'Excepteur duis elit culpa nisi nulla ut. Dolor sint deserunt tempor dolor exercitation. Consectetur qui dolor laboris cupidatat amet anim laboris eiusmod aliqua nostrud do ipsum consectetur proident. Esse nulla eu nisi occaecat laborum tempor.',
    prayerTopics: block.data.prayerTopics.filter(item => !!item),
  };

  ctx.fillStyle = '#F4F4F4';
  ctx.fillRect(0, 0, documentWidth, documentHeight);
  ctx.fillStyle = '#3C4858';

  const image = new Image();
  image.src = openDoorsImage;

  await new Promise(resolve => {
    image.onload = () => {
      if (data.prayerTopics && data.prayerTopics.length) {
        drawSlide2(ctx, data, image);
      } else {
        drawSlide1(ctx, data, image);
      }
      resolve();
    };
  });
}
