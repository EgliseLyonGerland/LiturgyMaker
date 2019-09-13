import { documentWidth, documentHeight } from "../../config/preview";

export default function generate(ctx, block, currentFieldPath = [0, "title"]) {
  const { data = [] } = block;
  const songIndex = Math.min(currentFieldPath[0], data.length - 1);
  const song = data[songIndex];

  if (!song) return;

  let title = song.title.split("(")[0].trim();
  title = title || "Lorem Ipsum";

  ctx.setFont("songTitle");
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(title, documentWidth / 2, documentHeight / 2);
}
