import { getServerSession } from "next-auth"
import { authOptions } from "../lib/configs/authOptions"
import { redirect } from "next/navigation"

export default async function Home(){
  const session = await getServerSession(authOptions)
  if(!session){
    redirect('/api/auth/signin')
  }
  return (
    <div>
      hello world

    </div>
  )
}