const controllerWrapper = ctrl => {
    return async(req, res, next)=> {
        try {
            await ctrl(req, res, next);
        }
        catch(error) {
            next(error);
        }
    }
}

export default controllerWrapper;
