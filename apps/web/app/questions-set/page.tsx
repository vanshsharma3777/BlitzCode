import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../../lib/configs/authOptions";
import RenderQuestion from "../../components/RenderQuestions";


export default async function Username(){

  const session =await getServerSession(authOptions);
  if(!session?.user){
    redirect('/signin')
  }
  console.log(session)
  return(
    <div>
        <RenderQuestion></RenderQuestion>
        </div>
  )
}