import { useEffect, useRef } from 'react'
import './nativity.css'
import nativityIllustration from './assets/nativity-illustration.png'

export default function NativityScene({ onBack }: { onBack: () => void }) {
  const back = useRef<HTMLButtonElement>(null)
  useEffect(() => { back.current?.focus({ preventScroll: true }) }, [])
  return <div className="nativity-scene">
    <div className="nativity-stars" aria-hidden="true" />
    <div className="nativity-heading" role="status"><span>O VERDADEIRO NATAL</span><h2>Uma estrela. Uma esperança.<br />Um amor que nasceu para todos.</h2><p>Na simplicidade de uma manjedoura, nasceu Jesus.</p></div>
    <img className="nativity-image" src={nativityIllustration} alt="A estrela de Belém ilumina uma estrebaria de madeira e pedra. Maria e José contemplam Jesus envolto em panos na manjedoura de palha, com uma ovelha e um burrinho ao lado." width={1672} height={941} decoding="async" />
    <button ref={back} type="button" className="nativity-back" onClick={onBack}>← Voltar ao cantinho de Natal</button>
  </div>
}
