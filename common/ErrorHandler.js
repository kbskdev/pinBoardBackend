class ErrorHandler extends Error{
    constructor(message,statusCode) {
        super(message);

        this.message = message
        this.statusCode = statusCode
        this.status = `${statusCode}`.startsWith('4')?'fail':'error'
        this.isOperation = true
    }
}

module.exports = ErrorHandler
