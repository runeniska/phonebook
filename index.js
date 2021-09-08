require('dotenv').config()
const PORT = process.env.PORT
const Person = require('./models/person')
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const { response } = require('express')

const app = express()

morgan.token('body', (req, _) => JSON.stringify(req.body))
const logger = morgan(':method :url :status :res[content-length] - :response-time ms :body')

app.use(express.json())
app.use(express.static('build'))
app.use(logger)
app.use(cors())


// GET
app.get('/api/persons', (req, res, next) => {
    Person.find({})
        .then(personList => res.json(personList))
        .catch(error => next(error))
})

app.get('/info', (req, res, next) => {
    const date = new Date()
    Person.find({})
        .then(personList => res.send(
            `<p>Phonebook has info for ${personList.length} people</p>
            <p>${date}</p>`
        ))
        .catch(error => next(error))
})

app.get('/api/persons/:id', (req, res, next) => {
    Person.findById(req.params.id)
        .then(person => {
            if (person)
                res.json(person)
            else
                response.status(404).end()
        })
        .catch(error => next(error))
})


// POST
app.post('/api/persons', (req, res, next) => {
    const body = req.body
    const name = body.name
    const number = body.number

    const person = new Person({
        name: name,
        number: number,
    })

    person.save().then(savedPerson => res.json(savedPerson)).catch(error => next(error))
})


// DELETE
app.delete('/api/persons/:id', (req, res, next) => {
    Person.findByIdAndRemove(req.params.id)
        .then(_ => res.status(204).end())
        .catch(error => next(error))
})


// Handlers
const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
    console.error(error.message)
    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
    }
    next(error)
}

app.use(unknownEndpoint)
app.use(errorHandler)


// Run
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})