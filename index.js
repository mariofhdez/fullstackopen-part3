require('dotenv').config()

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const app = express();
const Person = require('./models/person')


app.use(cors())
app.use(express.json())
app.use(express.static('dist'))
app.use(morgan((tokens, req, res) => {
    return[
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req,res, 'content-length'), '-',
        tokens['response-time'](req, res), 'ms',
        JSON.stringify(req.body)
    ].join(' ')
}))

let persons = [
    {
      "name": "Arto Hellas",
      "number": "040-123456",
      "id": 1
    },
    {
      "name": "Ada Lovelace",
      "number": "39-44-5323523",
      "id": 2
    },
    {
      "name": "Dan Abramov",
      "number": "12-43-234345",
      "id": 3
    },
    {
      "name": "Mary Poppendieck",
      "number": "39-23-6423122",
      "id": 4
    }
]

app.get('/', (req, res) => {
    res.send('<h1>Phonebook</h1>')
})

app.get('/info', (req, res) => {
    const timeStamp = new Date()
    Person.find({}).then(persons => {
        res.send(`
            <p>Phonebook has info for ${persons.length} people</p>
            <p>${timeStamp}</p>
            `)
        
    })
})

app.get('/api/persons', (req, res) => {
    Person.find({}).then(persons => {
        res.json(persons)
    })
})

app.get('/api/persons/:id', (req, res, next) => {
    const id = req.params.id
    Person.findById(id).then(person => {
        if(person){
            res.json(person)
        } else {
            res.status(404).end()
        }
    }).catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res, error) => {
    const id = req.params.id
    Person.findByIdAndDelete(id)
        .then(result => {
            res.status(204).end()
        })
        .catch(error => next(error))
})


app.post('/api/persons', (req, res) => {
    const body = req.body

    if(body.name === undefined || body.number === undefined){
        return res.status(400).json({
            error: 'name or number missing'
        })
    }

    // const person = persons.find(p => p.name === body.name)

    // if (typeof (person) === 'object') {
    //     return res.status(400).json({
    //         error: 'name must be unique'
    //     })
    // }

    const newPerson = new Person({
        name: body.name,
        number: body.number,
    })

    newPerson.save().then(savedPerson => {
        res.json(savedPerson)
    })
})

app.put('/api/persons/:id', (req, res, next) => {
    const body = req.body

    const person = {
        name: body.name,
        number: body.number,
    }

    Person.findByIdAndUpdate(req.params.id, person, { new: true })
        .then(updatedPerson => {
            res.json(updatedPerson)
        })
        .catch(error => next(error))
})

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})

// function generateId() {
//     return Math.floor(Math.random() * 1000000);
// }

const errorHandler = (error, req, res, next) => {
    console.log(error.message);

    if(error.name === 'CastError'){
        return res.status(400).send({ error: 'malformatted id'})
    }
}
app.use(errorHandler)