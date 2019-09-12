import { documentWidth, documentHeight } from "../../config/preview";

export default function generate(ctx, block) {
  const {
    data: { title = "" }
  } = block;

  const margin = 60;

  ctx.setFont("chapterTitle");
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  const titleHeight = ctx.getCurrentLineHeight();
  const titleX = documentWidth / 2;
  const titleY = (documentHeight - titleHeight - margin) / 2;
  ctx.fillText(title, titleX, titleY);

  const lineX = documentWidth / 2;
  const lineY = titleY + titleHeight + margin;
  ctx.fillSeparator(lineX, lineY, true);
}
