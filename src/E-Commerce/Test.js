import axios from "axios"
import { useEffect } from "react"

export const Test=()=>{
    useEffect(()=>{
        const process=async()=>{
            const res = await axios.post(`${process.env.REACT_APP_API_URL_GRACELAB}/api/test`)
            console.log(res)
        }
        console.log("ppppppppp")
        process()
    },[])
    return(

        <>
        </>
    )
}