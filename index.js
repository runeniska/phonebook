require('dotenv').config()
const PORT = process.env.PORT
const Person = require('./models/person')
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()

morgan.token('body', (req, _) => JSON.stringify(req.body))
const logger = morgan(':method :url :status :res[content-length] - :response-time ms :body')

app.use(express.json())
app.use(express.static('build'))
app.use(logger)
app.use(cors())


// GET
app.get('/api/persons', (req, res) => {
    Person.find({}).then(personList => res.json(personList))
})

app.get('/info', (req, res) => {
    const date = new Date()
    Person.find({}).then(personList => res.send(
        `<p>Phonebook has info for ${personList.length} people</p>
        <p>${date}</p>`
    ))
})

app.get('/api/persons/:id', (req, res) => {
    Person.findById(req.params.id).then(person => res.json(person))
})


// POST
app.post('/api/persons', (req, res) => {
    const body = req.body
    const name = body.name
    const number = body.number

    const person = new Person({
        name: name,
        number: number,
    })

    person.save().then(savedPerson => res.json(savedPerson))
})


// DELETE
app.delete('/api/persons/:id', (req, res) => {
    Person.findByIdAndRemove(req.params.id).then(result => res.status(204).end())
})


// Run
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})