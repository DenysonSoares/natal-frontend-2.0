import { useEffect, useRef, useState, type CSSProperties } from 'react'
import './gift-game.css'

type Phase = 'idle' | 'preview' | 'shuffle' | 'choose' | 'result'

export default function GiftGame() {
  const dialog = useRef<HTMLDialogElement>(null)
  const [phase, setPhase] = useState<Phase>('idle')
  const [order, setOrder] = useState([0, 1, 2])
  const [winner, setWinner] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [streak, setStreak] = useState(0)
  const [party, setParty] = useState(false)
  const picked = useRef(false)

  function start() {
    picked.current = false
    setParty(false)
    setOrder([0, 1, 2])
    setWinner(Math.floor(Math.random() * 3))
    setSelected(null)
    setPhase('preview')
  }

  function launch() {
    start()
    dialog.current?.showModal()
  }

  function choose(id: number) {
    if (phase !== 'choose' || picked.current) return
    picked.current = true
    const next = id === winner ? streak + 1 : 0
    setStreak(next)
    setParty(next > 0 && next % 3 === 0)
    setSelected(id)
    setPhase('result')
  }

  useEffect(() => {
    if (phase !== 'preview') return
    const timer = window.setTimeout(() => setPhase('shuffle'), 1800)
    return () => window.clearTimeout(timer)
  }, [phase])

  useEffect(() => {
    if (phase !== 'shuffle') return
    let swaps = 0
    const timer = window.setInterval(() => {
      if (swaps === 7) {
        window.clearInterval(timer)
        setPhase('choose')
        return
      }
      const first = Math.floor(Math.random() * 3)
      const second = (first + 1 + Math.floor(Math.random() * 2)) % 3
      setOrder(current => {
        const next = [...current]
        ;[next[first], next[second]] = [next[second], next[first]]
        return next
      })
      swaps++
    }, 650)
    return () => window.clearInterval(timer)
  }, [phase])

  const instructions = phase === 'preview' ? 'Olhe bem: a estrela mostra onde está a surpresa!'
    : phase === 'shuffle' ? 'Embaralhando… acompanhe o presente com atenção.'
    : phase === 'choose' ? 'Onde está a surpresa? Escolha um dos três presentes.'
    : selected === winner ? 'Você encontrou! Um pouquinho de magia para o seu Natal. ✨'
    : 'Esse estava vazio! A estrela mostra onde a surpresa se escondeu.'

  return <>
    <div className="gift-game-targets" aria-label="Jogo dos presentes">
      {['gift-one', 'gift-two', 'gift-three'].map((position, index) => <button key={position} type="button" className={`gift-hitbox ${position}`} onClick={launch} aria-label={`Jogar com os presentes — presente ${index + 1}`} title="Encontre a surpresa"><span aria-hidden="true">Jogar ✧</span></button>)}
    </div>
    <dialog ref={dialog} className={`christmas-dialog gift-game-dialog ${party ? 'secret-party' : ''} ${phase === 'result' ? (selected === winner ? 'game-won' : 'game-lost') : ''}`} aria-labelledby="game-title" onClose={() => { if (phase !== 'result') setStreak(0); setPhase('idle'); setParty(false) }}>
      <button className="card-close" type="button" aria-label="Fechar jogo" onClick={() => dialog.current?.close()}>×</button>
      <span className="card-kicker">UMA BRINCADEIRA DE NATAL</span>
      <h2 id="game-title">Encontre a surpresa</h2>
      <p>Três presentes. Dois vazios. Uma surpresa.<br />Acompanhe a mistura e tente acertar!</p>
      <p className="game-status" role="status">{instructions}</p>
      {party && <div className="secret-party-banner" role="status"><span aria-hidden="true">🎁 ✨ 🎄 ✨ 🎁</span><strong>Ho ho ho! Você descobriu a festa secreta!</strong><span>Três acertos seguidos! Todos os presentes se abriram para comemorar.</span><div className="party-confetti" aria-hidden="true">{Array.from({ length: 30 }, (_, i) => <i key={i} style={{ left: `${i * 37 % 100}%`, '--delay': `${i % 8 * .12}s`, '--particle-color': ['#d5b36c', '#a95343', '#74876a'][i % 3] } as CSSProperties}>✦</i>)}</div></div>}
      {phase === 'result' && <div className="game-result-effect" aria-hidden="true">
        {selected === winner ? <><span className="victory-star">★</span><div className="star-burst">{Array.from({ length: 24 }, (_, i) => <i key={i} style={{ '--angle': `${i * 15}deg`, '--distance': `${75 + i % 4 * 22}px`, '--delay': `${i % 5 * 0.07}s`, '--particle-color': ['#d5b36c', '#a95343', '#74876a', '#e9c995'][i % 4] } as CSSProperties}>✦</i>)}</div></>
          : <><span className="empty-surprise">☁</span><span className="oops-caption">Ops… só um ventinho de Natal!</span></>}
      </div>}
      <div className="game-boxes" aria-label="Presentes embaralhados" aria-busy={phase === 'shuffle'}>
        {[0, 1, 2].map(id => {
          const position = order.indexOf(id)
          const revealed = phase === 'result' || (phase === 'preview' && id === winner)
          return <button key={id} type="button" className={`game-box ${revealed ? 'revealed' : ''} ${selected === id ? 'chosen' : ''}`} style={{ left: `${position * 34}%` }} disabled={phase !== 'choose'} aria-label={`Abrir presente na posição ${position + 1}`} onClick={() => choose(id)}>
            <span className="game-box-content" aria-hidden="true">{party ? ['★', '🎄', '✨'][id] : revealed ? (id === winner ? '★' : '·') : ''}</span>
            <span className="game-box-lid" aria-hidden="true" /><span className="game-box-ribbon" aria-hidden="true" />
            <span className="game-box-number">{position + 1}{phase === 'result' ? (id === winner ? ' · Surpresa!' : ' · Vazio') : ''}</span>
          </button>
        })}
      </div>
      {phase === 'result' && <button type="button" className="card-primary" onClick={start}>Jogar novamente</button>}
      <p className="card-hint">Uma brincadeira gratuita, só para espalhar alegria.</p>
    </dialog>
  </>
}
