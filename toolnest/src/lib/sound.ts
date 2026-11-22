/** Small Web Audio beeper. The AudioContext must be unlocked by a user gesture (e.g. clicking Start). */
export function createBeeper() {
  let ctx: AudioContext | null = null;
  const get = () => {
    if (!ctx) {
      const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!Ctor) return null;
      ctx = new Ctor();
    }
    return ctx;
  };
  return {
    unlock() { const c = get(); if (c && c.state === 'suspended') void c.resume(); },
    /** Play `count` short beeps. Returns false if audio is unavailable. */
    beep(count = 3): boolean {
      const c = get();
      if (!c) return false;
      if (c.state === 'suspended') void c.resume();
      for (let k = 0; k < count; k++) {
        const t = c.currentTime + k * 0.35;
        const osc = c.createOscillator();
        const gain = c.createGain();
        osc.type = 'sine'; osc.frequency.value = 880;
        gain.gain.setValueAtTime(0.0001, t);
        gain.gain.exponentialRampToValueAtTime(0.35, t + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.25);
        osc.connect(gain).connect(c.destination);
        osc.start(t); osc.stop(t + 0.28);
      }
      return true;
    }
  };
}
