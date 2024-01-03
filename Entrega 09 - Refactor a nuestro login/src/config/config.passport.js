import passport from 'passport'
import github from 'passport-github2'
import { userModel } from '../dao/models/user.model.js'

export const initPassport=()=>{

    passport.use('github', new github.Strategy(
        {
            clientID: "Iv1.196c0c1838a16816", 
            clientSecret: "548ffeb491a76899bcda4e2423c1e4f929c084d3", 
            callbackURL: "http://localhost:8080/api/sessions/callbackGithub", 
        },
        async(accessToken, refreshToken, profile, done)=>{
            try {
                // console.log(profile)
                let usuario=await userModel.findOne({email: profile._json.email})
                if(!usuario){
                    let newUser={
                        nombre: profile._json.name,
                        email: profile._json.email, 
                        profile
                    }

                    usuario=await userModel.create(newUser)
                }
                return done(null, usuario)


            } catch (error) {
                return done(error)
            }
        }
    ))


    // serializador / deserializador
    passport.serializeUser((user, done)=>{
        return done(null, user._id)
    })

    passport.deserializeUser(async(id, done)=>{
        let user = await userModel.findById(id)
        return done(null, user)
    })

} // fin initPassport