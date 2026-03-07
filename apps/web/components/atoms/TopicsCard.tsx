
type Props = {
field:string
selected: string
}

export default function TopicsCard({field , selected }: Props ){
    return (
        <div className={`flex justify-center bg-bg px-14 py-2 rounded-md my-2 mr-2 border-2 border-border hover:border-accent ${selected.toLowerCase() === field.toLowerCase() ?" border-accent" : null }`}>
            {field}
        </div>
    )
}