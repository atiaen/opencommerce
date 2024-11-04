import { BackendMethod, remult, Allow } from "remult";
import { Category } from '../../entities/Categories/category';

export default class CategoryController {

    @BackendMethod({ allowed: true })
    static async getAllCategories() {
        const categoryRepo = await remult.repo(Category);
        const categories = await categoryRepo.find({
            where: {
                is_deleted: 0
            }
        });
        return categories;
    }

    @BackendMethod({ allowed: true })
    static async getCategoriesCount() {
        const categoryRepo = await remult.repo(Category);
        const categories = await categoryRepo.count({
            is_deleted: 0
        });
        return categories;
    }

    @BackendMethod({ allowed: true })
    static async addNewCategory(category: Category) {
        const categoryRepo = await remult.repo(Category);
        const savedCategory = await categoryRepo.save(category);
        return savedCategory;
    }

    @BackendMethod({ allowed: true })
    static async updateCategory(id: number, category: Category) {
        category.modified_date = new Date().toISOString();
        const categoryRepo = await remult.repo(Category);
        const savedCategory = await categoryRepo.update(id, category);
        return savedCategory;
    }

    @BackendMethod({ allowed: true })
    static async deleteCategory(id: number, category: Category) {
        category.is_deleted = 1
        const categoryRepo = await remult.repo(Category);
        const savedCategory = await categoryRepo.update(id, category);
        return savedCategory;
    }
}