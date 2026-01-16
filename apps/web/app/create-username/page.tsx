import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/configs/authOptions";
import CreateProfile from "../../components/createProfile";
import { redirect } from "next/navigation";

export default async function Username(){

  const session =await getServerSession(authOptions);
  if(!session?.user){
    redirect('/api/auth/signin')
  }
  return(
    <div>
      <CreateProfile email={session.user.email!}></CreateProfile>
    </div>
  )
}