
type Props = {
field:string
selected: string
}

export default function TopicsCard({field , selected }: Props ){
    console.log("selected: ", selected)
    return (
        <div className={`flex justify-center bg-bg px-14 py-2 rounded-md my-2 mr-2 border-2 border-border hover:border-accent transition-all duration-200 ease-in-out hover:scale-105 ${selected.toLowerCase() === field.toLowerCase() ? "border-[#5E6AD2] transition-all duration-200 ease-in-out scale-105" : null }`}>
            {field}
        </div>
    )
}