import { useEffect, useRef, useState, type FormEvent } from 'react'
import { decodeCard, encodeCard, openedKey, type ChristmasCard } from './cards'
import './cards.css'
import PixSupport from './PixSupport'

export default function CardExperience() {
  const [sender, setSender] = useState('')
  const [message, setMessage] = useState('')
  const [link, setLink] = useState('')
  const [notice, setNotice] = useState('')
  const [incoming, setIncoming] = useState(() => decodeCard(window.location.hash))
  const [invalid, setInvalid] = useState(() => window.location.hash.startsWith('#cartao=') && !decodeCard(window.location.hash))
  const [view, setView] = useState<'sealed' | 'reading' | 'opened'>('sealed')
  const [storageWarning, setStorageWarning] = useState('')
  const dialog = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    function readLocation() {
      const card = decodeCard(window.location.hash)
      setIncoming(card)
      setInvalid(window.location.hash.startsWith('#cartao=') && !card)
    }
    window.addEventListener('hashchange', readLocation)
    return () => window.removeEventListener('hashchange', readLocation)
  }, [])

  useEffect(() => {
    if (!incoming && !invalid) return
    setStorageWarning('')
    try {
      setView(incoming && localStorage.getItem(openedKey(incoming.id)) ? 'opened' : 'sealed')
    } catch {
      setView('sealed')
      setStorageWarning('Seu navegador não permitiu salvar a abertura. Este cartão poderá ser aberto novamente.')
    }
    dialog.current?.showModal()
  }, [incoming, invalid])

  function createCard(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!sender.trim() || !message.trim()) {
      setNotice('Preencha seu nome e uma mensagem antes de gerar o cartão.')
      return
    }
    const card: ChristmasCard = { v: 1, id: crypto.randomUUID(), sender: sender.trim(), message: message.trim() }
    const url = new URL(window.location.href)
    url.hash = `cartao=${encodeCard(card)}`
    setLink(url.toString())
    setNotice('Cartão pronto! Copie o link e envie para alguém especial.')
  }

  function openGift() {
    if (!incoming) return
    try {
      if (localStorage.getItem(openedKey(incoming.id))) { setView('opened'); return }
      localStorage.setItem(openedKey(incoming.id), new Date().toISOString())
    } catch {
      setStorageWarning('Não foi possível registrar a abertura neste navegador. Você ainda pode ler a mensagem.')
    }
    setView('reading')
  }

  async function copyLink() {
    try { await navigator.clipboard.writeText(link); setNotice('Link copiado! Agora é só compartilhar.') }
    catch { setNotice('Não foi possível copiar automaticamente. Selecione e copie o link abaixo.') }
  }

  return <>
    <section id="enviar-cartao" className="card-creator" aria-labelledby="card-heading">
      <div className="card-intro"><span className="card-kicker">UM PRESENTE EM FORMA DE PALAVRAS</span><h2 id="card-heading">Envie um pouco de <em>magia.</em></h2><p>Seu nome, uma mensagem e um cantinho de Natal para alguém especial.</p><span className="card-decoration" aria-hidden="true">✧</span></div>
      <form onSubmit={createCard} className="card-form">
        <label htmlFor="card-sender">Seu nome<input id="card-sender" autoComplete="name" required maxLength={80} value={sender} onChange={event => { setSender(event.target.value); setLink(''); setNotice('') }} placeholder="Como você quer assinar?" /></label>
        <label htmlFor="card-message">Sua mensagem de Natal<textarea id="card-message" required maxLength={800} rows={5} value={message} onChange={event => { setMessage(event.target.value); setLink(''); setNotice('') }} placeholder="Que este Natal traga..." /><span className="character-count">{message.length}/800</span></label>
        <p className="card-hint">Sem cadastro. A mensagem vai no próprio link e pode ser lida por quem tiver acesso a ele. A abertura fica registrada apenas neste navegador; outro aparelho ou a limpeza dos dados permite abrir novamente.</p>
        <button className="card-primary" type="submit">Gerar meu cartão <span aria-hidden="true">↗</span></button>
        <p className="card-notice" role="status">{notice}</p>
        {link && <><div className="card-share"><label htmlFor="card-link">Link do seu cartão<input id="card-link" value={link} readOnly onFocus={event => event.target.select()} /></label><button type="button" className="card-primary" onClick={copyLink}>Copiar link</button><p>Envie o link copiado pelo WhatsApp ou pelo aplicativo que preferir.</p></div><PixSupport /></>}
      </form>
    </section>
    <dialog ref={dialog} className="christmas-dialog" aria-labelledby="gift-title">
      <button type="button" className="card-close" aria-label="Fechar cartão" onClick={() => dialog.current?.close()}>×</button>
      <span className="gift-symbol" aria-hidden="true">{view === 'opened' ? '✧' : '✦'}</span>
      {invalid ? <><h2 id="gift-title">Esse cartão se perdeu pelo caminho.</h2><p>O link está incompleto ou inválido. Peça a quem enviou para copiar o link inteiro novamente.</p></>
        : view === 'opened' ? <><h2 id="gift-title">Este presente já foi aberto.</h2><p>A abertura deste cartão já foi registrada neste navegador. Que o carinho continue por aí.</p></>
        : view === 'sealed' ? <><span className="card-kicker">UMA SURPRESA DE NATAL</span><h2 id="gift-title">Tem carinho esperando por você.</h2><p><strong>{incoming?.sender}</strong> enviou uma mensagem especial.</p><p className="card-hint">Ao abrir, este cartão será marcado como lido neste navegador. Você pode ler até fechar a mensagem.</p><button type="button" className="card-primary" onClick={openGift}>Abrir meu presente</button></>
        : <><span className="card-kicker">UM POUCO DE MAGIA, SÓ PARA VOCÊ</span><h2 id="gift-title">Feliz Natal!</h2><p className="gift-message">{incoming?.message}</p><p className="gift-signature">Com carinho,<br /><strong>{incoming?.sender}</strong></p></>}
      {storageWarning && <p role="status" className="card-hint">{storageWarning}</p>}
    </dialog>
  </>
}
