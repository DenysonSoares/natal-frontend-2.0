import { useRef, useState, type CSSProperties } from 'react'
import MoonSurprise from './MoonSurprise'
import NativityScene from './NativityScene'
import './easter-eggs.css'
import CardExperience from './CardExperience'
import GiftGame from './GiftGame'
import BackgroundMusic from './BackgroundMusic'

type IconName = 'moon' | 'sun' | 'snow' | 'light' | 'github' | 'arrow' | 'reset'
function Icon({ name }: { name: IconName }) {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {name === 'moon' && <path d="M20.9 13A9 9 0 0 1 11 3.1 9 9 0 1 0 20.9 13Z" />}
    {name === 'sun' && <><circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5" /></>}
    {name === 'snow' && <path d="M12 2v20M3.3 7l17.4 10M3.3 17 20.7 7M9 4l3 3 3-3M9 20l3-3 3 3M3 10l4-1-1-4m12 14-1-4 4-1M3 14l4 1-1 4M18 5l-1 4 4 1" />}
    {name === 'light' && <><path d="M9 18h6m-5 3h4M8 14a6 6 0 1 1 8 0c-1 1-1 2-1 2H9s0-1-1-2Z" /><path d="M12 1v1M2 10h1m18 0h1M4 3l2 2m12 0 2-2" /></>}
    {name === 'github' && <><path d="M9 19c-4 1-4-2-5-2m10 5v-4c0-1-.3-2-1-2 4-.5 7-2 7-6 0-1.5-.5-2.5-1.5-3.5 0-1 .2-2-.2-3.5 0 0-1.3-.5-4 1a13 13 0 0 0-6 0C6.6 2.5 5.3 3 5.3 3c-.4 1.5-.2 2.5-.2 3.5C4.1 7.5 3.6 8.5 3.6 10c0 4 3 5.5 7 6-.7 0-1 1-1 2v4" /></>}
    {name === 'arrow' && <path d="M5 19 19 5M5 5h14v14" />}
    {name === 'reset' && <><path d="M3 10a9 9 0 1 1 2 8M3 4v6h6" /></>}
  </svg>
}

const ornaments = [[49,24,'gold'],[36,34,'red'],[63,38,'cream'],[49,45,'red'],[25,51,'gold'],[72,55,'red'],[38,60,'cream'],[57,65,'gold'],[19,72,'red'],[79,75,'gold'],[32,83,'gold'],[62,85,'red']]

function ChristmasTree({ lights, onDiscover }: { lights: boolean; onDiscover: () => void }) {
  const clicks = useRef(0)
  function touchStar() {
    clicks.current++
    if (clicks.current === 5) { clicks.current = 0; onDiscover() }
  }
  return <div className={`christmas-tree ${lights ? 'is-lit' : ''}`}>
    <div className="tree-shadow" /><div className="tree-pot" /><div className="tree-trunk" />
    {[0,1,2,3,4].map(tier => <div key={tier} className={`tree-tier tier-${tier}`} />)}
    <div className="garland garland-one" /><div className="garland garland-two" /><div className="garland garland-three" />
    {ornaments.map(([x,y,color],i) => <span key={i} className={`ornament ${color}`} style={{ left:`${x}%`,top:`${y}%` }} />)}
    {Array.from({length:24},(_,i) => { const row = Math.floor(i/6); return <i key={i} className="fairy-light" style={{left:`${(i%6)*(7+row*2)+32-row*6}%`,top:`${29+row*17+Math.sin(i%6)*4}%`,'--delay':`${i*.17}s`} as CSSProperties} /> })}
    <div className="star-glow" /><button type="button" className="tree-star" onClick={touchStar} data-nativity-star aria-label="O verdadeiro natal" title="O verdadeiro natal">★</button>
  </div>
}

function Present({ color, className }: { color:string;className:string }) {
  return <div className={`present ${color} ${className}`} aria-hidden="true"><i className="bow left" /><i className="bow right" /><span /></div>
}

function Room({ night,snow,lights,onDiscover }: { night:boolean;snow:boolean;lights:boolean;onDiscover:()=>void }) {
  return <div className={`room ${night?'night':'day'} ${lights?'lights-on':''}`} role="group" aria-label={`Sala de Natal ${night?'à noite':'de dia'}, com árvore decorada, lareira acesa e ${snow?'neve na janela':'uma janela para as montanhas'}. Luzes da árvore ${lights?'acesas':'apagadas'}.`}>
    <div className="wall-grain" />
    <div className="ceiling-lights" aria-hidden="true">{Array.from({length:15},(_,i)=><i key={i} style={{'--i':i} as CSSProperties} />)}</div>
    <div className="window"><div className="window-sky"><MoonSurprise night={night} />{[0,1,2,3,4,5].map(i=><i key={i} className={`sky-star sky-star-${i}`} />)}<div className="mountain mountain-back" /><div className="mountain mountain-front" /><div className="outside-pine pine-one" /><div className="outside-pine pine-two" /><div className="outside-pine pine-three" />
      {snow && <div className="snowfall">{Array.from({length:30},(_,i)=><i key={i} style={{left:`${(i*37)%100}%`,'--duration':`${4+i%5}s`,'--delay':`${-i*.7}s`,'--size':`${2+i%4}px`} as CSSProperties} />)}</div>}
    </div><div className="window-cross vertical" /><div className="window-cross horizontal" /><div className="window-sill" /></div>
    <div className="wall-art art-25" aria-hidden="true"><span>DEC</span><strong>25</strong><small>the most wonderful time</small></div>
    <div className="wall-art art-sprig" aria-hidden="true"><span>✳</span><small>merry & bright</small></div>
    <div className="fireplace" aria-hidden="true"><div className="mantel-decor"><i /><i /><i /></div><div className="mantel" /><div className="fireplace-body"><div className="fireplace-opening"><div className="logs" /><div className="fire fire-one" /><div className="fire fire-two" /><div className="fire fire-three" /></div></div><div className="hearth" /><div className="stocking stocking-red" /><div className="stocking stocking-green" /></div>
    <div className="wall-trim" /><div className="floor" /><div className="rug" /><ChristmasTree lights={lights} onDiscover={onDiscover} />
    <Present color="cranberry" className="gift-one" /><Present color="sand" className="gift-two" /><Present color="sage" className="gift-three" />
    <div className="basket" aria-hidden="true"><div className="blanket" /></div>
    <div className="scene-caption"><span /> UM NATAL FEITO À MÃO. E EM CÓDIGO.</div>
  </div>
}

export default function App() {
  const [nativity, setNativity] = useState(false)
  const [night,setNight]=useState(true)
  const [snow,setSnow]=useState(true)
  const [lights,setLights]=useState(true)
  function reset(){setNight(true);setSnow(true);setLights(true)}

  return <div className="site-shell">
    <BackgroundMusic />
    <header className="site-header"><a className="brand" href="#inicio" aria-label="Natal Frontend, início"><span className="brand-symbol">✳</span>natal<span className="brand-light">frontend</span><span className="version">2.0</span></a><a className="source-link" href="https://github.com/DenysonSoares/natal-frontend-2.0" target="_blank" rel="noreferrer"><Icon name="github" /><span>Veja o código</span><Icon name="arrow" /></a></header>
    <main id="inicio">

      <section className="scene-section" aria-label="Cenário de Natal interativo"><div className="scene-topline"><span><i /> UM CANTINHO DE NATAL</span><span>FEITO COM CSS <span className="topline-star">✦</span> REIMAGINADO EM REACT</span></div><>{nativity ? <NativityScene onBack={() => { setNativity(false); requestAnimationFrame(() => document.querySelector<HTMLButtonElement>('[data-nativity-star]')?.focus()) }} /> : <Room night={night} snow={snow} lights={lights} onDiscover={() => setNativity(true)} />}</>
        {!nativity && <><GiftGame />
        <div className="scene-toolbar"><a className="scene-send-link" href="#enviar-cartao">Enviar uma mensagem de Natal <span aria-hidden="true">↗</span></a><div className="scene-controls">
          <button type="button" className={night?'active':''} aria-pressed={night} onClick={()=>setNight(!night)}><Icon name={night?'moon':'sun'} /><span>{night?'Noite':'Dia'}</span></button><span className="control-divider" />
          <button type="button" className={snow?'active':''} aria-pressed={snow} onClick={()=>setSnow(!snow)}><Icon name="snow" /><span>Neve</span><i className="status-dot" /></button>
          <button type="button" className={lights?'active':''} aria-pressed={lights} onClick={()=>setLights(!lights)}><Icon name="light" /><span>Luzes</span><i className="status-dot" /></button><span className="control-divider" />
          <button type="button" className="reset-button" onClick={reset} aria-label="Restaurar cenário original" title="Restaurar cenário"><Icon name="reset" /></button>
        </div></div></>}
      </section>
      <section className="intro" aria-labelledby="page-title"><div className="eyebrow"><span /> O MESMO ESPÍRITO. UMA NOVA HISTÓRIA.</div><h1 id="page-title">Um pouco de <em>magia.</em><br />Feita de código.</h1><p>Uma janela para desacelerar, acender as luzes<br className="desktop-break" /> e deixar o Natal acontecer.</p><span className="intro-spark spark-left" aria-hidden="true">✧</span><span className="intro-spark spark-right" aria-hidden="true">✳</span></section>
      <CardExperience />
      <section className="story" aria-label="Sobre o projeto"><span className="story-icon" aria-hidden="true">✦</span><div><h2>Algumas coisas merecem uma nova versão.</h2><p>O que começou com HTML e CSS ganhou novos detalhes, movimento e interação.<br className="desktop-break" /> A essência continua a mesma: transformar linhas de código em um lugar especial.</p></div><a href="https://denysonsoares.github.io/natal-frontend/" target="_blank" rel="noreferrer">Visite a primeira versão <Icon name="arrow" /></a></section>
    </main>
    <footer><span>Feito com carinho e React por <a href="https://github.com/DenysonSoares" target="_blank" rel="noreferrer">Denyson Soares</a><span className="footer-star">✳</span></span><span>Que o simples também encante.</span></footer>
  </div>
}
