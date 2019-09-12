import { documentWidth, documentHeight } from "../../config/preview";

export default function generate(ctx, block, currentFieldPath = [0, "title"]) {
  const { data = [] } = block;
  const songIndex = Math.min(currentFieldPath[0], data.length - 1);
  const song = data[songIndex];

  if (!song) return;

  const title = song.title.split("(")[0].trim();

  ctx.setFont("songTitle");
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(title, documentWidth / 2, documentHeight / 2);
}
