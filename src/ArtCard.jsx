import { useAnimate, motion } from 'framer-motion'

function ArtCard({id, item}) {
    const [ div, animateDiv ] = useAnimate()
    const [ img, animateImg ] = useAnimate()

    function enterAnimation() {
        animateDiv(div.current, { x: 100 }, { duration: 0.3, ease: "easeIn", delay: 0.4 })
        animateImg(img.current, { opacity: 0.5 }, { duration: 0.3, ease: "easeIn", delay: 0.3 })
    }

    function exitAnimation() {
        animateDiv(div.current, { x: -100 }, { duration: 0.3, ease: "easeIn"  })
        animateImg(img.current, { opacity: 1 }, { duration: 0.3, ease: "easeIn" })
    }

    return (
        // 1. Must return component of type 'button' or 'div' having 'btn' in className
        // 2. className must not have 'flex'
        // otherwise responsive grid of vairable number of columns in a row won't work
        <button id={id} className="m-0 p-0 bg-[rgb(23,23,23)] rounded border-0">
            <div className="relative overflow-hidden">
                <motion.div
                    initial={{ x: -100, opacity: 0, scale: 0 }}
                    animate={{ x: 0, opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                >
                    <img ref={img} className="m-1 rounded-md" src={item.src} onMouseOver={enterAnimation} onMouseLeave={exitAnimation}></img>
                </motion.div>
                <div ref={div} className="absolute mb-4 -left-[100px] bottom-0 flex flex-row items-left w-full">
                    <img className="btn-circle border-0 w-[48px] scale-[80%]" src={item.icon}></img>
                    <div className="flex flex-col text-left">
                        <div className="text-xs text-white w-[150px]">{item.title}</div>
                        <div className="text-xs text-gray-400 w-[150px]">{item.name}</div>
                    </div>
                </div>
            </div>
        </button>
    );
}

export default ArtCard