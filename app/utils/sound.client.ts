export type ChimeKind = "focusEnd" | "breakEnd";

type AudioContextCtor = typeof AudioContext;

let context: AudioContext | null = null;

function getAudioContextCtor(): AudioContextCtor | null {
  if (typeof window === "undefined") return null;
  return (
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: AudioContextCtor })
      .webkitAudioContext ??
    null
  );
}

export function primeAudio(): void {
  const Ctor = getAudioContextCtor();
  if (!Ctor) return;

  if (!context) {
    try {
      context = new Ctor();
    } catch (error) {
      console.error("Could not create an AudioContext:", error);
      return;
    }
  }

  if (context.state === "suspended") {
    void context.resume().catch(() => {
    });
  }
}

function playTone(
  ctx: AudioContext,
  frequency: number,
  startAt: number,
  duration: number,
  peakGain: number
): void {
  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();

  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(frequency, startAt);

  gain.gain.setValueAtTime(0.0001, startAt);
  gain.gain.exponentialRampToValueAtTime(peakGain, startAt + 0.012);
  gain.gain.exponentialRampToValueAtTime(0.0001, startAt + duration);

  oscillator.connect(gain);
  gain.connect(ctx.destination);

  oscillator.start(startAt);
  oscillator.stop(startAt + duration + 0.02);
}

export function playChime(kind: ChimeKind): void {
  primeAudio();
  if (!context || context.state !== "running") return;

  const now = context.currentTime;
  const notes =
    kind === "focusEnd"
      ? [880, 698.46, 587.33]
      : [587.33, 880];

  notes.forEach((frequency, index) => {
    playTone(context!, frequency, now + index * 0.16, 0.45, 0.22);
    playTone(context!, frequency * 2, now + index * 0.16, 0.3, 0.05);
  });
}
