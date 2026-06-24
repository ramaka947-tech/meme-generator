import { useRef, useState, useEffect } from "react"

export default function MemeEditor({ onSave, editData }) {
  const canvasRef = useRef(null)
  const [topText, setTopText] = useState("")
  const [bottomText, setBottomText] = useState("")
  const [image, setImage] = useState(null)
  const [imageUrl, setImageUrl] = useState(null)
  const [showShareModal, setShowShareModal] = useState(false)
  const [textColor, setTextColor] = useState("#ffffff")
  const [fontSize, setFontSize] = useState(36)
  const [fontFamily, setFontFamily] = useState("Impact")

  useEffect(() => {
    if (editData) {
      setTopText(editData.topText || "")
      setBottomText(editData.bottomText || "")
      const img = new Image()
      img.src = editData.imageUrl
      img.onload = () => {
        setImage(img)
        setImageUrl(editData.imageUrl)
      }
    }
  }, [editData])

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = "#ffffff"
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    if (image) {
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height)
    }
    ctx.font = `bold ${fontSize}px ${fontFamily}`
    ctx.fillStyle = textColor
    ctx.strokeStyle = "black"
    ctx.lineWidth = 3
    ctx.textAlign = "center"
    if (topText) {
      ctx.fillText(topText.toUpperCase(), canvas.width / 2, 50)
      ctx.strokeText(topText.toUpperCase(), canvas.width / 2, 50)
    }
    if (bottomText) {
      ctx.fillText(bottomText.toUpperCase(), canvas.width / 2, canvas.height - 20)
      ctx.strokeText(bottomText.toUpperCase(), canvas.width / 2, canvas.height - 20)
    }
  }, [image, topText, bottomText, textColor, fontSize, fontFamily])

  function handleImageUpload(e) {
    const file = e.target.files[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.src = url
    img.onload = () => {
      setImage(img)
      setImageUrl(url)
    }
  }

  function handleDownload() {
    const canvas = canvasRef.current
    const link = document.createElement("a")
    link.download = "meme.png"
    link.href = canvas.toDataURL("image/png")
    link.click()
  }

  function handleSave() {
    if (!image) {
      alert("Veuillez d'abord choisir une image !")
      return
    }
    onSave({
      imageUrl,
      topText,
      bottomText,
      preview: canvasRef.current.toDataURL("image/png")
    })
    alert("Mème sauvegardé dans la galerie !")
  }

  function handleShare(platform) {
    const text = encodeURIComponent("Regardez mon mème créé avec MèmeForge !")
    const url = encodeURIComponent("https://memforge.vercel.app")
    const links = {
      twitter: `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      whatsapp: `https://wa.me/?text=${text}%20${url}`,
      reddit: `https://reddit.com/submit?url=${url}&title=${text}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`
    }
    window.open(links[platform], "_blank")
    setShowShareModal(false)
  }

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      gap: "2rem",
      maxWidth: "900px",
      margin: "0 auto",
      padding: "0 1rem"
    }}>

      <div style={{ width: "100%", maxWidth: "600px", margin: "0 auto" }}>
        <canvas
          ref={canvasRef}
          width={500}
          height={400}
          style={{ border: "1px solid #ccc", borderRadius: "8px", background: "#fff", width: "100%", maxHeight: "400px" }}
        />
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: "1rem"
      }}>

        <div>
          <label>Image</label>
          <input type="file" accept="image/*" onChange={handleImageUpload} style={{ width: "100%" }} />
        </div>

        <div>
          <label>Texte du haut</label>
          <input
            type="text"
            value={topText}
            onChange={(e) => setTopText(e.target.value)}
            placeholder="Texte du haut..."
            style={{ width: "100%", padding: "6px" }}
          />
        </div>

        <div>
          <label>Texte du bas</label>
          <input
            type="text"
            value={bottomText}
            onChange={(e) => setBottomText(e.target.value)}
            placeholder="Texte du bas..."
            style={{ width: "100%", padding: "6px" }}
          />
        </div>

        <div>
          <label>Police</label>
          <select
            value={fontFamily}
            onChange={(e) => setFontFamily(e.target.value)}
            style={{ width: "100%", padding: "6px", borderRadius: "12px", border: "1.5px solid #d0c4f7" }}
          >
            <option value="Impact">Impact</option>
            <option value="Arial">Arial</option>
            <option value="Comic Sans MS">Comic Sans</option>
            <option value="Georgia">Georgia</option>
            <option value="Verdana">Verdana</option>
          </select>
        </div>

        <div>
          <label>Taille du texte : {fontSize}px</label>
          <input
            type="range"
            min="16"
            max="72"
            value={fontSize}
            onChange={(e) => setFontSize(Number(e.target.value))}
            style={{ width: "100%" }}
          />
        </div>

        <div>
          <label>Couleur du texte</label>
          <div style={{ display: "flex", gap: "8px", flexWrap: "nowrap", marginTop: "4px" }}>
            {["#ffffff", "#000000", "#FFD700", "#FF4444", "#44AAFF", "#44FF88"].map((color) => (
              <div
                key={color}
                onClick={() => setTextColor(color)}
                style={{
                  width: "28px",
                  height: "28px",
                  borderRadius: "50%",
                  background: color,
                  border: textColor === color ? "3px solid #7F77DD" : "2px solid #ccc",
                  cursor: "pointer"
                }}
              />
            ))}
          </div>
        </div>

      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
        gap: "1rem"
      }}>
        <button
          onClick={handleSave}
          style={{ padding: "10px", background: "#7F77DD", color: "white", border: "none", borderRadius: "12px", fontSize: "15px" }}
        >
          Sauvegarder
        </button>
        <button
          onClick={handleDownload}
          style={{ padding: "10px", background: "#1a1a2e", color: "white", border: "none", borderRadius: "12px", fontSize: "15px" }}
        >
          Télécharger
        </button>
        <button
          onClick={() => setShowShareModal(true)}
          style={{ padding: "10px", background: "#e040fb", color: "white", border: "none", borderRadius: "12px", fontSize: "15px" }}
        >
          Partager
        </button>
      </div>

      {showShareModal && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.4)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 1000,
          padding: "1rem"
        }}>
          <div style={{
            background: "white", borderRadius: "16px", padding: "2rem",
            width: "100%", maxWidth: "320px", textAlign: "center"
          }}>
            <h3 style={{ marginBottom: "1rem", color: "#1a1a2e" }}>Choisir un réseau</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px", marginBottom: "1.5rem" }}>
              {[
                { name: "twitter", label: "X", bg: "#000000" },
                { name: "facebook", label: "Facebook", bg: "#1877F2" },
                { name: "whatsapp", label: "WhatsApp", bg: "#25D366" },
                { name: "reddit", label: "Reddit", bg: "#FF4500" },
                { name: "linkedin", label: "LinkedIn", bg: "#0A66C2" }
              ].map((r) => (
                <button
                  key={r.name}
                  onClick={() => handleShare(r.name)}
                  style={{
                    padding: "10px 6px", background: r.bg, color: "white",
                    border: "none", borderRadius: "10px", fontSize: "12px", fontWeight: "600"
                  }}
                >
                  {r.label}
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowShareModal(false)}
              style={{
                padding: "8px 24px", background: "#f0f0f0", color: "#333",
                border: "none", borderRadius: "10px", fontSize: "14px"
              }}
            >
              Annuler
            </button>
          </div>
        </div>
      )}

    </div>
  )
}