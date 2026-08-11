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
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
)
app.use(express.json())
app.use(cookieParser())
app.use(passport.initialize())

app.use('/auth', authRoutes)
app.use('/auth', userRoutes)

app.get('/', (req, res) => {
  res.send('Home Page')
})

app.get('/about', (req, res) => {
  res.send('About Page')
})

export default app
