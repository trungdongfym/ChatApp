class CodeError {
   static readonly BasicError: { [key: number]: string } = {
      400: 'Bad Request',
      401: 'Unauthorized',
      403: 'Forbidden',
      404: 'Not Found',
      409: 'Conflict',
      500: 'Internal Server Error',
   };
   static readonly UPLOAD_FAIL: string = 'Upload Fail';
   static readonly JWT_EXPIRE: string = 'jwt expire';
   static readonly JWT_INVALID: string = 'jwt invalid';
}

export default CodeError;
