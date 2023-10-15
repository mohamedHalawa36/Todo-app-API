type Task = {
  id: string;
  title: string;
  done: boolean;
};

type ValidationError = {
  location:"body"|"param";
  msg:string;
  param:string
}
type ServerError = Error &{status?:number}

