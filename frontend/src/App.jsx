import { useState, useEffect } from 'react'

import ContactForm from './components/ContactForm'
import Contacts from './components/Contacts'
import Filter from './components/Filter'

import personService from './service/persons'
import Notification from './components/Notification'

function App() {
  const [persons, setPersons] = useState([])
  const [contactsToShow, setContactsToShow] = useState([])
  const [message, setMessage] = useState({
    message: null,
    type: null
  })

  //initial data
  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
        setContactsToShow(initialPersons)
      })
  }, [])

  // handler data to be showed
  const handleFilter = (filter) => {
    if (filter === "") {
      setContactsToShow(persons)
    } else {
      setContactsToShow(persons.filter(p => p.name.toLowerCase().includes(filter.toLowerCase())))
    }
  }

  // insert contact
  const addPerson = (newPerson) => {

    const person = persons.find(p => p.name === newPerson.name)

    if (typeof (person) === 'object') {
      if (!confirm(`${newPerson.name} is already added to phonebook, replace the old number with a new one?`)) {
        return
      } else {
        const changedPerson = { ...person, number: newPerson.number }
        personService
          .update(person.id, changedPerson)
          .then(returnedPerson => {
            setPersons(persons.map(p => p.id !== person.id ? p : returnedPerson))
            setContactsToShow(persons.map(p => p.id !== person.id ? p : returnedPerson))
          })
          .then(() => {
            setMessage({
              message: `Updated ${newPerson.name}`,
              type: 'success'
            })
            setTimeout(() => {
              setMessage({
                message: null,
                type: null
              })
            }, 5000)
          }).catch(error => {
            console.log(error);
            setMessage({
              message: `Information of ${newPerson.name} has already been removed from server`,
              type: 'error'
            })
            setTimeout(() => {
              setMessage({
                message: null,
                type: null
              })
            }, 5000)
          })
      }
    } else {
      personService
        .create(newPerson)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          setContactsToShow(persons.concat(returnedPerson))
        })
          .then(() => {
            setMessage({
              message: `Added ${newPerson.name}`,
              type: 'success'
            })
            setTimeout(() => {
              setMessage({
                message: null,
                type: null
              })
            }, 5000)
          })
    }

  }

  // delete person
  const deletePerson = (id) => {
    const person = persons.find(p => p.id === id)
    if (
      !confirm(`Delete ${person ? person.name : null}?`)
    ) {
      return
    }
    personService
      .destroy(id)
      .then(response => {
        setPersons(persons.filter(p => p.id !== id))
        setContactsToShow(persons.filter(p => p.id !== id))
      })
      .catch(error => {
        console.error("Error al eliminar:", error);
      })
  }


  return (
    <>
      <h2>Phonebook</h2>
      <Notification message={message.message} type={message.type} />
      <Filter handleFilter={handleFilter} />
      <h2>Add a new contact</h2>
      <ContactForm onAdd={addPerson} persons={persons} />
      <h2>Contacts</h2>
      <Contacts persons={contactsToShow} onDelete={deletePerson} />
    </>
  )
}

export default App
