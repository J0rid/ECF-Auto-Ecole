import { createContext, useContext, useState, useRef } from 'react'

const ConfirmContext = createContext(null)

export function ConfirmProvider({ children }) {
  const [visible, setVisible] = useState(false)
  const [titre, setTitre] = useState('Confirmation')
  const [message, setMessage] = useState('')
  const resolveRef = useRef(null)

  function confirm(texte, titreDlg) {
    setMessage(texte)
    setTitre(titreDlg || 'Confirmation')
    setVisible(true)
    return new Promise(function(resolve) {
      resolveRef.current = resolve
    })
  }

  function handleOui() {
    setVisible(false)
    resolveRef.current(true)
  }

  function handleNon() {
    setVisible(false)
    resolveRef.current(false)
  }

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}

      {visible && (
        <div className="modal d-block" style={{ background: 'rgba(0, 0, 0, 0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header border-bottom">
                <h5 className="modal-title fw-bold">{titre}</h5>
              </div>
              <div className="modal-body">
                <p style={{ whiteSpace: 'pre-line', marginBottom: 0, fontSize: '0.9rem' }}>
                  {message}
                </p>
              </div>
              <div className="modal-footer border-top">
                <button type="button" className="btn btn-outline-secondary" onClick={handleNon}>
                  Annuler
                </button>
                <button type="button" className="btn btn-danger" onClick={handleOui}>
                  Confirmer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  )
}

export function useConfirm() {
  const ctx = useContext(ConfirmContext)
  return ctx.confirm
}
