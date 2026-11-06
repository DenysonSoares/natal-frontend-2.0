import { useEffect, useRef, useState } from 'react'
import { ChristmasMusic } from './christmasMusic'

export default function BackgroundMusic() {
  const engine = useRef<ChristmasMusic | null>(null)
  const busy = useRef(false)
  const attempted = useRef(false)
  const playingRef = useRef(false)
  const [playing, setPlaying] = useState(false)
  const [error, setError] = useState('')

  async function toggle() {
    if (busy.current) return
    busy.current = true
    attempted.current = true
    try {
      engine.current ??= new ChristmasMusic()
      if (playingRef.current) await engine.current.pause()
      else await engine.current.play()
      playingRef.current = !playingRef.current
      setPlaying(playingRef.current)
      setError('')
    } catch {
      setError('Áudio indisponível. Tente tocar novamente.')
    } finally { busy.current = false }
  }

  useEffect(() => {
    let active = true
    // Autoplay may remain pending until the browser receives a user gesture.
    // Keep the button and first-interaction fallback available in the meantime.
    try {
      const music = new ChristmasMusic()
      engine.current = music
      void music.play().then(() => {
        if (!active || attempted.current) return
        playingRef.current = true
        attempted.current = true
        setPlaying(true)
      }).catch(() => {
        // A blocked autoplay is expected; the first click retries playback.
      })
    } catch {
      // Browsers without Web Audio can still use the rest of the scene.
    }
    function firstInteraction(event: Event) {
      if (attempted.current || (event.target instanceof Element && event.target.closest('[data-music-control]'))) return
      if (event instanceof KeyboardEvent && event.key !== 'Enter' && event.key !== ' ') return
      void toggle()
    }
    document.addEventListener('pointerdown', firstInteraction)
    document.addEventListener('keydown', firstInteraction)
    return () => {
      active = false
      document.removeEventListener('pointerdown', firstInteraction)
      document.removeEventListener('keydown', firstInteraction)
      engine.current?.dispose()
      engine.current = null
    }
  }, [])

  return <div className="music-control" data-music-control>
    <button type="button" onClick={() => void toggle()} aria-pressed={playing} aria-label={playing ? 'Pausar música natalina' : 'Tocar música natalina'} title={playing ? 'Pausar música' : 'Tocar música'}>
      <span className={`music-bars ${playing ? 'playing' : ''}`} aria-hidden="true"><i /><i /><i /></span>
      {playing ? 'Pausar música' : 'Tocar música'}
    </button>
    {error && <span className="music-error" role="status">{error}</span>}
  </div>
}
