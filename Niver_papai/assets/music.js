// Música opcional da homenagem. Nenhum áudio é enviado a serviços externos.
export class CardMusic {
  constructor({ onChange = () => {}, robertoSrc = null } = {}) {
    this._onChange = onChange;
    this._src = robertoSrc;
    this._volume = 0.35;
    this._playing = false;
    this._track = 'jingle';
    this._available = false;
    this._error = null;
    this._generation = 0;
    this._context = null;
    this._master = null;
    this._audio = null;
    this._timer = null;
    this._voices = new Set();
    this._probePromise = null;
    globalThis.document?.addEventListener('visibilitychange', () => {
      if (document.hidden) this.pause();
    });
    globalThis.addEventListener?.('pagehide', () => this.pause());
  }

  get state() {
    return {
      playing: this._playing,
      track: this._track,
      robertoAvailable: this._available,
      error: this._error
    };
  }

  _emit() { this._onChange(this.state); }

  _stop() {
    this._playing = false;
    clearInterval(this._timer);
    this._timer = null;
    for (const voice of this._voices) {
      try { voice.osc.stop(); } catch { /* A nota já pode ter terminado. */ }
      voice.osc.disconnect();
      voice.gain.disconnect();
    }
    this._voices.clear();
    this._audio?.pause();
    if (this._context && this._context.state !== 'closed') {
      this._context.suspend().catch(() => {});
    }
  }

  pause() {
    this._generation += 1;
    this._stop();
    this._emit();
  }

  setVolume(value) {
    if (!Number.isFinite(value)) return;
    this._volume = Math.min(1, Math.max(0, value));
    if (this._audio) this._audio.volume = this._volume;
    if (this._master) {
      this._master.gain.setTargetAtTime(this._volume, this._context.currentTime, 0.03);
    }
    this._emit();
  }

  _fail(message) {
    this._generation += 1;
    this._stop();
    this._error = message;
    this._emit();
    return false;
  }

  async probeRoberto() {
    if (this._probePromise) return this._probePromise;
    if (!this._src) {
      this._available = false;
      this._emit();
      return false;
    }
    this._probePromise = (async () => {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 7000);
      try {
        const result = await fetch(this._src, {
          method: 'HEAD', cache: 'no-cache', signal: controller.signal
        });
        this._available = result.ok && /^audio\//i.test(result.headers.get('content-type') || '');
      } catch {
        this._available = false;
      } finally {
        clearTimeout(timeout);
      }
      this._emit();
      return this._available;
    })();
    try { return await this._probePromise; }
    finally { this._probePromise = null; }
  }

  _prepareJingle() {
    if (this._context) return;
    const AudioContextClass = globalThis.AudioContext || globalThis.webkitAudioContext;
    if (!AudioContextClass) throw new Error('unsupported');
    this._context = new AudioContextClass();
    this._master = this._context.createGain();
    this._master.gain.value = this._volume;
    const warmth = this._context.createBiquadFilter();
    warmth.type = 'lowpass';
    warmth.frequency.value = 1600;
    this._master.connect(warmth);
    warmth.connect(this._context.destination);
  }

  _note(frequency, when, duration, level, type = 'sine') {
    const osc = this._context.createOscillator();
    const gain = this._context.createGain();
    const voice = { osc, gain };
    osc.type = type;
    osc.frequency.value = frequency;
    gain.gain.setValueAtTime(0.0001, when);
    gain.gain.exponentialRampToValueAtTime(level, when + 0.045);
    gain.gain.exponentialRampToValueAtTime(0.0001, when + duration);
    osc.connect(gain);
    gain.connect(this._master);
    this._voices.add(voice);
    osc.onended = () => {
      osc.disconnect();
      gain.disconnect();
      this._voices.delete(voice);
    };
    osc.start(when);
    osc.stop(when + duration + 0.03);
  }

  _schedule() {
    if (!this._playing || this._track !== 'jingle') return;
    // Progressão original de quatro acordes; não reproduz melodias de terceiros.
    const chords = [
      [174.61, 220, 261.63, 329.63, 392],
      [164.81, 246.94, 293.66, 392, 440],
      [146.83, 174.61, 220, 261.63, 329.63],
      [130.81, 164.81, 196, 246.94, 293.66]
    ];
    const pattern = [0, 2, 4, 2, 1, 3, 4, 3];
    const now = this._context.currentTime;
    if (this._next < now) this._next = now + 0.03;
    while (this._next < now + 0.15) {
      const chord = chords[Math.floor(this._step / 8) % chords.length];
      const beat = this._step % 8;
      this._note(chord[pattern[beat]] * 2, this._next, 0.75, 0.085);
      if (beat === 0) {
        this._note(chord[0] / 2, this._next, 2.6, 0.09, 'triangle');
        chord.forEach(frequency => this._note(frequency, this._next, 3.35, 0.018));
      }
      this._next += 60 / 68 / 2;
      this._step += 1;
    }
  }

  _prepareRoberto() {
    if (this._audio) return;
    this._audio = new Audio(this._src);
    this._audio.preload = 'none';
    this._audio.volume = this._volume;
    this._audio.addEventListener('ended', () => {
      if (this._track !== 'roberto') return;
      this._playing = false;
      this._emit();
    });
    this._audio.addEventListener('error', () => {
      this._available = false;
      if (this._track === 'roberto') {
        this._fail('A gravação não está disponível agora. Você pode ouvir o jingle.');
      } else this._emit();
    });
  }

  async play(track = 'jingle') {
    const generation = ++this._generation;
    this._stop();
    this._error = null;
    this._track = track;
    if (!['jingle', 'roberto'].includes(track)) {
      return this._fail('Escolha uma das músicas da homenagem.');
    }
    this._emit();
    try {
      if (track === 'jingle') {
        this._prepareJingle();
        // Executado antes de aguardar rede, preservando o gesto de tocar.
        await this._context.resume();
        if (generation !== this._generation) return false;
        if (this._context.state !== 'running') throw new Error('blocked');
        this._playing = true;
        this._step = 0;
        this._next = this._context.currentTime + 0.035;
        this._schedule();
        this._timer = setInterval(() => this._schedule(), 60);
      } else {
        if (!this._src) return this._fail('A gravação de Roberto Carlos ainda não foi adicionada.');
        this._prepareRoberto();
        await this._audio.play();
        if (generation !== this._generation) return false;
        this._available = true;
        this._playing = true;
      }
      this._emit();
      return true;
    } catch (error) {
      if (generation !== this._generation) return false;
      if (track === 'roberto' && error.name !== 'NotAllowedError') this._available = false;
      const message = track === 'jingle'
        ? 'O som não pôde iniciar. Toque novamente ou continue lendo a homenagem.'
        : error.name === 'NotAllowedError'
          ? 'Toque novamente para permitir a reprodução da música.'
          : 'A gravação não está disponível agora. Você pode ouvir o jingle.';
      return this._fail(message);
    }
  }
}
