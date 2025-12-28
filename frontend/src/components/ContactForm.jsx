import { useState } from "react"

function ContactForm({ onAdd }) {
    const [newName, setNewName] = useState('')
    const [newNumber, setNewNumber] = useState('')

    const handleNameChange = (e) => {
        setNewName(e.target.value)
    }

    const handleNumberChange = (e) => {
        setNewNumber(e.target.value)
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        const newPerson = {
            name: newName,
            number: newNumber
        }

        onAdd(newPerson)
        setNewName('')
        setNewNumber('')
    }

    return (
        <form onSubmit={handleSubmit}>
            <div>
                name: <input onChange={handleNameChange} value={newName} type="text" />
            </div>
            <div>
                number: <input onChange={handleNumberChange} value={newNumber} type="text" />
            </div>
            <div>
                <button type='submit' >Add</button>
            </div>
        </form>
    )
}

export default ContactForm