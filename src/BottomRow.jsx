import { useMediaQuery } from 'react-responsive'
import { Grid3X3, ListFilter, AlignJustify } from 'lucide-react'

function GridOption () {
    return (
        <div className="btn btn-circle btn-white flex flex-0 items-center"><Grid3X3 /></div>
    )
}

function ListOption ({channel, option, setOption}) {
    const options = ( channel ? [ "Trending", "Lastest" ] : [ "Community", "Trending", "Lastest", "Following" ] )
    const isMobile = useMediaQuery({ maxWidth: 767 })

    return (
        <div className="flex-1 justify-center">
            <div className="rounded-full bg-white flex flex-row items-center">
            {( isMobile ?
                <button className="rounded-full mx-8 h-12 border-0 hover:border-0 bg-white text-black flex flex-row items-center" >Community <div className="ml-5"><AlignJustify /></div></button>
            :
                options.map((text,i) => 
                    <button key={i} className={"rounded-full m-1 px-5 border-0 hover:border-0 " + (option==text ? "bg-black text-white" : "bg-white text-black")} onClick={() => setOption(text)}>{text}</button>
                )
            )}
            </div>
        </div>
    )
}

function HideOption () {
    return (
        <div className="btn btn-circle btn-white flex flex-0 items-center -translate-x-[3rem]"><ListFilter /></div>
    )
}

function BottomRow({channel, option, setOption}) {
    const isMobile = useMediaQuery({ maxWidth: 767 })
    return (
        <div className="footer sticky bottom-4 flex">
            { !isMobile && <GridOption /> }
            <ListOption channel={channel} option={option} setOption={setOption} />
            <HideOption />
        </div>
    );
}

export default BottomRow