const { writeFileSync } = require('fs');

const posts = require('./foo.json');
const history = require('./history.json');

posts.forEach((post) => {
  if (post.bibleRefs.length === 0) {
    return;
  }

  const sermonDate = new Date(post.extras.sermonDate);
  const year = sermonDate.getFullYear();
  const month = (sermonDate.getMonth() + 1).toString().padStart(2, '0');
  const day = sermonDate.getDate().toString().padStart(2, '0');

  const date = year + '-' + month + '-' + day;
  const ref = post.bibleRefs[0].raw;
  const author = post.author.name;

  if (date in history) {
    history[date] = {
      sermonRef: ref,
      sermonAuthor: author,
      songs: history[date].songs,
    };
  }
});

writeFileSync('./history.new.json', JSON.stringify(history));
