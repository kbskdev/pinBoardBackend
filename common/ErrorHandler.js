class ErrorHandler extends Error{
    constructor(request,message,statusCode) {
        super(message);
        this.request = request
        this.message = message
        this.statusCode = statusCode
        this.status = `${statusCode}`.startsWith('4')?'fail':'error'
        this.isOperational = true
    }
}

module.exports = ErrorHandler
