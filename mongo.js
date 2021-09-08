const mongoose = require('mongoose')

const size = process.argv.length
const password = process.argv[2]
const name = process.argv[3]
const number  = process.argv[4]
const url = `mongodb+srv://fullstack:${password}@cluster0.ubsyb.mongodb.net/phonebook?retryWrites=true&w=majority`
const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})
const Person = mongoose.model('Person', personSchema)

// Add person to phonebook
const addPerson = () => {
  mongoose.connect(url)

  const person = new Person({
    name: name,
    number: number,
  })

  person.save().then(_ => {
    console.log(`added ${name} number ${number} to phonebook`)
    mongoose.connection.close()
  })
}

// List people in the phonebook
const listPeople = () => {
  mongoose.connect(url)

  console.log('phonebook:')
  Person.find({}).then(result => {
    result.forEach(person => {
      console.log(`${person.name} ${person.number}`)
    })
    mongoose.connection.close()
  })
}

if (size < 3) {
  console.log('give password as argument')
  process.exit(1)
} else if (size === 3) {
  listPeople()
} else if (size === 4) {
  console.log('give password, name and number as arguments to save contact')
  process.exit(1)
} else if (size === 5) {
  addPerson()
} else {
  process.exit(1)
}