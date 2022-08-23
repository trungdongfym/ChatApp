import { NextFunction, Request, RequestHandler, Response } from 'express';
import { ObjectSchema } from 'joi';
import HttpErrors from '../libs/error/httpErrors';

class ValidateMiddleware {
   public static validate(validateSchema: {
      bodySchema?: ObjectSchema;
      querySchema?: ObjectSchema;
      paramSchema?: ObjectSchema;
   }): RequestHandler {
      return async (req: Request, res: Response, next: NextFunction) => {
         try {
            if (validateSchema.bodySchema) {
               const data = req.body;
               const dataValidated = await ValidateMiddleware.validateData(
                  validateSchema.bodySchema,
                  data
               );
               req.body = dataValidated;
            }

            if (validateSchema.querySchema) {
               const data = req.query?.qs ?? req.query;
               const queryParam = await ValidateMiddleware.validateData(
                  validateSchema.querySchema,
                  data
               );
               req.query = queryParam;
            }

            if (validateSchema.paramSchema) {
               const data = req.params;
               const params = await ValidateMiddleware.validateData(
                  validateSchema.paramSchema,
                  data
               );
               req.params = params;
            }

            next();
         } catch (error) {
            // if (req.file) {
            //    FileLib.removeFile(req.file.path).catch((err) => {
            //       console.log(err);
            //    });
            // }
            next(error);
         }
      };
   }

   private static validateData = async (
      validationSchema: ObjectSchema,
      data: object | Array<any> | any
   ) => {
      try {
         const value = await validationSchema.validateAsync(data);
         return value;
      } catch (error) {
         if (error?.isJoi) {
            throw HttpErrors.BadRequest(error.message);
         }
         throw HttpErrors.ServerError(error?.message || 'Unknow Error!');
      }
   };
}

export default ValidateMiddleware;
