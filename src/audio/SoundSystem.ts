/**
 * Procedural Web Audio Sound Engine for Punjab Express 3D
 * Zero external audio files - 100% synthesized authentic foley & musical horns
 */

export class SoundSystem {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private masterGain: GainNode | null = null;

  // Engine audio nodes
  private engineRunning: boolean = false;
  private engineGain: GainNode | null = null;
  private idleOsc: OscillatorNode | null = null;
  private loadOsc: OscillatorNode | null = null;
  private subOsc: OscillatorNode | null = null;
  private turboOsc: OscillatorNode | null = null;
  private turboGain: GainNode | null = null;
  private exhaustFilter: BiquadFilterNode | null = null;

  // Horn state
  private activeHornTimeout: number | null = null;
  private activeHornNodes: (AudioNode | OscillatorNode)[] = [];

  // Radio cassette loop
  private radioPlaying: boolean = false;
  private radioTimer: number | null = null;
  private radioGain: GainNode | null = null;

  constructor() {
    // AudioContext will be initialized on first user interaction
  }

  private initContext(): AudioContext {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.7, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(muted ? 0 : 0.7, this.ctx.currentTime);
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  /**
   * Start procedural diesel engine sound loop
   */
  public startEngine() {
    if (this.engineRunning) return;
    const ctx = this.initContext();

    this.engineGain = ctx.createGain();
    this.engineGain.gain.setValueAtTime(0.3, ctx.currentTime);

    // Low pass filter to shape heavy diesel exhaust
    this.exhaustFilter = ctx.createBiquadFilter();
    this.exhaustFilter.type = 'lowpass';
    this.exhaustFilter.frequency.setValueAtTime(320, ctx.currentTime);
    this.exhaustFilter.Q.setValueAtTime(2.5, ctx.currentTime);

    // Sub rumble oscillator (diesel piston thump)
    this.subOsc = ctx.createOscillator();
    this.subOsc.type = 'sawtooth';
    this.subOsc.frequency.setValueAtTime(28, ctx.currentTime);

    // Mid combustion pulse
    this.idleOsc = ctx.createOscillator();
    this.idleOsc.type = 'triangle';
    this.idleOsc.frequency.setValueAtTime(56, ctx.currentTime);

    // Harmonic load oscillator
    this.loadOsc = ctx.createOscillator();
    this.loadOsc.type = 'sawtooth';
    this.loadOsc.frequency.setValueAtTime(84, ctx.currentTime);

    // Turbocharger whistle
    this.turboOsc = ctx.createOscillator();
    this.turboOsc.type = 'sine';
    this.turboOsc.frequency.setValueAtTime(1400, ctx.currentTime);

    this.turboGain = ctx.createGain();
    this.turboGain.gain.setValueAtTime(0.01, ctx.currentTime);

    const subGain = ctx.createGain();
    subGain.gain.setValueAtTime(0.4, ctx.currentTime);

    const idleGain = ctx.createGain();
    idleGain.gain.setValueAtTime(0.3, ctx.currentTime);

    const loadGain = ctx.createGain();
    loadGain.gain.setValueAtTime(0.15, ctx.currentTime);

    this.subOsc.connect(subGain);
    this.idleOsc.connect(idleGain);
    this.loadOsc.connect(loadGain);

    subGain.connect(this.exhaustFilter);
    idleGain.connect(this.exhaustFilter);
    loadGain.connect(this.exhaustFilter);

    this.turboOsc.connect(this.turboGain);
    this.turboGain.connect(this.engineGain);

    this.exhaustFilter.connect(this.engineGain);
    this.engineGain.connect(this.masterGain!);

    this.subOsc.start();
    this.idleOsc.start();
    this.loadOsc.start();
    this.turboOsc.start();

    this.engineRunning = true;
  }

  /**
   * Update engine pitch and turbo whistle based on vehicle RPM and throttle
   */
  public updateEngine(rpm: number, throttle: boolean, speedKmh: number) {
    if (!this.engineRunning || !this.ctx) return;
    const now = this.ctx.currentTime;

    // RPM ranges from 700 (idle) to 2600 (redline)
    const normalizedRpm = Math.max(700, Math.min(2600, rpm));
    const baseFreq = 22 + (normalizedRpm / 2600) * 48; // 22Hz to 70Hz fundamental

    if (this.subOsc) this.subOsc.frequency.setTargetAtTime(baseFreq, now, 0.05);
    if (this.idleOsc) this.idleOsc.frequency.setTargetAtTime(baseFreq * 2, now, 0.05);
    if (this.loadOsc) this.loadOsc.frequency.setTargetAtTime(baseFreq * 3, now, 0.05);

    if (this.exhaustFilter) {
      const cutoff = 240 + (normalizedRpm / 2600) * 450;
      this.exhaustFilter.frequency.setTargetAtTime(cutoff, now, 0.05);
    }

    // Turbo whistle increases with throttle & vehicle speed
    if (this.turboOsc && this.turboGain) {
      const turboFreq = 1600 + (speedKmh / 120) * 2800;
      const targetGain = throttle ? Math.min(0.08, 0.01 + (speedKmh / 120) * 0.07) : 0.005;
      this.turboOsc.frequency.setTargetAtTime(turboFreq, now, 0.1);
      this.turboGain.gain.setTargetAtTime(targetGain, now, 0.1);
    }

    if (this.engineGain) {
      const baseGain = 0.25 + (throttle ? 0.15 : 0.05) + (speedKmh / 120) * 0.1;
      this.engineGain.gain.setTargetAtTime(Math.min(0.55, baseGain), now, 0.05);
    }
  }

  public stopEngine() {
    if (!this.engineRunning) return;
    try {
      this.subOsc?.stop();
      this.idleOsc?.stop();
      this.loadOsc?.stop();
      this.turboOsc?.stop();
    } catch {
      // Ignored if already stopped
    }
    this.engineRunning = false;
  }

  /**
   * Play signature pneumatic air brake discharge: "khisssss-phatt!"
   */
  public playAirBrakeHiss() {
    const ctx = this.initContext();
    const now = ctx.currentTime;

    // Buffer for white noise
    const bufferSize = ctx.sampleRate * 0.45;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(2200, now);
    filter.frequency.exponentialRampToValueAtTime(700, now + 0.4);
    filter.Q.setValueAtTime(1.8, now);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain!);

    noise.start(now);
    noise.stop(now + 0.45);
  }

  /**
   * Stop any currently sounding air horn
   */
  public stopHorn() {
    if (this.activeHornTimeout) {
      window.clearTimeout(this.activeHornTimeout);
      this.activeHornTimeout = null;
    }
    for (const node of this.activeHornNodes) {
      try {
        if ('stop' in node) {
          (node as OscillatorNode).stop();
        }
        node.disconnect();
      } catch {
        // Ignored
      }
    }
    this.activeHornNodes = [];
  }

  /**
   * Play 1 of 5 Authentic Pakistani Bus Air Horns
   * @param hornIndex 1 to 5
   */
  public playHorn(hornIndex: number) {
    this.stopHorn();
    const ctx = this.initContext();
    const now = ctx.currentTime;

    const hornMasterGain = ctx.createGain();
    hornMasterGain.gain.setValueAtTime(0.5, now);
    hornMasterGain.connect(this.masterGain!);
    this.activeHornNodes.push(hornMasterGain);

    if (hornIndex === 1) {
      // 1. "WAPDA HORN" - Alternating high-power two-tone blast (F#5 & G#5)
      const freqs = [740, 830];
      const cycleTime = 0.16; // 160ms alternation
      const totalCycles = 8; // ~1.3 seconds

      for (let i = 0; i < totalCycles; i++) {
        const startTime = now + i * cycleTime;
        const endTime = startTime + cycleTime * 0.95;
        const osc = ctx.createOscillator();
        const toneGain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freqs[i % 2], startTime);

        // Harmonic overtone
        const overtone = ctx.createOscillator();
        overtone.type = 'square';
        overtone.frequency.setValueAtTime(freqs[i % 2] * 1.5, startTime);

        toneGain.gain.setValueAtTime(0.35, startTime);
        toneGain.gain.exponentialRampToValueAtTime(0.01, endTime);

        osc.connect(toneGain);
        overtone.connect(toneGain);
        toneGain.connect(hornMasterGain);

        osc.start(startTime);
        osc.stop(endTime);
        overtone.start(startTime);
        overtone.stop(endTime);

        this.activeHornNodes.push(osc, overtone, toneGain);
      }

      this.activeHornTimeout = window.setTimeout(() => this.stopHorn(), 1400);

    } else if (hornIndex === 2) {
      // 2. "FOLK MELODIC / BABUL DI DUA" - 5-note brass cadence (G4, B4, D5, G5, F#5)
      const melody = [
        { f: 392, d: 0.18 }, // G4
        { f: 493.88, d: 0.18 }, // B4
        { f: 587.33, d: 0.18 }, // D5
        { f: 783.99, d: 0.32 }, // G5
        { f: 739.99, d: 0.22 }, // F#5
        { f: 783.99, d: 0.5 }, // G5 sustain
      ];
      let t = now;
      melody.forEach(note => {
        const osc = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const noteGain = ctx.createGain();

        osc.type = 'sawtooth';
        osc2.type = 'triangle';
        osc.frequency.setValueAtTime(note.f, t);
        osc2.frequency.setValueAtTime(note.f * 1.004, t); // slight detune for rich brass

        noteGain.gain.setValueAtTime(0.4, t);
        noteGain.gain.exponentialRampToValueAtTime(0.01, t + note.d);

        osc.connect(noteGain);
        osc2.connect(noteGain);
        noteGain.connect(hornMasterGain);

        osc.start(t);
        osc.stop(t + note.d);
        osc2.start(t);
        osc2.stop(t + note.d);

        this.activeHornNodes.push(osc, osc2, noteGain);
        t += note.d * 0.95;
      });

      this.activeHornTimeout = window.setTimeout(() => this.stopHorn(), 1800);

    } else if (hornIndex === 3) {
      // 3. "BHANGRA DHOL CADENCE" - 4 syncopated staccato blasts
      const beats = [0, 0.14, 0.28, 0.46, 0.62];
      beats.forEach((offset, idx) => {
        const t = now + offset;
        const dur = idx === beats.length - 1 ? 0.35 : 0.11;
        const osc = ctx.createOscillator();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(idx % 2 === 0 ? 520 : 660, t);

        const bGain = ctx.createGain();
        bGain.gain.setValueAtTime(0.45, t);
        bGain.gain.exponentialRampToValueAtTime(0.01, t + dur);

        osc.connect(bGain);
        bGain.connect(hornMasterGain);
        osc.start(t);
        osc.stop(t + dur);
        this.activeHornNodes.push(osc, bGain);
      });

      this.activeHornTimeout = window.setTimeout(() => this.stopHorn(), 1100);

    } else if (hornIndex === 4) {
      // 4. "EXPRESS SIREN / POLICE ESCORT" - High-intensity clearance siren
      const osc = ctx.createOscillator();
      const sGain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.linearRampToValueAtTime(1100, now + 0.35);
      osc.frequency.linearRampToValueAtTime(650, now + 0.7);
      osc.frequency.linearRampToValueAtTime(1200, now + 1.05);

      sGain.gain.setValueAtTime(0.4, now);
      sGain.gain.exponentialRampToValueAtTime(0.01, now + 1.3);

      osc.connect(sGain);
      sGain.connect(hornMasterGain);
      osc.start(now);
      osc.stop(now + 1.3);
      this.activeHornNodes.push(osc, sGain);

      this.activeHornTimeout = window.setTimeout(() => this.stopHorn(), 1350);

    } else {
      // 5. "HEAVY BEDFORD BLAST" - Massive dual chime power chord (Low C3 + G3 + C4)
      const chord = [130.81, 196.0, 261.63, 523.25];
      chord.forEach(f => {
        const osc = ctx.createOscillator();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(f, now);

        const chordGain = ctx.createGain();
        chordGain.gain.setValueAtTime(0.3, now);
        chordGain.gain.exponentialRampToValueAtTime(0.01, now + 1.2);

        osc.connect(chordGain);
        chordGain.connect(hornMasterGain);
        osc.start(now);
        osc.stop(now + 1.2);
        this.activeHornNodes.push(osc, chordGain);
      });

      this.activeHornTimeout = window.setTimeout(() => this.stopHorn(), 1250);
    }
  }

  /**
   * Conductor body slap: "Thap-thap!" on the bus body
   */
  public playConductorSlap() {
    const ctx = this.initContext();
    const slaps = [0, 0.16]; // two rapid slaps

    slaps.forEach(offset => {
      const t = ctx.currentTime + offset;
      const osc = ctx.createOscillator();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(120, t);
      osc.frequency.exponentialRampToValueAtTime(35, t + 0.08);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.5, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.09);

      // Add a metallic click
      const buffer = ctx.createBuffer(1, ctx.sampleRate * 0.03, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * 0.5;
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      osc.connect(gain);
      noise.connect(gain);
      gain.connect(this.masterGain!);

      osc.start(t);
      osc.stop(t + 0.09);
      noise.start(t);
      noise.stop(t + 0.03);
    });
  }

  /**
   * Reverse guide pea whistle: "Tweeet-tweet!"
   */
  public playReverseWhistle() {
    const ctx = this.initContext();
    const tweets = [0, 0.18];

    tweets.forEach(offset => {
      const t = ctx.currentTime + offset;
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(2600, t);
      osc.frequency.linearRampToValueAtTime(2900, t + 0.07);
      osc.frequency.linearRampToValueAtTime(2700, t + 0.12);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.3, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.13);

      osc.connect(gain);
      gain.connect(this.masterGain!);
      osc.start(t);
      osc.stop(t + 0.13);
    });
  }

  /**
   * Suspension creak or metallic road bump
   */
  public playBumpSound(intensity: number = 0.5) {
    const ctx = this.initContext();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    osc.type = 'square';
    osc.frequency.setValueAtTime(80, now);
    osc.frequency.exponentialRampToValueAtTime(30, now + 0.15);

    const gain = ctx.createGain();
    const vol = Math.min(0.4, 0.15 + intensity * 0.25);
    gain.gain.setValueAtTime(vol, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.16);

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(280, now);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain!);

    osc.start(now);
    osc.stop(now + 0.16);
  }

  /**
   * Collision impact sound
   */
  public playCrashSound() {
    const ctx = this.initContext();
    const now = ctx.currentTime;

    const bufferSize = ctx.sampleRate * 0.35;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.1));
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const osc = ctx.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(90, now);
    osc.frequency.exponentialRampToValueAtTime(25, now + 0.3);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.6, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);

    noise.connect(gain);
    osc.connect(gain);
    gain.connect(this.masterGain!);

    noise.start(now);
    osc.start(now);
    noise.stop(now + 0.35);
    osc.stop(now + 0.35);
  }

  /**
   * Passenger boarding chime / cash fare sound
   */
  public playCashChime() {
    const ctx = this.initContext();
    const now = ctx.currentTime;

    const notes = [659.25, 880, 1174.66]; // E5, A5, D6
    notes.forEach((freq, idx) => {
      const t = now + idx * 0.08;
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.25, t);
      gain.gain.exponentialRampToValueAtTime(0.005, t + 0.22);

      osc.connect(gain);
      gain.connect(this.masterGain!);
      osc.start(t);
      osc.stop(t + 0.22);
    });
  }

  /**
   * Toggle cockpit Pakistani cassette radio with authentic Punjabi dhol beats
   */
  public toggleRadio(): boolean {
    if (this.radioPlaying) {
      this.stopRadio();
      return false;
    } else {
      this.startRadio();
      return true;
    }
  }

  private startRadio() {
    const ctx = this.initContext();
    this.radioPlaying = true;
    this.radioGain = ctx.createGain();
    this.radioGain.gain.setValueAtTime(0.2, ctx.currentTime);
    this.radioGain.connect(this.masterGain!);

    let beat = 0;
    const intervalMs = 150; // fast Bhangra groove tempo (~100 BPM 8th notes)

    const step = () => {
      if (!this.radioPlaying) return;
      const now = ctx.currentTime;

      // Dhol bass on 0, 3, 4, 6
      if (beat % 8 === 0 || beat % 8 === 4) {
        const bass = ctx.createOscillator();
        bass.type = 'sine';
        bass.frequency.setValueAtTime(110, now);
        bass.frequency.exponentialRampToValueAtTime(45, now + 0.12);
        const bG = ctx.createGain();
        bG.gain.setValueAtTime(0.4, now);
        bG.gain.exponentialRampToValueAtTime(0.01, now + 0.12);
        bass.connect(bG);
        bG.connect(this.radioGain!);
        bass.start(now);
        bass.stop(now + 0.12);
      }

      // Snare / high dhol strike
      if (beat % 2 === 1) {
        const osc = ctx.createOscillator();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.exponentialRampToValueAtTime(120, now + 0.06);
        const sG = ctx.createGain();
        sG.gain.setValueAtTime(0.25, now);
        sG.gain.exponentialRampToValueAtTime(0.01, now + 0.06);
        osc.connect(sG);
        sG.connect(this.radioGain!);
        osc.start(now);
        osc.stop(now + 0.06);
      }

      // Melodic flute / tumbi pluck on 0, 2, 4, 7
      if (beat % 4 === 0 || beat % 4 === 2) {
        const melodyScale = [440, 523.25, 587.33, 659.25, 783.99];
        const pitch = melodyScale[(beat / 2) % melodyScale.length];
        const mel = ctx.createOscillator();
        mel.type = 'sawtooth';
        mel.frequency.setValueAtTime(pitch, now);
        const mG = ctx.createGain();
        mG.gain.setValueAtTime(0.12, now);
        mG.gain.exponentialRampToValueAtTime(0.005, now + 0.1);
        mel.connect(mG);
        mG.connect(this.radioGain!);
        mel.start(now);
        mel.stop(now + 0.1);
      }

      beat++;
      this.radioTimer = window.setTimeout(step, intervalMs);
    };

    step();
  }

  private stopRadio() {
    this.radioPlaying = false;
    if (this.radioTimer) {
      window.clearTimeout(this.radioTimer);
      this.radioTimer = null;
    }
    if (this.radioGain) {
      try {
        this.radioGain.disconnect();
      } catch {
        // Ignored
      }
      this.radioGain = null;
    }
  }

  public dispose() {
    this.stopEngine();
    this.stopHorn();
    this.stopRadio();
    if (this.ctx && this.ctx.state !== 'closed') {
      try {
        this.ctx.close();
      } catch {
        // Ignored
      }
    }
  }
}

export const soundManager = new SoundSystem();
