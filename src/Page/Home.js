import React, { useState } from "react"
import { Header } from "../Components/header"
const Home = () => {
  const [img, setImg] = useState([])
  console.log(img)
  return (
    <div>
      <Header setImg={setImg} />
      {img.length > 0 && img.map((e) => <img src={e.url} alt={e.description} />)}
    </div>
  )
}

export default Home
