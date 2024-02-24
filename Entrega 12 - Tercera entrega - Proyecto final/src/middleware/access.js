export const access = (permisos=[])=>{
    return function(req, res, next){
        if(permisos.includes("PUBLIC")){
            return next()
        }

        if(!req.user){
            res.setHeader('Content-Type','application/json');
            return res.status(401).json({error:`Error autenticacion. No estas logueado...!!!`})
        }

        if(!permisos.includes(req.user.role.toLowerCase())){
            res.setHeader('Content-Type','application/json');
            return res.status(403).json({error:`No tiene permisos para el recurso`})
        }

        return next()
    }
}
