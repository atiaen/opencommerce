import { createPostgresConnection } from 'remult/postgres';
import { remultNext } from "remult/remult-next"
import { Users } from '../../src/shared/entities/User/user';
import { Category } from '../../src/shared/entities/Categories/category';
import { Product } from '../../src/shared/entities/Products/product';
import { Carts } from "../../src/shared/entities/Cart/cart";
import { Reservation } from "../../src/shared/entities/Reservation/reservation";
import UserController from "../../src/shared/controllers/users/UserController";
import ProductsController from "../../src/shared/controllers/products/ProductsController";
import CategoryController from "../../src/shared/controllers/category/CategoryController";
import ReservationController from "../../src/shared/controllers/reservations/ReservationsController";
import CartController from "../../src/shared/controllers/cart/CartController";
import { ReservedProducts } from '@/src/shared/entities/ReservedProducts/reserved_products';
import { RemultServer } from 'remult/server';
import { HomePageSettings } from '@/src/shared/entities/AppManagement/homepage_settings';
import HomepageController from '@/src/shared/controllers/homepage_settings/HomepageController';
import { TopCarouselImages } from '@/src/shared/entities/AppManagement/top_carousel_images';

const devMode = process.env.DEVMODE

let api:RemultServer;
if (devMode === "true") {
    api = remultNext({
        entities: [Users, Category, Product, Carts, Reservation, ReservedProducts,HomePageSettings,TopCarouselImages],
        controllers: [UserController, ProductsController, CategoryController, ReservationController, CartController,HomepageController],
        dataProvider: createPostgresConnection({
            connectionString: "postgres://postgres:postgres@localhost:5432/medzone"
        }),
        ensureSchema: true,
        logApiEndPoints: true
    })
} else {
    api = remultNext({
        entities: [Users, Category, Product, Carts, Reservation, ReservedProducts,HomePageSettings,TopCarouselImages],
        controllers: [UserController, ProductsController, CategoryController, ReservationController, CartController,HomepageController],
        dataProvider: createPostgresConnection({
            connectionString: process.env.DATABASE_URL
        }),
        ensureSchema: true,
        logApiEndPoints: true
    })
}
api.openApiDoc({ title: "Api Docs" })
export default api
