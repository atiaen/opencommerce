import { Entity, Fields } from "remult";

@Entity("users", {
    allowApiCrud: true,
    allowApiUpdate:true,
})
export class Users {
    @Fields.autoIncrement()
    id!: number;

    @Fields.string()
    first_name = '';

    @Fields.string()
    last_name = '';

    @Fields.boolean()
    isAdmin = false;

    @Fields.string()
    delivery_address? = '';

    @Fields.string()
    phone_number = '';

    @Fields.string()
    email_address = '';

    @Fields.string()
    password = '';

    @Fields.number()
    is_deleted = 0;

    @Fields.date()
    created_date = new Date();

    @Fields.date()
    modified_date:Date | undefined;
}
