import { useContext, useState, useRef, useEffect } from "react";
import { MyContext } from "../../Components/Context/Context";
import { SlCalender } from "react-icons/sl";
import { MdOutlineDateRange } from "react-icons/md";
import { FaCarSide } from "react-icons/fa";
import { LuPanelBottomInactive } from "react-icons/lu";
// import { BsThreeDots } from "react-icons/bs";
import { LuPlusCircle } from "react-icons/lu";
import logo from '../../assets/profile-logo.png'
import message from '../../assets/facebook-messenger.svg'
// import { useEffect, useState } from "react";
// import normal from "../../assets/2201180.jpg"
import { FaMinus } from "react-icons/fa";
import { BsFillSendFill } from "react-icons/bs";
import Loader from "../../Components/Loader/Loader";
import SubBanner from "../../Components/Banner/SubBanner";
import Navbar from "../../Components/Navbar/Navbar";
import Footer from "../../Components/Footer/Footer";
import { IoAirplaneSharp } from "react-icons/io5";
// import { ConnectProvider, Connect } from 'react-connect-lines'
import { ArcherContainer, ArcherElement } from 'react-archer';
import useAxiosPublic from "../../Hooks/useAxiosPublic";
import Swal from "sweetalert2";
const RecommendationPage = () => {
    const [open, setOpen] = useState(false)
    const axiosPublic = useAxiosPublic();
    const initialMessages = {
        _id: 0,
        participants: [
            "user_id_1",
            "user_id_2"
        ],
        messages: [

        ]
    }
    const [messages, setMessages] = useState(initialMessages.messages)


    const { user, response, images } = useContext(MyContext);
    const element1Refs = useRef([]);
    const element2Refs = useRef([]);
    const [heights, setHeights] = useState([]);

    // console.log(images)

    useEffect(() => {
        if (response) {
            const newHeights = element1Refs.current.map(el => el?.offsetHeight || 0);
            setHeights(newHeights);
        }
    }, [response]);

    useEffect(() => {
        if (response) {
            element2Refs.current.forEach((el, index) => {
                if (el) {
                    el.style.height = `${heights[index]}px`;
                }
            });
        }
    }, [heights, response]);
    const [msgText, setMsgText] = useState("")

    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async () => {
        console.log(msgText)
        const newMsg = {
            _id: 1,
            sender: "user",
            content: msgText,
            timestamp: "no"
        }
        setMessages((prev) => [...prev, newMsg])
        setMsgText("")
        const res = await fetch("https://server.wandergeniellm.com/chat", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ text: msgText })
        })
        const data = await res.json();
        console.log(data)
        const reply = await data?.message?.content;
        console.log(reply)
        const replyMsg = {
            _id: 1,
            sender: "gpt",
            content: reply,
            timestamp: "no"
        }
        setMessages((prev) => [...prev, replyMsg])
    }
    // useEffect(() => {
    //     setResponse(response)
    // }, [response, setResponse])
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 2000);

        return () => clearTimeout(timer);
    }, [response]);
    if (!response || loading) {
        return <Loader /> // Display loading message while response is being fetched
    }




    const handleSendRequest = async () => {
        const travellerInfo = { name: user?.displayName, email: user?.email, photo: user?.photoURL }
        const itinerary = { response: response, images: images, traveller: travellerInfo, status: "pending", request: true }
        const res = await axiosPublic.post("/saved", itinerary);
        const data = res.data;
        if (data.insertedId) {
            const res = await axiosPublic.post("/requested", itinerary);
            const data = res.data;
            if (data.insertedId) {
                document.getElementById('finalize_modal').close()
                Swal.fire({
                    title: "Done",
                    text: "Saved and requested your itinerery",
                    icon: "success"
                });
            }

        }
    }
    const handleSave = async () => {
        const travellerInfo = { name: user?.displayName, email: user?.email, photo: user?.photoURL }
        const itinerary = { response: response, images: images, traveller: travellerInfo, status: "pending", request: false }
        const res = await axiosPublic.post("/saved", itinerary);
        const data = res.data;
        if (data.insertedId) {
            document.getElementById('finalize_modal').close()
            Swal.fire({
                title: "Done",
                text: "Saved your itinerery",
                icon: "success"
            });
        }
}

try {
    console.log(response)
    // const parsedData = JSON.parse(response);
    // console.log(JSON.parse(response?.message?.content))
    // const actualData = response?.message?.content
    // console.log(actualData)
    return (
        <div>
            <Navbar />
            <SubBanner />
            <div className="max-w-7xl mx-auto md:px-14 py-4 mt-14 relative  border-4 rounded-2xl px-6">
                <div className="border-2 p-6 mt-6 rounded-2xl">
                    <div className="flex justify-between items-center gap-4">
                        <div className="flex items-center gap-3">
                            <div className="text-green-500 flex flex-col justify-center cursor-pointer items-center gap-1 border-b-2 border-green-500 w-[130px] pb-3">
                                <SlCalender className="text-2xl" />
                                <h3 className="text-xl font-semibold">Day by Day</h3>
                            </div>
                            <div className="text-gray-500 flex flex-col justify-center cursor-pointer items-center gap-1 w-[130px] pb-3">
                                <MdOutlineDateRange className="text-2xl" />
                                <h3 className="text-xl font-semibold">Stays (3)</h3>
                            </div>
                            <div className="text-gray-500 flex flex-col justify-center cursor-pointer items-center gap-1 w-[140px] pb-3">
                                <FaCarSide className="text-2xl" />
                                <h3 className="text-xl font-semibold">Transfers(6)</h3>
                            </div>
                            <div className="text-gray-500 flex flex-col justify-center cursor-pointer items-center gap-1 w-[140px] pb-3">
                                <LuPanelBottomInactive className="text-2xl" />
                                <h3 className="text-xl font-semibold">Activities(5)</h3>
                            </div>
                            {/* <div className="text-gray-500 flex flex-col justify-center cursor-pointer items-center gap-1 w-[140px] pb-3">
                                <BsThreeDots className="text-2xl" />
                                <h3 className="text-xl font-semibold">More</h3>
                            </div> */}
                        </div>
                        <div>
                            <button onClick={() => document.getElementById('finalize_modal').showModal()} className="bg-[#1671E3] p-5 px-9 text-white font-bold">Finalize</button>

                            <dialog id="finalize_modal" className="modal">
                                <div className="modal-box scrollbar-hide">
                                    <form method="dialog">
                                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                                    </form>
                                    <div>
                                        <h2 className="text-2xl font-bold">What do you want to do ?</h2>
                                        <div className="mt-6">
                                            <button onClick={handleSendRequest} className="bg-blue-500 text-white px-4 py-1 rounded font-semibold mr-3 inline">Save and send request</button>
                                            <button onClick={handleSave} className="bg-red-300 text-white px-4 py-1 rounded font-semibold mr-3 inline">Save Only</button>
                                        </div>
                                    </div>
                                </div>
                            </dialog>
                        </div>
                    </div>
                </div>

                <div className="py-2">
                    <div className="flex">
                        <div className="w-full py-8">
                            {/* table .\ */}
                            <ArcherContainer strokeColor="gray">
                                {
                                    response?.itinerary?.map((city, index) => {
                                        return <div key={index} className="forChild flex items-start gap-12 justify-between mb-20 h-auto border-2 rounded-2xl p-4">
                                            <ArcherElement id={`element-${index}`}
                                                relations={[
                                                    { targetId: `element-${index + 1}`, targetAnchor: 'top', sourceAnchor: 'bottom', label: <div><IoAirplaneSharp className={`text-4xl text-gray-500 hover:text-blue-600 duration-200 cursor-pointer ${index % 2 !== 0 ? 'rotate-180' : ''}`} /></div> }
                                                ]}
                                            >
                                                <div className="w-[55%]">
                                                    <div ref={el => element1Refs.current[index] = el} className="main border-2 rounded-2xl w-full h-full">
                                                        {/* header  */}
                                                        <div className="flex justify-between items-center p-3">
                                                            <div className="font-bold">{city?.destination}<span className="ml-5 text-gray-500 font-semibold">{city?.travelDates?.start} to {city?.travelDates?.end}</span></div>

                                                            <div className="font-bold">{city?.destination} Trip Roadmap</div>
                                                        </div>
                                                        {/* row  */}
                                                        {
                                                            city?.dailyActivities?.map((item, index) => {
                                                                return <div key={index} className="flex justify-between items-center">
                                                                    <div className="border min-w-[90px] h-[140px] flex justify-center items-center text-gray-500 font-bold">{item?.day}</div>
                                                                    {
                                                                        item?.activities?.map((item, index) => {
                                                                            return <div key={index} className="border w-full h-[140px] p-3 overflow-hidden hover:bg-blue-50">
                                                                                <h2 className="text-gray-500 font-bold">{item?.time}</h2>
                                                                                {
                                                                                    item?.activity?.includes("Leisure") ? <div>
                                                                                        <p className="text-gray-500">Leisure</p>
                                                                                        <button onClick={() => document?.getElementById(`activity_modal_${index}`).showModal()} className="text-blue-500 font-bold">Add Activity + </button>
                                                                                        {/* You can open the modal using document.getElementById('ID').showModal() method */}
                                                                                        <dialog id={`activity_modal_${index}`} className="modal">
                                                                                            <div className="modal-box scrollbar-hide">
                                                                                                <form method="dialog">
                                                                                                    <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                                                                                                </form>
                                                                                                <div className="h-56">
                                                                                                    <h2 className="text-xl font-semibold">Write what do you want to do at this slot?</h2>
                                                                                                    <div className="my-3">
                                                                                                        <textarea name="activity" id={index} cols="30" rows="5" className="shadow rounded-xl border w-full px-4 py-2 resize-none outline-none" placeholder="Write Activity..."></textarea>
                                                                                                    </div>
                                                                                                    <div>
                                                                                                        <button className="bg-blue-500 text-white px-4 py-1 rounded font-semibold mr-3 inline">Save</button>
                                                                                                        <form className="inline" method="dialog"><button className="bg-red-300 text-white px-4 py-1 rounded font-semibold mr-3 inline">Close</button></form>
                                                                                                    </div>
                                                                                                </div>
                                                                                            </div>
                                                                                        </dialog>
                                                                                    </div> :
                                                                                        <p className="text-gray-500">{item?.activity}</p>
                                                                                }
                                                                                {/* <p className="text-gray-500">{item?.activity === "Leisure" ? `Leisure with button` : item?.activity}</p> */}
                                                                            </div>
                                                                        })
                                                                    }

                                                                </div>
                                                            })
                                                        }
                                                    </div>
                                                </div>
                                            </ArcherElement>
                                            <div className="w-[45%] h-full">
                                                {/* <img className="p-5" src={images[index]} alt="Nai" /> */}
                                                <img ref={el => element2Refs.current[index] = el} className="rounded-2xl w-full" src={images[index]} alt="imageS" />
                                            </div>
                                        </div>
                                    })
                                }
                            </ArcherContainer>
                        </div>
                        {/* <div className="col-span-5 p-4">
                            <img className="p-4" src={normal} alt="" />
                        </div> */}
                    </div>
                </div>
                {/* chatbot */}
                <div className={`flex justify-end`}>
                    <div className={`fixed duration-700 transition-all ease-in ${open ? 'bottom-10' : '-bottom-[2000px]'}`}>
                        <div className="relative w-[370px] h-calc-100vh-140px bg-white-300 inset-4 bg-gray-100 rounded-2xl">
                            <div className="flex justify-between items-center gap-2 p-3 rounded-tl-2xl rounded-tr-2xl border-b-4 border-[#252ECD] bg-gradient-to-r from-[#252ECD] to-[#04BBFB]">
                                <div className="flex gap-2">
                                    <img className="w-12 h-12 rounded-full" src={logo} alt="" />
                                    <div>
                                        <h2 className="text-xl font-bold text-white">Your Travel Planner</h2>
                                        <p className="text-sm text-white">Online</p>
                                    </div>
                                </div>
                                <h3 onClick={() => setOpen(false)} className="mr-4 text-xl cursor-pointer text-white" title="Close"><FaMinus /></h3>
                            </div>

                            <div className="py-3 overflow-y-scroll scrollbar-hide h-calc-100vh-278px">
                                {messages?.map((item, index) => {
                                    return <div className={`${item?.sender === "user" ? 'flex justify-end px-3 py-1 ml-12' : 'px-3 py-1 mr-12'}`} key={index}>
                                        <p className={`font-semibold py-2 px-5 w-fit overflow-hidden ${item?.sender === "user" ? item?.content.length > 70 ? "bg-gradient-to-br from-[#252ECD] to-[#04BBFB] text-white rounded-3xl" : "rounded-full bg-gradient-to-br from-[#252ECD] to-[#04BBFB] text-white" : item?.content.length <= 70 ? "rounded-full border border-[#04BBFB] text-gray-700" : "border rounded-3xl border-[#04BBFB] text-gray-700 w-[100%]"}`}>{item?.content}</p>
                                    </div>
                                })}
                                <div ref={messagesEndRef} />
                            </div>

                            <div className="absolute bottom-2 w-full flex items-center justify-between gap-2 px-4">
                                <LuPlusCircle className="font-bold text-4xl cursor-pointer" />
                                <input value={msgText} onKeyDown={e => { e.key === "Enter" && handleSendMessage() }} onChange={(e) => setMsgText(e.target.value)} className="outline-none w-full mx-auto bg-gray-200 rounded-lg px-3 py-2" placeholder="Type..." type="text" />
                                <BsFillSendFill onClick={handleSendMessage} className="font-bold text-5xl cursor-pointer bg-gradient-to-br from-[#252ECD] to-[#04BBFB] text-white rounded-full p-3 w-14 h-12" />
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    {/* icon  */}
                    <div onClick={() => setOpen(true)} className={`${open ? 'hidden' : 'fixed'} right-8 bottom-8 cursor-pointer`}>
                        <img className="w-12 h-12 rounded-full" src={message} alt="" />
                    </div>
                </div>
            </div>
            <Footer />
        </div>

    );
} catch (error) {
    console.error("Error parsing JSON:", error);
    return <p>Error: Invalid response format</p>; // Display error message if JSON parsing fails
}
};

export default RecommendationPage;