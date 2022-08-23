import IError from '../../common/interfaces/errors';
import { StatusCodes } from 'http-status-codes';
import CodeError from './codeErrors';
import TypeErrors from './typeError';

class HttpErrors extends Error implements IError {
   type?: string;
   code?: string;
   status?: number;

   constructor(ErrorOptions: IError) {
      const errorMessage = ErrorOptions.message || 'Unknow error!';
      super(errorMessage);
      this.status = ErrorOptions.status || StatusCodes.BAD_REQUEST;
      this.type = ErrorOptions.type || TypeErrors.HTTP_ERROR;
      this.code = ErrorOptions.code || CodeError.BasicError[StatusCodes.BAD_REQUEST];
   }

   set setMessage(message: string) {
      this.message = message;
   }
   set setCode(code: string) {
      this.code = code;
   }
   set setType(type: TypeErrors) {
      this.message = type;
   }
   set setStatus(status: number) {
      this.status = status;
   }

   static BadRequest(message?: string, type?: TypeErrors) {
      const errorOption: IError = {
         status: StatusCodes.BAD_REQUEST,
         code: CodeError.BasicError[StatusCodes.BAD_REQUEST],
         type: type || TypeErrors.HTTP_ERROR,
         message: message,
      };
      return new HttpErrors(errorOption);
   }

   static Forbiden(message?: string, type?: TypeErrors) {
      const errorOption: IError = {
         status: StatusCodes.FORBIDDEN,
         code: CodeError.BasicError[StatusCodes.FORBIDDEN],
         type: type || TypeErrors.HTTP_ERROR,
         message: message,
      };
      return new HttpErrors(errorOption);
   }

   static Conflict(message?: string, type?: TypeErrors) {
      const errorOption: IError = {
         status: StatusCodes.CONFLICT,
         type: type || TypeErrors.HTTP_ERROR,
         code: CodeError.BasicError[StatusCodes.CONFLICT],
         message: message,
      };
      return new HttpErrors(errorOption);
   }

   static NotFound(message?: string, type?: TypeErrors) {
      const errorOption: IError = {
         status: StatusCodes.NOT_FOUND,
         type: type || TypeErrors.HTTP_ERROR,
         code: CodeError.BasicError[StatusCodes.NOT_FOUND],
         message: message,
      };
      return new HttpErrors(errorOption);
   }

   static Unauthorized(message?: string, type?: TypeErrors) {
      const errorOption: IError = {
         status: StatusCodes.UNAUTHORIZED,
         type: type || TypeErrors.HTTP_ERROR,
         code: CodeError.BasicError[StatusCodes.UNAUTHORIZED],
         message: message,
      };
      return new HttpErrors(errorOption);
   }

   static InvalidToken(message?: string, type?: TypeErrors) {
      const errorOption: IError = {
         status: StatusCodes.BAD_REQUEST,
         type: type || TypeErrors.TOKEN_ERROR,
         code: CodeError.BasicError[StatusCodes.BAD_REQUEST],
         message: message,
      };
      return new HttpErrors(errorOption);
   }

   static IODataBase(message?: string) {
      const errorOption: IError = {
         status: StatusCodes.INTERNAL_SERVER_ERROR,
         type: TypeErrors.DATABASE_ERROR,
         code: CodeError.BasicError[StatusCodes.INTERNAL_SERVER_ERROR],
         message: message,
      };
      return new HttpErrors(errorOption);
   }

   static ServerError(message?: string) {
      const errorOption: IError = {
         status: StatusCodes.INTERNAL_SERVER_ERROR,
         type: TypeErrors.UNKNOW_ERROR,
         code: CodeError.BasicError[StatusCodes.INTERNAL_SERVER_ERROR],
         message: message,
      };
      return new HttpErrors(errorOption);
   }

   static UploadError(message?: string, type?: TypeErrors) {
      const errorOption: IError = {
         status: StatusCodes.INTERNAL_SERVER_ERROR,
         type: type || TypeErrors.UPLOAD_ERROR,
         code: CodeError.UPLOAD_FAIL,
         message: message || 'Upload File Error!',
      };
      return new HttpErrors(errorOption);
   }
}

export default HttpErrors;
