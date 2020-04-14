//load app using express
const express = require('express')
const app = express()
const morgan = require('morgan')
const mysql = require('mysql')
const bodyParser = require('body-parser')

//middlwear that helps process requests easily
app.use(bodyParser.urlencoded({extended: false}))

app.use(express.static('./public'))

//morgan gives us logs of what our requests are doing. use short for brief details and combined for a detailed description
app.use(morgan('combined'))

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'covid19'
});

connection.connect((err)=>{
  if(!err)
  console.log('Database successfully connected!');
  else
    console.log('Database connection failed \n Error : '+ JSON.stringify(err, undefined, 2));
});

app.get("/", (req, res) => {
  console.log('Responding to route');
  res.send('Hello from route! ')
})

app.get("/patients", (req, res) => {
  console.log('Fetching patient data');
  
  const userId = req.params.Id
  const queryString = 'SELECT *FROM patients'
  connection.query(queryString, [userId], (err, rows, fields) => {
    if (err) {
      console.log('Failed to query for patients: ' + err)
      res.sendStatus(500)
      return
    }

    console.log('Fetched data successfully!')
    res.json(rows)
})
})

//localhost 4060
app.listen(4060, ()=>{
  console.log('Server is listening on port 4060....');
});

app.post('/patient_create', (req, res) => {
  console.log('Creating a new patient...')

  const id = req.body.Id
  const fname = req.body.Name
  const location = req.body.County
  const status = req.body.Severity

  const queryString = 'INSERT INTO `patients`(`Id`,`Name`, `County`, `Severity`) VALUES (?, ?)'
  connection.query(queryString, [id, fname, location, status], (err, rows, fields) => {
    if (err) {
      console.log('Failed to insert new patient: ' + err)
      res.sendStatus(500)
      return
    }
    console.log('Inserted a new user with id: ', results.insertedId);
    res.end()
  })
  
})