import fetch from 'node-fetch';

export async function repoTags (slug) {
  return await fetch(`http://lib.avosapps.com/get/json?url=https://api.github.com/repos/${slug}/releases`).then(data => data.json()).catch(err => console.log(err));
}
