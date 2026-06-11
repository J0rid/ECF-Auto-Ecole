export function extractApiError(err, fallback = "Erreur lors de l'enregistrement.") {
  const data = err?.response?.data
  if (!data) return fallback
  if (typeof data.message === 'string' && data.message) return data.message
  if (data.errors) {
    const msgs = []
    const valeurs = Object.values(data.errors)
    for (let i = 0; i < valeurs.length; i++) {
      const liste = valeurs[i]
      for (let j = 0; j < liste.length; j++) {
        if (liste[j]) msgs.push(liste[j])
      }
    }
    if (msgs.length > 0) return msgs.join(' — ')
  }
  if (data.title) return data.title
  if (typeof data === 'string' && data.length < 300 && !data.startsWith('<'))
    return data
  return fallback
}
