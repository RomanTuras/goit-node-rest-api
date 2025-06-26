import { UniqueConstraintError, ValidationError } from "sequelize";

const controllerWrapper = ctrl => {
    return async(req, res, next)=> {
        try {
            await ctrl(req, res, next);
        }
        catch(error) {
            if(error instanceof UniqueConstraintError) {
                error.status = 409;
            }
            else if(error instanceof ValidationError) {
                error.status = 400;
            }
            next(error);
        }
    }
}

export default controllerWrapper;
