import { BackendMethod, remult, Allow, describeClass, dbNamesOf } from "remult";
import { Product } from '../../entities/Products/product';
import UserController from "../users/UserController";
import { PostgresDataProvider } from "remult/postgres";

export default class ProductsController {

    @BackendMethod({ allowed: true })
    static async getAllProducts() {
        const productRepo = await remult.repo(Product);
        const products = await productRepo.find({
            where: {
                is_deleted: 0
            }
        });
        return products;
    }


    @BackendMethod({ allowed: true })
    static async getProductsCount() {
        const productRepo = await remult.repo(Product);
        const products = await productRepo.count({
            is_deleted: 0
        });
        return products;
    }


    @BackendMethod({ allowed: true })
    static async getProductById(id: number) {
        const productRepo = await remult.repo(Product);
        const products = await productRepo.findFirst({
            id: id
        });
        return products;
    }

    @BackendMethod({ allowed: true })
    static async getProductsByCategory(category_id: number) {
        const productRepo = await remult.repo(Product);
        const products = await productRepo.find({
            where: {
                product_category: {
                    $id: category_id
                }
            }
        });
        return products;
    }


    static async getMinAndMaxValues() {

        const tasks = await dbNamesOf(Product);
        const sql = PostgresDataProvider.getDb();
        console.log(sql)
        console.log(tasks)
        const r = await sql.query(`select count(*) as c from ${tasks}`);
        console.log(r.rows[0].c);

        // const prods = await dbNamesOf(Product);
        // const sql = PostgresDataProvider.getDb();
        // const result = await sql.query(`select min(product_price) as minimum, select max(product_price) as maximum from ${prods}`)
        console.log(r)
        return r;
    }

    // @BackendMethod({ allowed: true })
    static async addNewProduct(product: Product) {
        const productRepo = await remult.repo(Product);
        const savedProduct = await productRepo.save(product);
        return savedProduct;
    }


    @BackendMethod({ allowed: true })
    static async updateProduct(id: number, uproduct: Product) {
        const productRepo = await remult.repo(Product);
        const product = await productRepo.update(id, uproduct);
        return product;
    }

    @BackendMethod({ allowed: true })
    static async searchProduct(term: string) {
        const productRepo = await remult.repo(Product);
        const product = await productRepo.find({
            where: {
                product_name: {
                    $contains: term
                }
            }
        });
        return product;
    }

}

describeClass(ProductsController, undefined, undefined, {
    addNewProduct: BackendMethod({ allowed: true }),
    getMinAndMaxValues: BackendMethod({ allowed: true, })
    // getAdminUserByEmailPassword: BackendMethod({ allowed:true })
})
