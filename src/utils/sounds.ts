/*
 * Sound utilities using the Web Audio API.
 *
 * HOW TO ADD REAL AUDIO FILES:
 * 1. Place MP3/OGG files in /public/sounds/ (e.g. public/sounds/cat.mp3)
 * 2. Replace the synthesized sound functions below with:
 *      const audio = new Audio('/sounds/cat.mp3');
 *      audio.volume = 0.6;
 *      audio.play();
 * 3. For the best experience, keep sounds under 2 seconds and at low volume.
 *
 * Free animal sound sources: freesound.org, soundbible.com (check licenses)
 */

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    try {
      audioCtx = new AudioContext();
    } catch {
      return null;
    }
  }
  // Resume if suspended (browsers suspend until user interaction)
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

function playTone(
  frequency: number,
  duration: number,
  type: OscillatorType = 'sine',
  gainValue = 0.18,
  fadeOut = true,
) {
  const ctx = getAudioContext();
  if (!ctx) return;

  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);

  gainNode.gain.setValueAtTime(gainValue, ctx.currentTime);
  if (fadeOut) {
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
  }

  oscillator.start(ctx.currentTime);
  oscillator.stop(ctx.currentTime + duration);
}

function playChord(notes: number[], duration: number, gainValue = 0.12) {
  notes.forEach(freq => playTone(freq, duration, 'sine', gainValue));
}

// Gentle success chime — two ascending soft tones
export function playSuccessSound() {
  playTone(523, 0.2, 'sine', 0.15); // C5
  setTimeout(() => playTone(659, 0.35, 'sine', 0.15), 180); // E5
  setTimeout(() => playTone(784, 0.45, 'sine', 0.13), 340); // G5
}

// Soft tap feedback
export function playTapSound() {
  playTone(440, 0.15, 'sine', 0.1);
}

// Animal sounds — synthesized approximations
// Replace these functions with real audio file playback for production use.
export function playAnimalSound(animal: string) {
  switch (animal) {
    case 'cat':
      // Soft meow approximation: rising then falling tone
      playCatSound();
      break;
    case 'dog':
      playDogSound();
      break;
    case 'cow':
      playCowSound();
      break;
    case 'sheep':
      playSheepSound();
      break;
    case 'duck':
      playDuckSound();
      break;
  }
}

function playCatSound() {
  const ctx = getAudioContext();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.type = 'sine';
  osc.frequency.setValueAtTime(380, ctx.currentTime);
  osc.frequency.linearRampToValueAtTime(520, ctx.currentTime + 0.2);
  osc.frequency.linearRampToValueAtTime(400, ctx.currentTime + 0.5);
  gain.gain.setValueAtTime(0.15, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.6);
}

function playDogSound() {
  const ctx = getAudioContext();
  if (!ctx) return;
  // Two short woofs
  [0, 0.25].forEach(offset => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(200, ctx.currentTime + offset);
    osc.frequency.linearRampToValueAtTime(150, ctx.currentTime + offset + 0.15);
    gain.gain.setValueAtTime(0.12, ctx.currentTime + offset);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + offset + 0.18);
    osc.start(ctx.currentTime + offset);
    osc.stop(ctx.currentTime + offset + 0.2);
  });
}

function playCowSound() {
  const ctx = getAudioContext();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.type = 'sine';
  osc.frequency.setValueAtTime(120, ctx.currentTime);
  osc.frequency.linearRampToValueAtTime(100, ctx.currentTime + 0.6);
  gain.gain.setValueAtTime(0.18, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.7);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.7);
}

function playSheepSound() {
  const ctx = getAudioContext();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.type = 'sine';
  osc.frequency.setValueAtTime(300, ctx.currentTime);
  osc.frequency.linearRampToValueAtTime(260, ctx.currentTime + 0.3);
  osc.frequency.linearRampToValueAtTime(280, ctx.currentTime + 0.6);
  gain.gain.setValueAtTime(0.14, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.65);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.65);
}

function playDuckSound() {
  const ctx = getAudioContext();
  if (!ctx) return;
  [0, 0.22].forEach(offset => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'square';
    osc.frequency.setValueAtTime(350, ctx.currentTime + offset);
    osc.frequency.linearRampToValueAtTime(320, ctx.currentTime + offset + 0.15);
    gain.gain.setValueAtTime(0.1, ctx.currentTime + offset);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + offset + 0.18);
    osc.start(ctx.currentTime + offset);
    osc.stop(ctx.currentTime + offset + 0.2);
  });
}

// Calm naming chime used in the picture explorer
export function playNameChime() {
  playChord([523, 659], 0.5, 0.09);
}

// Gentle session-end melody
export function playSessionEndMelody() {
  const notes = [523, 494, 440, 392];
  notes.forEach((freq, i) => {
    setTimeout(() => playTone(freq, 0.5, 'sine', 0.12), i * 400);
  });
}
