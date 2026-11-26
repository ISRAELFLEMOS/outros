import { CardMusic } from './music.js';

// Após adicionar a gravação ao repositório, substitua null pelo caminho do MP3.
const ROBERTO_CARLOS_AUDIO = null;
const PUBLIC_URL = 'https://israelflemos.github.io/outros/Niver_papai/';
const $ = (id) => document.getElementById(id);
const cover = $('cover');
const section = $('letter-section');
const bar = $('music-bar');
const motion = matchMedia('(prefers-reduced-motion: reduce)');
let opening = false;
let letterIsOpen = false;
let selectedTrack = 'jingle';
let toastTimer;
let savedVolume = 35;

function notify(message) {
  clearTimeout(toastTimer);
  $('toast').textContent = message;
  $('toast').hidden = false;
  toastTimer = setTimeout(() => { $('toast').hidden = true; }, 4800);
}

const music = new CardMusic({
  robertoSrc: ROBERTO_CARLOS_AUDIO,
  onChange(state) {
    $('play-symbol').textContent = state.playing ? 'Ⅱ' : '▶';
    $('play-text').textContent = state.playing ? 'Pausar' : 'Tocar';
    $('music-toggle').setAttribute('aria-label', state.playing ? 'Pausar música' : 'Tocar música');
    $('track-name').textContent = state.track === 'roberto' ? 'Meu Querido, Meu Velho, Meu Amigo' : 'Jingle do cartão';
    $('track-status').textContent = state.playing ? (state.track === 'roberto' ? 'Roberto Carlos' : 'Instrumental suave') : 'Música pausada';
    $('track-options').hidden = !state.robertoAvailable;
    $('choose-jingle').setAttribute('aria-pressed', String(state.track !== 'roberto'));
    $('choose-roberto').setAttribute('aria-pressed', String(state.track === 'roberto'));
    if (state.error) notify(state.error);
  }
});

function showMusic() {
  bar.hidden = false;
  $('music-reopen').hidden = true;
}

function openLetter() {
  if (opening || letterIsOpen) return;
  opening = true;
  cover.classList.add('opening');
  $('open-letter').disabled = true;
  $('envelope-button').disabled = true;
  $('open-letter').setAttribute('aria-expanded', 'true');
  $('envelope-button').setAttribute('aria-expanded', 'true');
  showMusic();
  music.play(selectedTrack).catch(() => notify('Toque em Tocar para ouvir a música.'));
  setTimeout(() => {
    cover.hidden = true;
    section.hidden = false;
    section.classList.add('letter-reveal');
    letterIsOpen = true;
    opening = false;
    window.scrollTo({ top: 0, behavior: 'instant' });
    $('letter-title').focus({ preventScroll: true });
  }, motion.matches ? 0 : 1100);
}

function closeLetter() {
  music.pause();
  bar.hidden = true;
  $('music-reopen').hidden = true;
  $('music-settings').hidden = true;
  $('music-settings-toggle').setAttribute('aria-expanded', 'false');
  section.hidden = true;
  section.classList.remove('letter-reveal');
  cover.hidden = false;
  cover.classList.remove('opening');
  letterIsOpen = false;
  opening = false;
  $('open-letter').disabled = false;
  $('envelope-button').disabled = false;
  $('open-letter').setAttribute('aria-expanded', 'false');
  $('envelope-button').setAttribute('aria-expanded', 'false');
  window.scrollTo({ top: 0, behavior: 'instant' });
  $('open-letter').focus({ preventScroll: true });
}

$('open-letter').addEventListener('click', openLetter);
$('envelope-button').addEventListener('click', openLetter);
$('back-to-cover').addEventListener('click', closeLetter);
$('increase-type').addEventListener('click', () => {
  const larger = $('letter').classList.toggle('large-type');
  $('increase-type').setAttribute('aria-pressed', String(larger));
  $('increase-type').setAttribute('aria-label', larger ? 'Voltar ao tamanho normal do texto' : 'Aumentar o tamanho do texto');
});
$('music-toggle').addEventListener('click', () => {
  if (music.state.playing) music.pause();
  else music.play(selectedTrack).catch(() => notify('Não foi possível iniciar a música. Tente tocar novamente.'));
});
$('music-settings-toggle').addEventListener('click', () => {
  const open = $('music-settings').hidden;
  $('music-settings').hidden = !open;
  $('music-settings-toggle').setAttribute('aria-expanded', String(open));
});
$('music-volume').addEventListener('input', (event) => {
  const value = Number(event.target.value);
  music.setVolume(value / 100);
  $('mute-music').textContent = value === 0 ? 'Ativar som' : 'Silenciar';
  $('mute-music').setAttribute('aria-pressed', String(value === 0));
  if (value > 0) savedVolume = value;
});
$('mute-music').addEventListener('click', () => {
  const volume = Number($('music-volume').value) === 0 ? savedVolume : 0;
  $('music-volume').value = String(volume);
  $('music-volume').dispatchEvent(new Event('input'));
});
$('close-music').addEventListener('click', () => {
  music.pause();
  bar.hidden = true;
  $('music-settings').hidden = true;
  $('music-settings-toggle').setAttribute('aria-expanded', 'false');
  $('music-reopen').hidden = false;
  $('music-reopen').focus();
});
$('music-reopen').addEventListener('click', () => {
  showMusic();
  $('music-toggle').focus();
});
for (const [button, track] of [['choose-jingle', 'jingle'], ['choose-roberto', 'roberto']]) {
  $(button).addEventListener('click', () => {
    selectedTrack = track;
    music.play(track).catch(() => notify('Não foi possível tocar esta música.'));
  });
}

function cardUrl() {
  if (location.hostname.endsWith('github.io')) return new URL('./', location.href).href;
  return PUBLIC_URL;
}

async function copyLink() {
  try {
    await navigator.clipboard.writeText(cardUrl());
    notify('Link copiado. Agora é só colar no WhatsApp.');
  } catch {
    $('copy-fallback').hidden = false;
    $('card-link').value = cardUrl();
    $('card-link').focus();
    $('card-link').select();
    notify('Selecione o endereço para copiar.');
  }
}
$('copy-link').addEventListener('click', copyLink);
$('share-card').addEventListener('click', async () => {
  const data = { title: 'Feliz 72 anos, Paizão!', text: 'Pai, preparei uma homenagem especial para você. Com carinho, Israel.', url: cardUrl() };
  if (navigator.share) {
    try { await navigator.share(data); }
    catch (error) { if (error.name !== 'AbortError') await copyLink(); }
  } else {
    const link = document.createElement('a');
    link.href = 'https://wa.me/?text=' + encodeURIComponent(`${data.text}\n\n${data.url}`);
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.click();
  }
});

document.querySelector('.skip-link').addEventListener('click', (event) => {
  if (section.hidden) {
    event.preventDefault();
    openLetter();
  }
});
document.addEventListener('visibilitychange', () => { if (document.hidden) music.pause(); });
window.addEventListener('pagehide', () => music.pause());
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !$('music-settings').hidden) {
    $('music-settings').hidden = true;
    $('music-settings-toggle').setAttribute('aria-expanded', 'false');
    $('music-settings-toggle').focus();
  }
});

cover.hidden = false;
section.hidden = true;
$('letter-tools').hidden = false;
$('share-actions').hidden = false;
if (ROBERTO_CARLOS_AUDIO) music.probeRoberto();
