import express from 'express'
import { in3login } from "./playground/in3Login"

const app = express()
const port = 3000

app.get('/', async (req, res) =>{
  await in3login()
})

app.listen(port, () => {
  // Code.....
  console.log('Listening on port: ' + port)
})