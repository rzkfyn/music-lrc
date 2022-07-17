export const setup = (audioPlayer, audio) => {
  const titleEl = audioPlayer.getElementsByClassName('song-title')[0];

  titleEl.innerText = audio.getAttribute('src').replace('/assets/audio/', '').replace('.mp3', '');
  audioPlayer.querySelector('#togglemusic').setAttribute('id', 'togglemusic');
  audioPlayer.querySelector('#musictoggler').setAttribute('for', 'togglemusic');
  audioPlayer.querySelector('#repeat').setAttribute('id', 'togglerepeat');
  audioPlayer.querySelector('#repeattoggler').setAttribute('for', 'togglerepeat');

  const duration = (Math.floor(audio.duration) - 1);
  const min = Math.floor((duration / 60)).toString();
  const sec = (duration % 60).toString();

  audioPlayer.querySelector('.max').innerText = `${min.length == 2 ? min : '0'+min}:${sec.length == 2 ? sec : '0'+sec}`;
  audioPlayer.querySelector('#dur').setAttribute('max', `${duration}`);
}

export const repeat = (audioEl, btnEl) => {
  btnEl.classList.add('bg-slate-300', 'p-[1px]', 'rotate-90');
  audioEl.setAttribute('loop', '');
}

export const noRepeat = (audioEl, btnEl) => {
  btnEl.classList.remove('bg-slate-300', 'p-[1px]', 'rotate-90');
  audioEl.removeAttribute('loop');
}

export const play = async (el, audioEl) => {
  el.classList.replace('bi-play-fill', 'bi-pause');
  el.innerHTML = `<path d="M6 3.5a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-1 0V4a.5.5 0 0 1 .5-.5zm4 0a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-1 0V4a.5.5 0 0 1 .5-.5z"/>`;
  return await audioEl.play();
}

export const pause = (el, audioEl, intervalId, intervalId2) => {
  if (intervalId != 'undefined') clearInterval(intervalId);
  if (intervalId2 != 'undefined') clearInterval(intervalId2);
  el.classList.replace('bi-pause', 'bi-play-fill');
  el.innerHTML = `<path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"/>`;
  return audioEl.pause();
}