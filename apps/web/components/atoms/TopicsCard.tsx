

type Props = {
    field: string
    selected: string,
    onClick: () => void
}

export default function TopicsCard({ field, selected , onClick  }: Props) {
    const isSelected = selected.toLowerCase().trim() === field.toLowerCase().trim()
    console.log("option : ", selected.toLowerCase().trim() === field.toLowerCase().trim())
    return (
        <div
            onClick={onClick}
            className={`cursor-pointer flex justify-center bg-bg px-14 py-2 rounded-md my-2 mr-2 border-2 transition-all duration-200 ease-in-out ${
                isSelected
                    ? "border-accent scale-105"
                    : "border-border hover:border-accent hover:scale-105"
            }`}
        >
            {field}
        </div>
    )
}