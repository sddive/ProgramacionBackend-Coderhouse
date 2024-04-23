import { userService } from "../services/user.services.js"

export default class UsersController{

    async changePremium(req, res) {
        try {
            let userUpdate
            let id = req.params.uid
            console.log(id)
            let user = await userService.getById(id)
            console.log(user)
            if (!user) {
                return res.status(400).json({status: 'error', message:"El usuario ingresado no existe"})
            }
            if (user.role !== "admin") {
                if (user.role == "user") {
                    userUpdate = { ...user, role: "premium" }                
                    userUpdate = await userService.updateUser(userUpdate)
                    res.setHeader('Content-Type', 'application/json')
                    
                    res.status(200).json({status: 'ok', message:"El rol del usuario ingresado ha sido modificado a premium "})
                 } else {
                    userUpdate = { ...user, role: "user" }
                    userUpdate = await userService.updateUser(userUpdate)
                    res.setHeader('Content-Type', 'application/json')
                    res.status(200).json({status: 'ok', message:"El rol del usuario ingresado ha sido modificado a user"})
                }
            }
        } catch (error) {
            return res.status(500).send(error.message);
        }
    }

}