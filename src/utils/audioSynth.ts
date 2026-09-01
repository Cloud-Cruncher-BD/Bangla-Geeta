// Meditative Tanpura / Om Ambient Drone Synthesizer using Web Audio API

let audioCtx: AudioContext | null = null;
let masterGain: GainNode | null = null;
let isPlaying = false;
let oscillators: OscillatorNode[] = [];

export function toggleAmbientAudio(): boolean {
  if (isPlaying) {
    stopAmbientAudio();
    return false;
  } else {
    startAmbientAudio();
    return true;
  }
}

export function startAmbientAudio() {
  if (isPlaying) return;

  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;

    audioCtx = new AudioContextClass();
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    masterGain = audioCtx.createGain();
    masterGain.gain.setValueAtTime(0, audioCtx.currentTime);
    // Smooth gentle fade in
    masterGain.gain.linearRampToValueAtTime(0.08, audioCtx.currentTime + 2.5);
    masterGain.connect(audioCtx.destination);

    // Warm Tanpura Drone Frequencies (Root: C# 138.59 Hz, Pa: G# 207.65 Hz, Octave: C# 277.18 Hz)
    const baseFreqs = [138.59, 207.65, 277.18, 415.30];

    baseFreqs.forEach((freq, idx) => {
      if (!audioCtx || !masterGain) return;
      
      const osc = audioCtx.createOscillator();
      const oscGain = audioCtx.createGain();
      
      osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

      // Add gentle subtle chorus detuning
      const detuneAmount = (idx - 1.5) * 4;
      osc.detune.setValueAtTime(detuneAmount, audioCtx.currentTime);

      // Low pass filter for warm, soft spiritual atmosphere
      const filter = audioCtx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, audioCtx.currentTime);

      oscGain.gain.setValueAtTime(0.25, audioCtx.currentTime);

      osc.connect(filter);
      filter.connect(oscGain);
      oscGain.connect(masterGain);

      osc.start();
      oscillators.push(osc);
    });

    isPlaying = true;
  } catch {
    // Gracefully handle browser autoplay policy
    isPlaying = false;
  }
}

export function stopAmbientAudio() {
  if (!isPlaying) return;

  if (masterGain && audioCtx) {
    try {
      masterGain.gain.linearRampToValueAtTime(0.001, audioCtx.currentTime + 1.0);
      setTimeout(() => {
        oscillators.forEach(osc => {
          try {
            osc.stop();
            osc.disconnect();
          } catch {
            // ignore
          }
        });
        oscillators = [];
        if (audioCtx && audioCtx.state !== 'closed') {
          audioCtx.close();
        }
        audioCtx = null;
        masterGain = null;
      }, 1100);
    } catch {
      // ignore
    }
  }
  isPlaying = false;
}
