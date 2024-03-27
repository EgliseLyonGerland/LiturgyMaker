import Player from "react-player";

interface Props {
  title: string;
  url: string;
}

function SongPreview({ title, url }: Props) {
  if (url.includes("drive.google.com")) {
    return (
      <iframe
        frameBorder="0"
        height="140"
        src={url.replace("/view", "/preview")}
        title={`${title} preview`}
        width="100%"
      />
    );
  }

  return <Player url={url} width="100%" />;
}

export default SongPreview;
