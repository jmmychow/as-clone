import { MouseEvent as ReactMouseEvent, useRef, useState } from "react"
import { motion, useMotionValue, useSpring, type PanInfo } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"
import magazines from "./magazines.json"

const START_INDEX = 1
const DRAG_THRESHOLD = 150
const FALLBACK_WIDTH = 509

const CURSOR_SIZE = 80

function Magazine() {
  const containerRef = useRef<HTMLUListElement>(null)
  const itemsRef = useRef<(HTMLLIElement | null)[]>([])
  const [activeSlide, setActiveSlide] = useState(START_INDEX)
  const canScrollPrev = activeSlide > 0
  const canScrollNext = activeSlide < magazines.length - 1
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
    //prevent scrolling past first item
    if (!canScrollPrev) return

    const nextWidth = itemsRef.current
      .at(activeSlide - 1)
      ?.getBoundingClientRect().width
    if (nextWidth === undefined) return
    offsetX.set(offsetX.get() + nextWidth)

    setActiveSlide((prev) => prev - 1)
  }
  function scrollNext() {
    // prevent scrolling past last item
    if (!canScrollNext) return

    const nextWidth = itemsRef.current
      .at(activeSlide + 1)
      ?.getBoundingClientRect().width
    if (nextWidth === undefined) return
    offsetX.set(offsetX.get() - nextWidth)

    setActiveSlide((prev) => prev + 1)
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

  function Article({article, index}) {
    return (
      <motion.li
        layout
        key={article.title}
        ref={(el) => (itemsRef.current[index] = el)}
        className="group relative shrink-0 select-none px-1 transition-opacity duration-300"
        transition={{
          ease: "easeInOut",
          duration: 0.4,
        }}
      >
        <a
          href={article.url}
          className="block"
          target="_blank"
          rel="noopener noreferrer"
          draggable={false}
          onClick={disableDragClick}
        >
          <motion.div
            whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
          >
            <img className="rounded-xl h-48" src={article.src} draggable={false}></img>
          </motion.div>
          <div className="absolute m-5 bottom-0">
            <div className="font-bold text-2xl text-white">{article.title}</div>
            <div className="font-bold text-gray-400">{article.title2}</div>
          </div>
        </a>
      </motion.li>
    )
  }
  
  return (
    <div className="relative overflow-hidden">
      <motion.ul
        ref={containerRef}
        className="flex cursor-none items-start"
        style={{
          x: animatedX,
        }}
        drag="x"
        dragConstraints={{
          left: -(FALLBACK_WIDTH * (magazines.length - 1)),
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
        {magazines.map((article, index) => <Article key={index} article={article} index={index}/>)}
      </motion.ul>
      <button
        className="absolute scale-[50%] bg-black bg-opacity-50 left-0 top-1/3 grid aspect-square place-content-center rounded-full transition-colors border-0 hover:border-0"
        style={{
          width: CURSOR_SIZE,
          height: CURSOR_SIZE,
        }}
        onClick={scrollPrev}
        disabled={!canScrollPrev}
        onMouseMove={(e) => navButtonHover(e)}
      >
        <ChevronLeft className="h-12 w-12 rounded-box text-gray-400" />
      </button>
      <button
        className="absolute scale-[50%] bg-black bg-opacity-50 right-0 top-1/3 grid aspect-square place-content-center rounded-full transition-colors border-0 hover:border-0"
        style={{
          width: CURSOR_SIZE,
          height: CURSOR_SIZE,
        }}
        onClick={scrollNext}
        disabled={!canScrollNext}
        onMouseMove={(e) => navButtonHover(e)}
      >
        <ChevronRight className="h-12 w-12 rounded-box text-gray-400" />
      </button>
    </div>
  )
}

export default Magazine