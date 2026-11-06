// Original instrumental loop: soft bells over a slow Christmas-style harmony.
// Synthesized locally, with no audio downloads or external services.
const melody = [76, 79, 83, 79, 81, 79, 76, 74, 72, 76, 79, 76, 74, 72, 71, 67,
  69, 72, 76, 72, 74, 76, 79, 76, 74, 71, 67, 71, 72, 76, 79, 72]
const bass = [48, 48, 45, 45, 53, 53, 55, 48]

export class ChristmasMusic {
  private context = new AudioContext()
  private master = this.context.createGain()
  private timer: number | undefined
  private voices = new Set<OscillatorNode>()
  private step = 0
  private nextTime = 0

  constructor() {
    this.master.gain.value = 0.12
    this.master.connect(this.context.destination)
  }

  private tone(midi: number, time: number, duration: number, volume: number) {
    const oscillator = this.context.createOscillator()
    const envelope = this.context.createGain()
    oscillator.type = 'sine'
    oscillator.frequency.value = 440 * 2 ** ((midi - 69) / 12)
    envelope.gain.setValueAtTime(0, time)
    envelope.gain.linearRampToValueAtTime(volume, time + 0.015)
    envelope.gain.exponentialRampToValueAtTime(0.001, time + duration)
    oscillator.connect(envelope)
    envelope.connect(this.master)
    this.voices.add(oscillator)
    oscillator.onended = () => {
      this.voices.delete(oscillator)
      oscillator.disconnect()
      envelope.disconnect()
    }
    oscillator.start(time)
    oscillator.stop(time + duration + 0.02)
  }

  private schedule = () => {
    this.nextTime = Math.max(this.nextTime, this.context.currentTime + 0.02)
    while (this.nextTime < this.context.currentTime + 0.25) {
      const note = melody[this.step % melody.length]
      this.tone(note, this.nextTime, 1.3, 0.4)
      this.tone(note + 12, this.nextTime, 0.6, 0.07)
      if (this.step % 4 === 0) {
        const root = bass[Math.floor(this.step / 4) % bass.length]
        this.tone(root, this.nextTime, 2.6, 0.24)
        this.tone(root + 7, this.nextTime, 2.2, 0.1)
      }
      this.step++
      this.nextTime += 0.48
    }
  }

  async play() {
    await this.context.resume()
    if (this.context.state !== 'running') throw new Error('Audio blocked')
    if (this.timer !== undefined) return
    this.nextTime = this.context.currentTime + 0.04
    this.schedule()
    this.timer = window.setInterval(this.schedule, 100)
  }

  async pause() {
    window.clearInterval(this.timer)
    this.timer = undefined
    for (const voice of this.voices) voice.stop()
    this.voices.clear()
    await this.context.suspend()
  }

  dispose() {
    window.clearInterval(this.timer)
    void this.context.close()
  }
}
