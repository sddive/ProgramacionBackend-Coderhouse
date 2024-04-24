export class CustomError extends Error {
    constructor(message, code, description=""){
        super(message)
        this.code = code
        this.description = description
    }
}
