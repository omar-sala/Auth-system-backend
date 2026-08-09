import dotenv from 'dotenv'
import passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import prisma from '../config/prisma.js'

dotenv.config()

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const googleId = profile.id
        const email = profile.emails[0].value
        const name = profile.displayName

        const existingGoogleUser = await prisma.user.findUnique({
          where: {
            googleId,
          },
        })

        if (existingGoogleUser) {
          return done(null, existingGoogleUser)
        }

        const existingEmailUser = await prisma.user.findUnique({
          where: {
            email,
          },
        })

        if (existingEmailUser) {
          const updatedUser = await prisma.user.update({
            where: {
              id: existingEmailUser.id,
            },
            data: {
              googleId,
            },
          })

          return done(null, updatedUser)
        }

        const user = await prisma.user.create({
          data: {
            name,
            email,
            googleId,
          },
        })

        return done(null, user)
      } catch (error) {
        return done(error, null)
      }
    }
  )
)

export default passport
