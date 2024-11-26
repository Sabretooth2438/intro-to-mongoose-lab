/*-------------------------------- Starter Code --------------------------------*/
const dotenv = require('dotenv')
dotenv.config()
const mongoose = require('mongoose')

const Customer = require('./models/Customer')

const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('Connected to MongoDB')
    await runCRM()
    await mongoose.disconnect()
    console.log('Disconnected from MongoDB')
    process.exit()
  } catch (error) {
    console.error('Error connecting to MongoDB:', error)
    process.exit(1)
  }
}

const runCRM = async () => {
  console.log('Welcome to the CRM')
  let running = true

  while (running) {
    console.log(`
      1. Create a customer
      2. View all customers
      3. Update a customer
      4. Delete a customer
      5. Quit
    `)

    const prompt = require('prompt-sync')()
    const choice = prompt('Enter the number of the action: ')

    switch (choice) {
      case '1':
        await createCustomer()
        break
      case '2':
        await viewCustomers()
        break
      case '3':
        await updateCustomer()
        break
      case '4':
        await deleteCustomer()
        break
      case '5':
        running = false
        console.log('Exiting CRM...')
        break
      default:
        console.log('Invalid choice. Please try again.')
    }
  }
}

/*-------------------------------- Query Functions --------------------------------*/
const createCustomer = async () => {
  const prompt = require('prompt-sync')()
  const name = prompt('Enter customer name: ')
  const age = parseInt(prompt('Enter customer age: '), 10)

  try {
    const customer = await Customer.create({ name, age })
    console.log('Customer created:', customer)
  } catch (error) {
    console.error('Error creating customer:', error)
  }
}

const viewCustomers = async () => {
  try {
    const customers = await Customer.find()
    console.log('All customers:')
    customers.forEach((customer) =>
      console.log(
        `id: ${customer._id} -- Name: ${customer.name}, Age: ${customer.age}`
      )
    )
  } catch (error) {
    console.error('Error fetching customers:', error)
  }
}

const updateCustomer = async () => {
  const prompt = require('prompt-sync')()
  const id = prompt('Enter the ID of the customer to update: ')

  try {
    const name = prompt('Enter the new name: ')
    const age = parseInt(prompt('Enter the new age: '), 10)
    const customer = await Customer.findByIdAndUpdate(
      id,
      { name, age },
      { new: true }
    )
    if (customer) {
      console.log('Customer updated:', customer)
    } else {
      console.log('Customer not found.')
    }
  } catch (error) {
    console.error('Error updating customer:', error)
  }
}

const deleteCustomer = async () => {
  const prompt = require('prompt-sync')()
  const id = prompt('Enter the ID of the customer to delete: ')

  try {
    const customer = await Customer.findByIdAndDelete(id)
    if (customer) {
      console.log('Customer deleted:', customer)
    } else {
      console.log('Customer not found.')
    }
  } catch (error) {
    console.error('Error deleting customer:', error)
  }
}

/*-------------------------------- Connect to Database --------------------------------*/
connect()
