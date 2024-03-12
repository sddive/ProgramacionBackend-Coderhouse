export default class CustomError{
    static CustomError(name, message, statusCode, description=""){
        let error = new Error(message)
        error.name = name
        error.codigo = statusCode
        error.description = description

        return error
    }
}
