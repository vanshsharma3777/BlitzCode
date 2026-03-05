'use client'

import { Socket } from "dgram";
import { useEffect, useRef, useState } from "react";

export default function check(){
    const [data , setData ]= useState()
    const [email , setEmail ]= useState("")
    const socketRef = useRef<WebSocket | null>(null)

    useEffect(()=>{
        const socket = new WebSocket("ws://localhost:8080");
        socketRef.current = socket;
            socket.onopen = ()=>{
            console.log("Socket connected")
        }

        socket.onmessage = (msg)=>{
            const receivedData = JSON.parse(msg.data);
            console.log("data came from web scoket :" , receivedData)
            setData(receivedData)
        }

        socket.onclose = () =>{
            console.log("Web socket server: Disconnected")
        }

        return () =>{
            socket.close();
        }
    }, [socketRef])

    function startGame(){
        console.log("email : " , email)
        if(!socketRef.current){
            return null
        }
        socketRef.current.send(JSON.stringify({
            type:"AUTH",
            meta:{
                emailId:email
            }
        }))
    }
    return (
        <div>
            <div>Web scocket connection trial</div>
            <input onChange={(e)=>{
                setEmail(e.target.value)
            }} type="text" placeholder="Enter your emails"/>
            <button onClick={startGame}>Send Email</button>

        </div>
    )
}