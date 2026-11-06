import { useEffect, useState } from 'react'

export default function MoonSurprise({ night }: { night: boolean }) {
  const [flying, setFlying] = useState(false)
  useEffect(() => {
    if (!flying) return
    const timer = window.setTimeout(() => setFlying(false), 5500)
    return () => window.clearTimeout(timer)
  }, [flying])

  return <>
    <button type="button" className="moon moon-surprise" disabled={!night || flying} onClick={() => setFlying(true)} aria-label="Descobrir a surpresa da lua" title={night ? 'Será que tem alguém lá em cima?' : 'Volte quando anoitecer…'} />
    {flying && <div className="santa-flight" role="status" aria-label="Ho ho ho! Papai Noel atravessa o céu com seu trenó."><span aria-hidden="true">🦌 · 🦌 · 🛷🎅</span><i aria-hidden="true">✦ · ✧ · ✦</i></div>}
  </>
}
