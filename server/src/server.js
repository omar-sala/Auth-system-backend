import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import cookieParser from 'cookie-parser'
import passport from '../services/googleStrategy.js'

import authRoutes from '../routes/authRoutes.js'
import userRoutes from '../routes/userRoutes.js'
import helmet from 'helmet'
import cors from 'cors'

const app = express()
app.use(helmet())
app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
)
app.use(express.json())
app.use(cookieParser())
app.use(passport.initialize())

const PORT = process.env.PORT || 3000

app.use('/auth', authRoutes)
app.use('/user', userRoutes)

app.get('/', (req, res) => {
  res.send('Home Page')
})

app.get('/about', (req, res) => {
  res.send('About Page')
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
