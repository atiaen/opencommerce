import { Entity, Fields } from "remult";

@Entity("categories", {
    allowApiCrud: true
})
export class Category {
    @Fields.autoIncrement()
    id!: number;

    @Fields.string()
    category_name = '';

    @Fields.string()
    category_tag = '';

    @Fields.number()
    is_deleted = 0;

    @Fields.date()
    created_date = new Date();

    @Fields.date()
    modified_date = '';
}
