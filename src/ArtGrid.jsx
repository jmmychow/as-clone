import { useEffect, useRef } from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import ArtCard from './ArtCard'
import cards from './cards.json'

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

function cardSize() {
    const winWidth = window.innerWidth+180
    const n = Math.ceil(winWidth / 220)
    return parseInt(winWidth / n).toString()+"px"
}

function ArtGrid({channel}) {
    useEffect(() => {
        const debouncedHandleResize = debounce(function handleResize() {
            const size = cardSize()
            cards.map((e,i) => {
                const element = document.getElementById("artcard"+i.toString())
                if (element) {
                    element.style.width = size
                    element.style.height = size
                }
            })
        }, 10);
    
        debouncedHandleResize();
        window.addEventListener("resize", debouncedHandleResize);
        return _ => { window.removeEventListener("resize", debouncedHandleResize)};
    },[])

    return (
        <>
            <div className="text-3xl font-bold text-white mb-5">{ channel ? channel : "All Channels"}</div>
            <Container fluid>
                <Row>
                    <Col>
                        {cards.map((item,i) => <ArtCard key={i} id={"artcard"+i.toString()} item={item} />)}
                    </Col>
                </Row>
            </Container>
        </>
    );
}

export default ArtGrid