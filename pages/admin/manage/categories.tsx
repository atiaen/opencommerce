import { DataTable,DataTableSelectionChangeEvent, DataTableSelectEvent, DataTableUnselectEvent } from 'primereact/datatable';
import { Column } from 'primereact/column';
import PageTitle from "@/components/shared/page_title";
import { Button } from 'primereact/button';
import { PrimeIcons } from 'primereact/api';
import { useEffect, useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { InputText } from "primereact/inputtext";
import { Category } from '@/src/shared/entities/Categories/category';
import CategoryController from '@/src/shared/controllers/category/CategoryController';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/router';
import { remult } from 'remult';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';

export default function Categories() {
    const [newCategoryShow, setNewCategoryShow] = useState(false);
    const [editCategoryShow, setEditCategoryShow] = useState(false);
    const [deleteCategoryShow, setDeleteCategoryShow] = useState(false);
    const [categoryName, setCategoryName] = useState('');
    const [categoryTag, setCategoryTag] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [allCategories, setAllCategories] = useState<Category[]>([]);
    const [selected,setSelectedCategory] = useState<Category>();
    const [fetchLoading, setFetchLoading] = useState(true);

    const router = useRouter();

    const createCategory = async () => {
        setIsLoading(true);
        if (categoryName === '' || categoryTag === '') {
            toast.error("Please enter a category name or a category tag");
        } else {
            try {
                const newCategory: Category = new Category();
                newCategory.category_name = categoryName;
                newCategory.category_tag = categoryTag;
                await remult.repo(Category).save(newCategory);
                toast.success("Category successfully added");
                router.reload();
                setIsLoading(false);
            } catch (error) {
                console.log(error);
                toast.error("Could not create category");
                setIsLoading(false);
            }
        }

    }

    const editCategory = async () => {
        setIsLoading(true);
        if (categoryName === '' || categoryTag === '') {
            toast.error("Please enter a category name or a category tag");
        } else {
            try {
                let modified = new Category();
                modified = selected as Category;
                modified.category_name = categoryName;
                modified.category_tag = categoryTag;
                modified.modified_date = new Date().toLocaleDateString();
                await remult.repo(Category).update(selected?.id as number,modified)
                toast.success("Category successfully edited");
                router.reload();
                setIsLoading(false);
            } catch (error) {
                console.log(error);
                toast.error("Could not modify category");
                setIsLoading(false);
            }
        }

    }

    const deleteCategory = async () => {
        setIsLoading(true);
        try {
            let modified = new Category();
                modified = selected as Category;
                modified.is_deleted = 1
                modified.modified_date = new Date().toLocaleDateString();
                await remult.repo(Category).update(selected?.id as number,modified)
                toast.success("Category successfully deleted");
                router.reload();
                setIsLoading(false);
        } catch (error) {
            console.log(error);
            toast.error("Could not delete category");
            setIsLoading(false);
        }
    }

    const getAllCategories = async () => {
        const all = await CategoryController.getAllCategories();
        if (all) {
            setAllCategories(all);
            setFetchLoading(false);
        } else {
            setFetchLoading(false);
        }
    }

    const footerContent = (
        <div>
            <Button label="Cancel" loading={isLoading} icon="pi pi-times" onClick={() => setNewCategoryShow(false)} className="p-button-text" />
            <Button label="Create" loading={isLoading} icon="pi pi-check" onClick={() => createCategory()} autoFocus />
        </div>
    );

    const editFooterContent = (
        <div>
            <Button label="Cancel" loading={isLoading} icon="pi pi-times" onClick={() => setNewCategoryShow(false)} className="p-button-text" />
            <Button label="Save" loading={isLoading} icon="pi pi-check" onClick={() => editCategory()} autoFocus />
        </div>
    );

    const dateBody = (cat:Category) => {
        return <div>{new Date(cat.created_date).toDateString()}</div>
    }
    
    const onEditClick = (row: any) => {
        setSelectedCategory(row);
        setEditCategoryShow(true);
        console.log(row);
    }
    const onDeleteClick = (row: any) => {
        setSelectedCategory(row);
        setDeleteCategoryShow(true);
        console.log(row);
    }

    const updateTools = (e:any) => (
        <div className='flex justify-content-evenly'>
            <Button label='Edit' onClick={() => onEditClick(e)} icon="pi pi-file-edit"  />
            <Button className='bg-red-500 border-red-500' label="Delete" onClick={() => onDeleteClick(e)} icon="pi pi-trash" />
        </div>
    )


    useEffect(() => {
        getAllCategories();
    }, [])

    return (
        <>
            <PageTitle title="Categories" />
            <div className="p-3 h-screen">
                <h2>Categories</h2>
                <div className='mb-3'>
                    <Button label='Add' onClick={() => setNewCategoryShow(true)} icon={`pi pi-fw ${PrimeIcons.PLUS}`}  />
                </div>
                <DataTable 
                    value={allCategories} 
                    loading={fetchLoading} 
                    paginator 
                    rows={10} 
                    rowsPerPageOptions={[5, 10, 25, 50]}
                    currentPageReportTemplate="{first} to {last} of {totalRecords}">
                    <Column field="category_name" header="Category Name" style={{ width: '25%' }}></Column>
                    <Column field="created_date" header="Date Added" body={dateBody} style={{ width: '25%' }}></Column>
                    <Column field="company" header="Products in Category" style={{ width: '25%' }}></Column>
                    <Column header="Management Tools" body={(e) => updateTools(e)}  style={{ width: '25%' }}></Column>
                </DataTable>
            </div>
            <Dialog header="Add a new category" visible={newCategoryShow} style={{ width: '50vw' }} onHide={() => setNewCategoryShow(false)} footer={footerContent}>
                <div className="m-0 card flex-column justify-content-center">
                    <div className="flex flex-column gap-2 mb-4">
                        <label htmlFor="category_name">Category Name</label>
                        <InputText onChange={(e) => setCategoryName(e.target.value)} id="category_name" aria-describedby="category_name_help" />
                        <small id="category_name_help">
                            Enter a category name.
                        </small>
                    </div>
                    <div className="flex flex-column gap-2">
                        <label htmlFor="category_tag">Category Tag</label>
                        <InputText onChange={(e) => setCategoryTag(e.target.value)} id="category_tag" aria-describedby="category_tag_help" />
                        <small id="category_tag_help">
                            Enter a category tag.
                        </small>
                    </div>
                </div>
            </Dialog>

            <Dialog header={`Edit ${selected?.category_name} category`} visible={editCategoryShow} style={{ width: '50vw' }} onHide={() => setEditCategoryShow(false)} footer={editFooterContent}>
                <div className="m-0 card flex-column justify-content-center">
                    <div className="flex flex-column gap-2 mb-4">
                        <label htmlFor="category_name">Category Name</label>
                        <InputText onChange={(e) => setCategoryName(e.target.value)} id="category_name" aria-describedby="category_name_help" />
                        <small id="category_name_help">
                            Enter a category name.
                        </small>
                    </div>
                    <div className="flex flex-column gap-2">
                        <label htmlFor="category_tag">Category Tag</label>
                        <InputText onChange={(e) => setCategoryTag(e.target.value)} id="category_tag" aria-describedby="category_tag_help" />
                        <small id="category_tag_help">
                            Enter a category tag.
                        </small>
                    </div>
                </div>
            </Dialog>

            <ConfirmDialog visible={deleteCategoryShow} onHide={() => setDeleteCategoryShow(false)} message="Are you sure you want to delete this category?" 
                header="Confirmation" icon="pi pi-exclamation-triangle" accept={deleteCategory} reject={() => setDeleteCategoryShow(false)} />
        </>
    )
}