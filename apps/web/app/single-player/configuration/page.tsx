import ConfigurationCard from "../../../components/atoms/ConfiguratinCard";
import SubmitBUtton from "../../../components/SubmitButton";

export default function Configuration() {
    return (
        <div className=" min-h-screen  text-pri ">
            <div className="flex flex-col items-center justify-center ">
                <div className="text-5xl font-medium mt-5">
                    Set your Configuration
                </div>
                <div className="mt-4 mb-8">
                    Configure your preference to the best of your comfort
                </div>

                <ConfigurationCard  heading={"Language"}/>
                <ConfigurationCard heading={"Topic"}  />
                <ConfigurationCard heading={"Question Type"} />
                <ConfigurationCard  heading={"Difficulty Level"}/>
                <ConfigurationCard  heading={"Question Length"}/>
                
            </div>
        </div>
    )
}