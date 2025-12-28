import { useState } from "react"

function Filter({ handleFilter }) {
    const [filter, setFilter] = useState('')

    const handleFilterChange = (e) => {
        setFilter(e.target.value)
        handleFilter(e.target.value)
    }
    return (
        <div>
            Filter shown with <input type="text" onChange={handleFilterChange} value={filter} />
        </div>
    )
}

export default Filter