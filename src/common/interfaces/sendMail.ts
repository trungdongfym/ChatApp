export interface ISendMail {
   from: string;
   to: Array<string>;
   subject: string;
   html?: any;
   text?: string;
}
