export default function Gallery({ memes, onDelete, onEdit }) {
  if (memes.length === 0) {
    return (
      <div style={{ textAlign: "center", color: "#888", marginTop: "3rem" }}>
        <p style={{ fontSize: "18px" }}>Aucun mème créé pour l'instant.</p>
        <p>Allez dans "Créer" pour faire votre premier mème !</p>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto" }}>
      <h2 style={{ marginBottom: "1rem" }}>Mes mèmes</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem" }}>
        {memes.map((meme, index) => (
          <div key={index} style={{ borderRadius: "8px", overflow: "hidden", border: "1px solid #ccc", position: "relative" }}>
            <img src={meme.preview} alt={`meme-${index}`} style={{ width: "100%", display: "block" }} />
            <div style={{ display: "flex", gap: "6px", position: "absolute", top: "8px", right: "8px" }}>
              <button
                onClick={() => onEdit(meme, index)}
                style={{
                  background: "#7F77DD",
                  color: "white",
                  border: "none",
                  borderRadius: "50%",
                  width: "28px",
                  height: "28px",
                  fontSize: "14px",
                  cursor: "pointer"
                }}
              >
                ✏️
              </button>
              <button
                onClick={() => onDelete(index)}
                style={{
                  background: "red",
                  color: "white",
                  border: "none",
                  borderRadius: "50%",
                  width: "28px",
                  height: "28px",
                  fontSize: "16px",
                  cursor: "pointer"
                }}
              >
                ×
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}