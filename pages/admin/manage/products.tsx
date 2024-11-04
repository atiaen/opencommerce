import { DataTable, DataTableSelectionChangeEvent, DataTableSelectEvent, DataTableUnselectEvent } from 'primereact/datatable';
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
import { Checkbox } from "primereact/checkbox";
import { Dropdown } from 'primereact/dropdown';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { FileUpload, FileUploadBeforeSendEvent, FileUploadBeforeUploadEvent, FileUploadSelectEvent } from 'primereact/fileupload';
import { InputNumber } from 'primereact/inputnumber';
import { InputTextarea } from 'primereact/inputtextarea';
import { Product } from '@/src/shared/entities/Products/product';
import ProductsController from '@/src/shared/controllers/products/ProductsController';
import { FileUploadUploadEvent } from 'primereact/fileupload';

export default function Products() {
    const [showProductModal, setshowProductModal] = useState(false);
    const [editProductShow, setEditProductShow] = useState(false);
    const [deleteProductShow, setDeleteProductShow] = useState(false);
    const [productName, setProductName] = useState('');
    const [productDesc, setProductDesc] = useState('');
    const [productPrice, setProductPrice] = useState<number>(0);
    const [inStock, setInstock] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [allCategories, setAllCategories] = useState<Category[]>([]);
    const [products, setAllProducts] = useState<Product[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<Category>();
    const [fetchLoading, setFetchLoading] = useState(true);
    const [selectedProduct, setSelectedProduct] = useState<Product>();
    const [imageName, setProductImageName] = useState<string>('');
    const [imageUploaded, setImageUploaded] = useState<boolean>(false);

    const router = useRouter();

    const getAllCategories = async () => {
        const all = await CategoryController.getAllCategories();
        if (all) {
            setAllCategories(all);
            setFetchLoading(false);
        } else {
            setFetchLoading(false);
        }
    }

    const getAllProducts = async () => {
        const all = await ProductsController.getAllProducts();
        if (all) {
            setAllProducts(all);
            setFetchLoading(false);
        } else {
            setFetchLoading(false);
        }
    }

    const BeforeUpload = async (e: FileUploadBeforeUploadEvent) => {
        if (productName === '') {
            toast.error("Please enter a product name before uploading");
            return;
        } else {
            e.formData.append("product_name", productName);
        }
    }

    const onSelect = async (e: FileUploadSelectEvent) => {
        const reader = new FileReader();
        reader.readAsDataURL(e.files[0])
        reader.onload = () => {
            console.log('called: ', reader)
            setProductImageName(reader.result as string);
            setImageUploaded(true);
            toast.success("Successfully uploaded image");
        }
        if (productName === '') {
            toast.error("Please enter a product name before uploading");
            return;
        }
    }

    const createProduct = async () => {
        setIsLoading(true);
        if (productName === '' || productPrice === 0) {
            toast.error("Please enter a product name or a price greater than");
        } else {
            try {
                const newProduct: Product = new Product();
                newProduct.product_name = productName;
                newProduct.product_price = productPrice;
                newProduct.product_category = selectedCategory;
                newProduct.in_stock = inStock;
                newProduct.product_description = productDesc;
                newProduct.product_image = imageName
                await remult.repo(Product).save(newProduct);
                setIsLoading(false);
                toast.success("Product successfully created");
                router.reload();
            } catch (error) {
                console.log(error);
                toast.error("Could not create product");
                setIsLoading(false);
            }
        }

    }

    const editProduct = async () => {
        setIsLoading(true);
        if (productName === '' || productPrice === 0) {
            toast.error("Please enter a product name or a price greater than");
        } else {
            try {
                let modified = new Product();
                modified = selectedProduct as Product;
                modified.product_name = productName;
                modified.product_price = productPrice;
                modified.in_stock = inStock;
                modified.product_description = productDesc;
                modified.modified_date = new Date().toLocaleDateString();
                await remult.repo(Product).update(selectedProduct?.id as number, modified)
                toast.success("Product successfully edited");
                router.reload();
                setIsLoading(false);
            } catch (error) {
                console.log(error);
                toast.error("Could not modify product");
                setIsLoading(false);
            }
        }

    }

    const deleteProduct = async () => {
        setIsLoading(true);
        try {
            let modified = new Product();
            modified = selectedProduct as Product;
            modified.is_deleted = 1
            modified.modified_date = new Date().toLocaleDateString();
            await remult.repo(Product).update(selectedCategory?.id as number, modified)
            toast.success("Product successfully deleted");
            router.reload();
            setIsLoading(false);
        } catch (error) {
            console.log(error);
            toast.error("Could not delete product");
            setIsLoading(false);
        }
    }


    const onEditClick = (row: any) => {
        setSelectedProduct(row);
        setEditProductShow(true);
    }
    const onDeleteClick = (row: any) => {
        setSelectedProduct(row);
        setDeleteProductShow(true);
    }


    const updateTools = (e: any) => (
        <div className='flex justify-content-evenly'>
            <Button label='Edit' onClick={() => onEditClick(e)} icon="pi pi-file-edit" />
            <Button className='bg-red-500 border-red-500' label="Delete" onClick={() => onDeleteClick(e)} icon="pi pi-trash" />
        </div>
    )

    const dateBody = (cat: Product) => {
        return <div>{new Date(cat.created_date).toDateString()}</div>
    }

    const footerContent = (
        <div>
            <Button label="Cancel" loading={isLoading} icon="pi pi-times" onClick={() => setshowProductModal(false)} className="p-button-text" />
            <Button label="Create" loading={isLoading} disabled={!imageUploaded} icon="pi pi-check" onClick={() => createProduct()} autoFocus />
        </div>
    );

    const editFooterContent = (
        <div>
            <Button label="Cancel" loading={isLoading} icon="pi pi-times" onClick={() => setEditProductShow(false)} className="p-button-text" />
            <Button label="Save" loading={isLoading} icon="pi pi-check" onClick={() => editProduct()} autoFocus />
        </div>
    );

    useEffect(() => {
        getAllCategories();
        getAllProducts();
    }, [])

    return (
        <>
            <PageTitle title="Products" />
            <div className="p-3 h-screen">
                <h2>Products</h2>
                <div className='mb-3'>
                    <Button label='Add' onClick={() => setshowProductModal(true)} icon={`pi pi-fw ${PrimeIcons.PLUS}`} />
                </div>
                <div className='p-2'>
                    <DataTable
                        value={products}
                        loading={fetchLoading}
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25, 50]}
                        currentPageReportTemplate="{first} to {last} of {totalRecords}">
                        <Column field="product_name" header="Product Name" style={{ width: '25%' }}></Column>
                        <Column field="created_date" header="Date Added" body={dateBody} style={{ width: '25%' }}></Column>
                        <Column field="company" header="Total Sold" style={{ width: '25%' }}></Column>
                        <Column header="Management Tools" body={(e) => updateTools(e)} style={{ width: '25%' }}></Column>
                    </DataTable>
                </div>
            </div>
            <Dialog header="Add a new product" visible={showProductModal} style={{ width: '50vw' }} onHide={() => setshowProductModal(false)} footer={footerContent}>
                <div className="m-0 card">
                    <div className='formgrid grid'>
                        <div className="field col-6">
                            <div className="flex flex-column gap-2">
                                <label htmlFor="product_name">Product Name</label>
                                <InputText onChange={(e) => setProductName(e.target.value)} id="product_name" aria-describedby="product_name_help" />
                                <small id="product_name_help">
                                    Enter a product name.
                                </small>
                            </div>
                        </div>
                        <div className="field col-6">
                            <div className="flex flex-column gap-2">
                                <label htmlFor="product_desc">Product Description</label>
                                <InputTextarea onChange={(e) => setProductDesc(e.target.value)} id="product_name" rows={5} cols={30} />
                                <small id="product_desc_help">
                                    Enter a product description.
                                </small>
                            </div>

                        </div>
                        <div className="field col-6">
                            <div className="flex flex-column gap-2">
                                <label htmlFor="product_price">Product Price</label>
                                <InputNumber inputId="product_price" value={productPrice} onValueChange={(e) => setProductPrice(e.value as number)} mode="currency" currency="NGN" locale="en-NG" />
                                {/* <InputText onChange={(e) => setCategoryTag(e.target.value)} id="product_price" aria-describedby="product_price_help" /> */}
                                <small id="product_price_help">
                                    Enter a product price.
                                </small>
                            </div>
                        </div>
                        <div className="field col-6">
                            <div className="flex flex-column gap-2">
                                <label htmlFor="product_category">Product Category</label>
                                <Dropdown value={selectedCategory} options={allCategories} onChange={(e) => setSelectedCategory(e.value)} optionLabel="category_name"
                                    placeholder="Select product category" className="w-full md:w-14rem" />
                            </div>
                        </div>
                        <div className="field col-6">
                            <div className="flex flex-column gap-2">
                                <label htmlFor="product_upload">Upload an image for this product</label>
                                <FileUpload
                                    mode="basic"
                                    name="image"
                                    // onUpload={onImageUpload} 
                                    accept="image/*"
                                    maxFileSize={1000000}
                                    onBeforeUpload={BeforeUpload}
                                    disabled={productName === ''}
                                    onSelect={onSelect}
                                />
                            </div>
                        </div>
                        <div className="field col-6">
                            <div className="flex flex-row gap-2">
                                <Checkbox inputId="in_stock" onChange={(e) => setInstock(e.checked as boolean)} checked={inStock} name="in_stock" />
                                <label htmlFor="in_stock" className="ml-2">Is this product in stock?</label>
                            </div>
                        </div>
                    </div>
                </div>
            </Dialog>

            <Dialog header={`Edit ${selectedProduct?.product_name}`} visible={editProductShow} style={{ width: '50vw' }} onHide={() => setEditProductShow(false)} footer={editFooterContent}>
                <div className="m-0 card">
                    <div className='formgrid grid'>
                        <div className="field col-6">
                            <div className="flex flex-column gap-2">
                                <label htmlFor="product_name">Product Name</label>
                                <InputText onChange={(e) => setProductName(e.target.value)} id="product_name" aria-describedby="product_name_help" />
                                <small id="product_name_help">
                                    Enter a product name.
                                </small>
                            </div>

                        </div>
                        <div className="field col-6">
                            <div className="flex flex-column gap-2">
                                <label htmlFor="product_desc">Product Description</label>
                                <InputTextarea onChange={(e) => setProductDesc(e.target.value)} id="product_name" rows={5} cols={30} />
                                <small id="product_desc_help">
                                    Enter a product description.
                                </small>
                            </div>

                        </div>
                        <div className="field col-6">
                            <div className="flex flex-column gap-2">
                                <label htmlFor="product_price">Product Price</label>
                                <InputNumber inputId="product_price" value={productPrice} onValueChange={(e) => setProductPrice(e.value as number)} mode="currency" currency="NGN" locale="en-NG" />
                                {/* <InputText onChange={(e) => setCategoryTag(e.target.value)} id="product_price" aria-describedby="product_price_help" /> */}
                                <small id="product_price_help">
                                    Enter a product price.
                                </small>
                            </div>
                        </div>
                        <div className="field col-6">
                            <div className="flex flex-column gap-2">
                                <label htmlFor="product_category">Product Category</label>
                                <Dropdown options={allCategories} onChange={(e) => setSelectedCategory(e.value)} optionLabel="category_name"
                                    placeholder="Select product category" className="w-full md:w-14rem" />
                            </div>
                        </div>
                        <div className="field col-6">
                            <div className="flex flex-column gap-2">
                                <label htmlFor="product_upload">Upload Images for this product</label>
                                <FileUpload mode="basic" name="demo[]" multiple accept="image/*" maxFileSize={1000000} />
                            </div>
                        </div>
                        <div className="field col-6">
                            <div className="flex flex-row gap-2">
                                <Checkbox inputId="in_stock" onChange={(e) => setInstock(e.checked as boolean)} checked={inStock} name="in_stock" />
                                <label htmlFor="in_stock" className="ml-2">Is this product in stock?</label>
                            </div>
                        </div>
                    </div>
                </div>
            </Dialog>

            <ConfirmDialog visible={deleteProductShow} onHide={() => setDeleteProductShow(false)} message={`Are you sure you want to delete ${selectedProduct?.product_name}?`}
                header="Confirmation" icon="pi pi-exclamation-triangle" accept={deleteProduct} reject={() => setDeleteProductShow(false)} />
        </>
    )
}