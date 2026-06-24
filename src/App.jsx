import { useState, useEffect } from "react"
import MemeEditor from "./components/MemeEditor"
import Gallery from "./components/Gallery"
import "./index.css"

export default function App() {
  const [activeTab, setActiveTab] = useState("editor")
  const [memes, setMemes] = useState([])
  const [editData, setEditData] = useState(null)

  useEffect(() => {
    const saved = localStorage.getItem("memes")
    if (saved) setMemes(JSON.parse(saved))
  }, [])

  function saveMeme(memeData) {
    let updated
    if (editData !== null && editData.index !== undefined) {
      updated = memes.map((m, i) => i === editData.index ? memeData : m)
      setEditData(null)
    } else {
      updated = [...memes, memeData]
    }
    setMemes(updated)
    localStorage.setItem("memes", JSON.stringify(updated))
  }

  function deleteMeme(index) {
    const updated = memes.filter((_, i) => i !== index)
    setMemes(updated)
    localStorage.setItem("memes", JSON.stringify(updated))
  }

  function editMemeFromGallery(meme, index) {
    setEditData({ ...meme, index })
    setActiveTab("editor")
  }

  return (
    <div style={{ minHeight: "100vh", padding: "2rem" }}>
      <header style={{ textAlign: "center", marginBottom: "2rem" }}>
        <h1>Mème<span style={{ color: "#7F77DD" }}>Forge</span></h1>
        <div style={{ marginTop: "1rem", display: "flex", justifyContent: "center", gap: "1rem" }}>
          <button
            onClick={() => setActiveTab("editor")}
            style={{
              padding: "10px 28px",
              borderRadius: "999px",
              border: "none",
              background: activeTab === "editor" ? "#7F77DD" : "white",
              color: activeTab === "editor" ? "white" : "#7F77DD",
              fontWeight: "600",
              fontSize: "15px",
              boxShadow: "0 2px 8px rgba(127,119,221,0.3)"
            }}
          >
            + Créer
          </button>
          <button
            onClick={() => setActiveTab("gallery")}
            style={{
              padding: "10px 28px",
              borderRadius: "999px",
              border: "none",
              background: activeTab === "gallery" ? "#7F77DD" : "white",
              color: activeTab === "gallery" ? "white" : "#7F77DD",
              fontWeight: "600",
              fontSize: "15px",
              boxShadow: "0 2px 8px rgba(127,119,221,0.3)"
            }}
          >
            Galerie {memes.length > 0 && `(${memes.length})`}
          </button>
        </div>
      </header>

      <main>
        {activeTab === "editor"
          ? <MemeEditor onSave={saveMeme} editData={editData} />
          : <Gallery memes={memes} onDelete={deleteMeme} onEdit={editMemeFromGallery} />
        }
      </main>
    </div>
  )
}