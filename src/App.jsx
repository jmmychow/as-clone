import { useEffect, useState } from 'react'
import Navbar from './Navbar'
import Magazine from './Magazine'
import ChannelBar from './ChannelBar'
import ArtGrid from './ArtGrid'
import BottomRow from './BottomRow'
import './App.css'

function debounce(fn, ms) {
  let timer
  return _ => {
    clearTimeout(timer)
    timer = setTimeout(_ => {
      timer = null
      fn.apply(this, arguments)
    }, ms)
  }
}

function App() {
  const [ channel, setChannel ] = useState("")
  const [ option, setOption ] = useState("Community")

  useEffect(() => {
    const debouncedHandleResize = debounce(function handleResize() {
      const w = parseInt(window.innerWidth)
      const element = document.getElementById("app")
      if (element) {
        element.style.width = w.toString()+"px"
      }
    }, 10);
    debouncedHandleResize();
    window.addEventListener("resize", debouncedHandleResize);
    return _ => { window.removeEventListener("resize", debouncedHandleResize)};
  },[])

  return (
    <div id="app" className="w-screen">
      <Navbar />
      <ChannelBar id={"channelsTop"} channel={channel} setChannel={setChannel} setOption={setOption} />
      <Magazine />
      <ChannelBar id={"channelsMov"} channel={channel} setChannel={setChannel} setOption={setOption} />
      <ArtGrid channel={channel} />
      <BottomRow channel={channel} option={option} setOption={setOption} />
    </div>
  )
}

export default App
