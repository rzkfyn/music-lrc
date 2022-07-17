import { setup, play, pause, repeat, noRepeat } from './utils.js';

let intervalId,
  intervalId2,
  splittedLyrics = [];

const lyrics = await (await fetch(`${location.origin}/assets/lyrics/hitorigoto.lrc`)).text();

lyrics.split('\n').forEach(a => {
  let res;
  res = a.split(']');
  res = [
      res[0].trim()+']',
      res[1]
  ];
  splittedLyrics.push(res);
});

const audioPlayer = document.getElementsByClassName('audio-player')[0];
const audio = audioPlayer.getElementsByTagName('audio')[0];

setup(audioPlayer, audio);

audio.addEventListener('play', (ev) => {
  intervalId = setInterval( () => {
    const current = Math.floor(ev.target.currentTime);
    const min = Math.floor(current / 60).toString();
    const sec = (current % 60).toString();
    audioPlayer.querySelector('input#dur').value = ev.target.currentTime;
    audioPlayer.querySelector('.current').innerText = `${min.length == 2 ? min : '0'+min}:${sec.length == 2 ? sec : '0'+sec}`;
  }, 1000);

  intervalId2 = setInterval(() => {
    let current = ev.target.currentTime.toString();
    if (current == 0) return;
    current = current.split('.');
    if(!current[1]) return;
    current = `${current[0]}.${current[1].slice(0,2).length == 2 ? current[1].slice(0,2) : current[1].slice(0,2)+'0'}` * 1;
    
    const min = Math.floor(current / 60).toString();
    let sec = (current % 60).toString();
    sec = sec.split('.');
    if (sec.length > 1) {
      sec = `${sec[0].length == 2 ? sec[0] : '0' + sec[0]}.${sec[1].slice(0,3)}`;
      sec = sec.split('.');
      sec = `${sec[0]}.${sec[1].length == 2 ? sec[1] : sec[1] + '0'}`;
    } else {
      sec = sec[0];
    }
    sec = sec.length < 2 ? '0'+ sec : sec;
    sec = sec.length < 3 ? sec+'.00' : sec;
    if (sec.length > 5) {
      sec = sec.toString().split('.');
      sec = sec[0] +'.' +  Math.round((`${sec[1][0]+sec[1][1]}.${sec[1][2]}${sec[1][3] | '0'}`) * 1);
    }
    sec = sec.split('.');
    sec = sec[1].length < 2 ? `${sec[0]}.0${sec[1]}` : `${sec[0]}.${sec[1]}`;
    const format = `[${min.length == 2  ? min : '0' + min}:${sec}]`;
    for (const lyrics of splittedLyrics) {
      lyricChanges.time = format;
      if(lyrics[0] == format) return document.dispatchEvent(lyricChanges);
    }
  });
});

audio.addEventListener('ended', function() {
  if (this.hasAttribute('loop')) return;
  if (intervalId != 'undefined') clearInterval(intervalId);
  if (intervalId2 != 'undefined') clearInterval(intervalId2);

  audioPlayer.querySelector('#dur').value = 0;
  audioPlayer.querySelector('.current').innerText = '00:00';
  playingAudio = void 0;
  return this.currentTime === this.duration ? audioPlayer.querySelector('#musictoggler').click() : void 0;
});

audioPlayer.querySelector('#togglemusic').addEventListener('input', async function() {
  return await this.checked ? play(audioPlayer.querySelector('.bi-play-fill'), audio) : pause(audioPlayer.querySelector('.bi-pause'), audio);
});

audioPlayer.querySelector('#dur').addEventListener('input', function() {
  audio.currentTime = this.value;
  const min = Math.floor(this.value / 60).toString();
  const sec = (this.value % 60).toString();
  audioPlayer.querySelector('.current').innerText = `${min.length == 2 ? min : '0'+min}:${sec.length == 2 ? sec : '0'+sec}`;
});

audioPlayer.querySelector('#togglerepeat').addEventListener('input', function() {
  return this.checked ?  repeat(audio, audioPlayer.querySelector('.bi-arrow-repeat')) : noRepeat(audio, audioPlayer.querySelector('.bi-arrow-repeat'));
});

const lyricChanges = new Event('lyricchange');
let prevTime;

document.addEventListener('lyricchange', (ev) => {
  const el = document.querySelector('.lyrics p');
  for(const lyric of splittedLyrics) {
    if (lyric[0] == ev.time) {
      if (ev.time == prevTime) return;
      console.log(lyric);
      prevTime = ev.time;
      if (el.classList.contains('scale-125')) el.classList.replace('scale-125', 'scale-0');
      setTimeout(() => {
        el.classList.replace('scale-0', 'scale-125');
        el.innerText = lyric[1];
      }, 200);
    }
  }
});