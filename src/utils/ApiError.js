class ApiError extends Error {
    constructor(
        statusCode,
        message="something went wrong",
        data=null,
        errors=[],
        stack=""
    ){
        super(message);
        this.statusCode=statusCode;
        this.message=message;
        this.data=data;
        this.errors=errors;
        this.success=false;

        if(stack){
            this.stack=stack;
        }
        else
        {
            Error.captureStackTrace(this,this.constructor);
        }
    }

    
    
    
}

export{ ApiError };