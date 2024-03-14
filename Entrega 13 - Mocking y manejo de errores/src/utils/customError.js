export class CustomError extends Error {
    constructor(message, code, description=""){
        super(message)
        error.code = code
        error.description = description

        return error
    }
}
