import { MouseEvent as ReactMouseEvent, useRef, useState, useEffect } from "react"
import { useMediaQuery } from 'react-responsive'
import { motion, useMotionValue, useSpring, type PanInfo } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"
import more from '/icons_250793.svg'
import allChannels from '/All Channels.svg'
import channels from './channels.json'

function ChannelSearch() {
  return (
    <div className="absolute top-50 left-50">
      Hello
    </div>
  )
}

function ChannelButton({tex, src, wid="40", onclick}) {
  return (
    <button className={"w-"+wid+" flex flex-none rounded-[16px] flex-row items-center ml-2 px-0 bg-[rgb(23,23,23)] border-0 hover:bg-[rgb(43,43,43)] hover:border-0 focus:bg-[rgb(33,33,33)] focus:border-0"} onClick={() => onclick()}>
      { src && <img className="rounded-[8px] ml-1 h-10 w-10 border-0 object-cover object-[48%_10%]" src={src}></img>}
      <div className="ml-2 text-sm">{tex}</div>
    </button>
  )
}

const START_INDEX = 1
const DRAG_THRESHOLD = 150
const FALLBACK_WIDTH = 509

const CURSOR_SIZE = 80

function ChannelSelect({setChannel, setOption}) {
  const containerRef = useRef<HTMLUListElement>(null)
  const itemsRef = useRef<(HTMLLIElement | null)[]>([])
  const [activeSlide, setActiveSlide] = useState(START_INDEX)
  const canScrollPrev = activeSlide > 0
  const canScrollNext = activeSlide < channels.length - 1
  const offsetX = useMotionValue(0)
  const animatedX = useSpring(offsetX, {
    damping: 20,
    stiffness: 150,
  })

  const [isDragging, setIsDragging] = useState(false)
  function handleDragSnap(
    _: MouseEvent,
    { offset: { x: dragOffset } }: PanInfo,
  ) {
    //reset drag state
    setIsDragging(false)
    containerRef.current?.removeAttribute("data-dragging")

    //stop drag animation (rest velocity)
    animatedX.stop()

    const currentOffset = offsetX.get()

    //snap back if not dragged far enough or if at the start/end of the list
    if (
      Math.abs(dragOffset) < DRAG_THRESHOLD ||
      (!canScrollPrev && dragOffset > 0) ||
      (!canScrollNext && dragOffset < 0)
    ) {
      animatedX.set(currentOffset)
      return
    }

    let offsetWidth = 0
    /*
      - start searching from currently active slide in the direction of the drag
      - check if the drag offset is greater than the width of the current item
      - if it is, add/subtract the width of the next/prev item to the offsetWidth
      - if it isn't, snap to the next/prev item
    */
    for (
      let i = activeSlide;
      dragOffset > 0 ? i >= 0 : i < itemsRef.current.length;
      dragOffset > 0 ? i-- : i++
    ) {
      const item = itemsRef.current[i]
      if (item === null) continue
      const itemOffset = item.offsetWidth

      const prevItemWidth =
        itemsRef.current[i - 1]?.offsetWidth ?? FALLBACK_WIDTH
      const nextItemWidth =
        itemsRef.current[i + 1]?.offsetWidth ?? FALLBACK_WIDTH

      if (
        (dragOffset > 0 && //dragging left
          dragOffset > offsetWidth + itemOffset && //dragged past item
          i > 1) || //not the first/second item
        (dragOffset < 0 && //dragging right
          dragOffset < offsetWidth + -itemOffset && //dragged past item
          i < itemsRef.current.length - 2) //not the last/second to last item
      ) {
        dragOffset > 0
          ? (offsetWidth += prevItemWidth)
          : (offsetWidth -= nextItemWidth)
        continue
      }

      if (dragOffset > 0) {
        //prev
        offsetX.set(currentOffset + offsetWidth + prevItemWidth)
        setActiveSlide(i - 1)
      } else {
        //next
        offsetX.set(currentOffset + offsetWidth - nextItemWidth)
        setActiveSlide(i + 1)
      }
      break
    }
  }

  function scrollPrev() {
    for (let i=0; i<5; i++) {
      //prevent scrolling past first item
    if (!canScrollPrev) return

    const nextWidth = itemsRef.current
      .at(activeSlide - 1)
      ?.getBoundingClientRect().width
    if (nextWidth === undefined) return
    offsetX.set(offsetX.get() + nextWidth)

    setActiveSlide((prev) => prev - 1)
    }
  }
  function scrollNext() {
    for (let i=0; i<5; i++) {
      // prevent scrolling past last item
    if (!canScrollNext) return

    const nextWidth = itemsRef.current
      .at(activeSlide + 1)
      ?.getBoundingClientRect().width
    if (nextWidth === undefined) return
    offsetX.set(offsetX.get() - nextWidth)

    setActiveSlide((prev) => prev + 1)
    }
  }

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  function navButtonHover({
    currentTarget,
    clientX,
    clientY,
  }: ReactMouseEvent<HTMLButtonElement, MouseEvent>) {
    const parent = currentTarget.offsetParent
    if (!parent) return
    const { left: parentLeft, top: parentTop } = parent.getBoundingClientRect()

    const { left, top, width, height } = currentTarget.getBoundingClientRect()
    const centerX = left + width / 2
    const centerY = top + height / 2

    const offsetFromCenterX = clientX - centerX
    const offsetFromCenterY = clientY - centerY

    mouseX.set(left - parentLeft + offsetFromCenterX / 4)
    mouseY.set(top - parentTop + offsetFromCenterY / 4)
  }

  function disableDragClick(e: ReactMouseEvent<HTMLAnchorElement>) {
    if (isDragging) {
      e.preventDefault()
      e.stopPropagation()
    }
  }

  function ChannelButton({channel, index}) {
    return (
      <motion.li
        layout
        key={channel.tex}
        ref={(el) => (itemsRef.current[index] = el)}
        className="group relative shrink-0 select-none px-1 transition-opacity duration-300"
        transition={{
          ease: "easeInOut",
          duration: 0.4,
        }}
      >
        <button className={"w-"+channel.wid+" flex flex-none rounded-[16px] flex-row items-center ml-2 px-0 bg-[rgb(23,23,23)] border-0 hover:bg-[rgb(43,43,43)] hover:border-0 focus:bg-[rgb(33,33,33)] focus:border-0"} onClick={() => {setChannel(channel.tex);setOption("Trending");}}>
          { channel.src && <img className="rounded-[8px] ml-1 h-10 w-10 border-0 object-cover object-[48%_10%]" src={channel.src}></img>}
          <div className="ml-2 text-sm">{channel.tex}</div>
        </button>
      </motion.li>
    )
  }
    
  return (
    <div className="relative overflow-hidden ml-2 ">
      <motion.ul
        ref={containerRef}
        className="flex cursor-none items-start items-center "
        style={{
          x: animatedX,
        }}
        drag="x"
        dragConstraints={{
          left: -(FALLBACK_WIDTH * (channels.length - 1)),
          right: FALLBACK_WIDTH,
        }}
        onMouseMove={({ currentTarget, clientX, clientY }) => {
          const parent = currentTarget.offsetParent
          if (!parent) return
          const { left, top } = parent.getBoundingClientRect()
          mouseX.set(clientX - left - CURSOR_SIZE / 2)
          mouseY.set(clientY - top - CURSOR_SIZE / 2)
        }}
        onDragStart={() => {
          containerRef.current?.setAttribute("data-dragging", "true")
          setIsDragging(true)
        }}
        onDragEnd={handleDragSnap}
      >
        {channels.map((channel, index) => <ChannelButton key={index} channel={channel} index={index}/>)}
      </motion.ul>
      <button
        className="absolute scale-[33%] text-black bg-white left-0 -top-2  grid aspect-square place-content-center rounded-full transition-colors border-0 hover:border-0"
        style={{
          width: CURSOR_SIZE,
          height: CURSOR_SIZE,
        }}
        onClick={scrollPrev}
        disabled={!canScrollPrev}
        onMouseMove={(e) => navButtonHover(e)}
      >
        <ChevronLeft className="h-12 w-12" />
      </button>
      <button
        className="absolute scale-[33%] text-black bg-white right-0 -top-2  grid aspect-square place-content-center rounded-full transition-colors border-0 hover:border-0"
        style={{
          width: CURSOR_SIZE,
          height: CURSOR_SIZE,
        }}
        onClick={scrollNext}
        disabled={!canScrollNext}
        onMouseMove={(e) => navButtonHover(e)}
      >
        <ChevronRight className="h-12 w-12" />
      </button>
    </div>
  )
}

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

function ChannelBar({id, channel, setChannel, setOption}) {
  useEffect(() => {
    const debouncedHandleResize = debounce(function handleResize() {
      const element = document.getElementById("channelsMov")
      const navbar = document.getElementById("navbar")
      const top = document.getElementById("channelsTop")
      if (element && navbar) {
        const rect = element.getBoundingClientRect()
        const navrect = navbar.getBoundingClientRect()
        if (rect.top < navrect.bottom) {
          top.style.visibility = "visible"
        } else {
          top.style.visibility = "hidden"
        }
      }
    });
    debouncedHandleResize();
    window.addEventListener("scroll", debouncedHandleResize);
    return _ => { window.removeEventListener("scroll", debouncedHandleResize)};
  },[])

  function openChannelSearch() {
    return ( <ChannelSearch/> )
  }

  const isDesktop = useMediaQuery({ minWidth: 992 });

  return (
    <div id={id} className={(id=="channelsTop" ? "fixed z-10" : "relative")+" p-2 flex items-center bg-[rgb(23,23,23)] text-gray-200 w-full"}>
      <img className="flex flex-none btn w-12 h-12 bg-[rgb(48,48,48)] border-0 hover:bg-[rgb(88,88,88)]" src={more} onClick={() => openChannelSearch()}></img>
      { isDesktop && <ChannelButton tex={"All Channels"} src={allChannels} onclick={() => {setChannel("");setOption("Community");}} /> }
      <ChannelSelect setChannel={setChannel} setOption={setOption} />
    </div>
  )
}

export default ChannelBar