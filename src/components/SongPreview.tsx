import Player from 'react-player/lazy';

interface Props {
  title: string;
  url: string;
}

function SongPreview({ title, url }: Props) {
  if (url.includes('drive.google.com')) {
    return (
      <iframe
        title={`${title} preview`}
        frameBorder="0"
        width="100%"
        height="140"
        src={url.replace('/view', '/preview')}
      />
    );
  }

  return <Player url={url} width="100%" />;
}

export default SongPreview;
