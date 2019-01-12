export class User {
    constructor(
    //public id: number = null,
    public first_name: string = "",
    public last_name: string = "",
    public email: string = "",
	public birthday: Date = new Date(),
    public password: string = "",
    public cpassword: string = "",
    public address1: string = "",
    public address2: string = "",
    public city: string = "",
    public state: string = "",
    public created_at: Date = new Date(),
    public updated_at: Date = new Date()
  ){}
}
