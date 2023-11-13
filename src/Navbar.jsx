import { useMediaQuery } from 'react-responsive'
import logo from '/ArtStation-logomark-dark.svg'
import upward from '/uploading-arrow.svg'
import notification from '/notifications-1.svg'
import message from '/message.svg'
import cart from '/Ic_shopping_cart_48px.svg'
import more from '/icons_90371.svg'
import search from '/search.svg'
import { AlignJustify, BookImage, ScrollText, Newspaper, Lightbulb, GraduationCap, Store, Image, Briefcase, FileText, Star, User, FileCheck2, Printer, TextQuote, Building2, HelpCircle, Mail, Facebook, Twitter, Instagram, LockKeyhole } from 'lucide-react'

const icon = {
    "Gallery": <BookImage/>,
    "Blogs": <ScrollText />,
    "Magazine": <Newspaper />,
    "Learning": <GraduationCap />,
    "Challenges": <Lightbulb />,
    "Find a School": <GraduationCap />,
    "Marketplace": <Store />,
    "Prints": <Image />,
    "Find a Job": <Briefcase />,
    "Post a Job": <FileText />,
    "Find an Artist": <User />,
    "Find a Studio": <Star />,
    "New Artwork": <Image />,
    "New Blog Post": <ScrollText />,
    "New Product": <FileCheck2 />,
    "New Print": <Printer />,
    "About ArtStation": <TextQuote />,
    "About Company": <Building2 />,
    "Help": <HelpCircle />,
    "Newsletter": <Mail />,
    "Facebook": <Facebook />,
    "Instagram": <Instagram />,
    "Twitter": <Twitter />,
    "Terms of Service": <ScrollText />,
    "Privacy Policy": <LockKeyhole />
}

function SearchBox() {
    return (
        <div className="flex flex-row mr-10">
            <input type="text" placeholder="    Search" className="input input-bordered border-gray-400 border-2 rounded-full h-10 bg-[rgb(23,23,23)] text-sm w-full" />
            <div className="absolute mt-2 ml-2 w-6"><img src={search}></img></div>
        </div>
    )
}

function Menu({data}) {
    function underline(title,bg) {
        const element = document.getElementById(title)
        if (element) {
            element.style.background = bg
        }
    }

    return (
        <div className="mr-5 flex flex-row">
            {data.map((item,i) => 
            <div key={i} className={ item.src ? "dropdown dropdown-end translate-y-1" : "dropdown dropdown-hover translate-y-3"}>
                <label tabIndex={0} className={ (item.src ? "" : "btn-md ") +"mr-2 border-0 text-gray-400 hover:text-gray-200 bg-[rgb(23,23,23)] flex flex-col items-center"} onMouseOver={()=>underline(item.title,"#00aaaa")} onMouseLeave={()=>underline(item.title,"#171717")}>
                    { !item.src && item.title }
                    { item.src && <img key={i} className="btn-circle scale-[45%]" src={item.src} ></img>}
                    <div id={item.title} className="mt-2 rounded h-[2px] w-full"></div>
                </label>
                { item.items && 
                <ul tabIndex={0} className="dropdown-content menu p-1 rounded-box rounded-md w-52 bg-opacity-100 bg-[rgb(33,33,33)]">
                    {item.items.map((text,i) =>
                        <li key={i} ><button className="m-1 bg-[rgb(33,33,33)] border-0 rounded-md hover:bg-[rgb(,66,66,66)] hover:border-0 text-gray-200 hover:text-gray-200">{icon[text]}{text}</button></li>
                    )}
                </ul>
                }
            </div>
                
            )}
        </div>
    )
}

function LeftMenu() {
    const data = [
        { title:"Explore", src:null, items:["Gallery", "Blogs", "Magazine"] }, 
        { title:"Learn", src:null, items:["Learning", "Challenges", "Find a School"] }, 
        { title:"Shop", src:null, items:["Marketplace", "Prints"] },
        { title:"Jobs", src:null, items:["Find a Job", "Post a Job", "Find an Artist", "Find a Studio"] }
    ]
    return <Menu data={data} />
}

function RightMenu() {
    const isDesktop = useMediaQuery({ minWidth: 992 });
    const data = [
        { title:"New", src:upward, items:["New Artwork", "New Blog Post", "New Product", "New Print"] }, 
        { title:"Notification", src:notification, items:null }, 
        { title:"Message", src:message, items:null },
        { title:"Cart", src:cart, items:null },
        { title:"Avatar", src:"https://cdna.artstation.com/p/users/avatars/000/451/414/medium/af41cdf9a64d921c5af7295182f4ccb4.jpg", items:null },
        { title:"More", src:more, items:["About ArtStation", "About Company", "Help", "Newsletter", "Facebook", "Instagram", "Twitter", "Terms of Service", "Privacy Policy"] }
    ]
    if (isDesktop) {
        return <Menu data={data} />
    }
    return <Menu data={[ { title:"Search", src:search, items:null} ].concat(data) } />
}

function Login() {
    return (
        <div className="flex flex-row">
        </div>
    )
}

function Navbar() {
    const isDesktop = useMediaQuery({ minWidth: 992 })
    const isMobile = useMediaQuery({ maxWidth: 767 })
    return (
        <div id="navbar" className="sticky top-0 flex justify-center items-center text-white h-20 bg-[rgb(23,23,23)] z-10">
            {( isMobile ? 
            <>
                <div className="flex-1 ml-5"><AlignJustify /></div>
                <div className="flex-1"><img className="w-[3em]" src={logo}></img></div>
                <div className="flex-none mr-5"><img className="btn-circle scale-[80%]" src="https://cdna.artstation.com/p/users/avatars/000/451/414/medium/af41cdf9a64d921c5af7295182f4ccb4.jpg"></img></div>
            </>
            :
            <>
                <div className="flex-initial"><img className="w-[4em]" src={logo}></img></div>
                <div className="flex-initial"><LeftMenu /></div>
                { isDesktop && <div className="flex-1 w-64"><SearchBox /></div> }
                <div className="flex-none"><RightMenu /></div>
                <div className="flex-none"><Login /></div>
            </>
            )}
        </div>
    )
}

export default Navbar