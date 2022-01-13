const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')

const Volunteer = require('../app/models/volunteer')

module.exports = (passport) => {
    passport.use(
        new LocalStrategy({usernameField: 'email'}, (email, password, done) => {
            Volunteer.findOne({ email: email})
                .then(volunteer => {
                    console.log('Inside local strategy callback')

                    // Email is not in the database
                    if (!volunteer) {
                        return done(null, false, { message: 'Email is not registered'})
                    }

                    // Match password
                    bcrypt.compare(password, volunteer.password, (err, isMatch) => {
                        if (err) {
                            console.log('Local strategy returned error')
                            return done(err, false, { message: 'An error has occured, please try again'})
                        }
                        // Password is correct
                        if (isMatch) {
                            console.log('Local strategy returned true')
                            return done(null, volunteer)

                        // Password is incorrect
                        } else {
                            console.log('Local strategy returned false')
                            return done(null, false, { message: 'Password is incorrect'})
                        }
                    })

                })
                .catch(err => {
                    console.log(err)
                    return done(err, false, { message: 'An error has occured, please try again'})
                })
        })
    )

    passport.serializeUser((user, done) => {
        console.log('Inside serializeUser')
        done(null, user.id)
    })
      
    passport.deserializeUser((id, done) => {
        Volunteer.findById(id, (err, user) => {
            done(err, user)
        })
    })

    
}