const PORT = 3001

const express = require('express')
const app = express()

const morgan = require('morgan')
const logger = morgan('tiny')

app.use(express.json())
app.use(logger)

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


// Functions
const generateId = () => {
    const id = Math.floor(Math.random() * 1000000)
    return id
}


// GET
app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/info', (req, res) => {
    const date = new Date()
    res.send(
        `<p>Phonebook has info for ${persons.length} people</p>
        <p>${date}</p>`
    )
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(p => p.id === id)

    if (person)
        res.json(person)
    else
        res.status(404).end()
})


// POST
app.post('/api/persons', (req, res) => {
    const body = req.body
    const name = body.name
    const number = body.number

    if (!name)
        return res.status(400).json({ error: 'name missing' })
    else if (!number)
        return res.status(400).json({ error: 'number missing'})
    else if (persons.find(p => p.name === name))
        return res.status(400).json({ error: 'name already exists in the phonebook'})

    const person = {
        name: name,
        number: number,
        id: generateId()
    }

    persons = persons.concat(person)

    res.json(person)
})


// DELETE
app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(p => p.id !== id)

    res.status(204).end()
})

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})