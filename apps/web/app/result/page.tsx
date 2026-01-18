import { getServerSession } from "next-auth"
import { authOptions } from "../../lib/configs/authOptions"
import { redirect } from "next/navigation"
import Analysis from "../../components/Analysis"

export default async function Result(){
    const session = await getServerSession(authOptions)
    if(!session?.user){
        redirect('/signin')
    }
    
    return (
        <div>
            <Analysis/>
        </div>
    )
}