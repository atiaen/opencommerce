import { Entity, Fields } from "remult";
import { Users } from "./user";

@Entity("admin", {
    allowApiCrud: true,
    allowApiUpdate:true,
})
export class Admin extends Users {
    
    @Fields.boolean()
    isAdmin = false;
}