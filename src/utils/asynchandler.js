const asynchandler = (requesthandler) =>{
    return (req,res,next) => {
        Promise
        .resolve(requesthandler(req,res,next))
        .catch((err) => next(err))
    }

}


export { asynchandler }

// const asynchanlder= ()  => {}
// const asynchanlder= (fn) => {() => {}}
// const asynchanlder= (fn) => async () => {}


// const asynchanlder= (fn) => async (err,req,res,next) => {
//     try {
//         await fn(err,,res,next)
//     } catch (error) {
//         res.status(err.code||400).jason({
//             sucess:false,
//             message:err.message
//         })
        
//     }
// }

