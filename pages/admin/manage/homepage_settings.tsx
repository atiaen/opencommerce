import PageTitle from "@/components/shared/page_title";
import { PrimeIcons } from "primereact/api";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { useEffect, useState } from "react";
import { Checkbox } from "primereact/checkbox";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { FileUpload, FileUploadSelectEvent } from "primereact/fileupload";
import { InputText } from "primereact/inputtext";
import { MultiSelect, MultiSelectChangeEvent } from 'primereact/multiselect';
import ProductsController from "@/src/shared/controllers/products/ProductsController";
import { Product } from "@/src/shared/entities/Products/product";
import HomepageController from "@/src/shared/controllers/homepage_settings/HomepageController";
import { HomePageSettings } from "@/src/shared/entities/AppManagement/homepage_settings";
import { toast } from "react-hot-toast";
import { TopCarouselImages } from "@/src/shared/entities/AppManagement/top_carousel_images";
import { remult } from "remult";


export default function HomePageSettingsPage() {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isCreating, setIsCreating] = useState<boolean>(false);
    const [modalMode, setModalMode] = useState<string>("");
    const [settingsName, setSettingName] = useState<string>("");
    const [hero_section_main_text, setHeroSectionMain] = useState<string>("");
    const [hero_section_sub_text, setHeroSubText] = useState<string>("");
    const [hero_section_card_1_text, setCard1Text] = useState<string>("");
    const [hero_section_card_2_text, setCard2Text] = useState<string>("");
    const [hero_section_card_3_text, setCard3Text] = useState<string>("");
    const [use_setting, setUseSetting] = useState<boolean>(false);
    const [selectedBestSelling, setSelectedBestSelling] = useState<number[]>([]);
    const [selectedNewArrivals, setNewArrivals] = useState<any[]>([]);
    const [transformedSelectedNewArrivals, setTNewArrivals] = useState<number[]>([]);
    const [bestselling, setSelBestSelling] = useState<number[]>([]);
    const [products, setAllProducts] = useState<Product[]>([]);
    const [allSettings, setAllSettings] = useState<HomePageSettings[]>([])
    const [tempCarousel, setTempCarousel] = useState<any[]>([]);
    const [selectedSetting,setSelectedSetting] = useState<HomePageSettings>();


    const getAllSettings = async () => {
        try {
            const all = await HomepageController.getAllSettings();
            setAllSettings(all);
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
            toast.error("An error occurred trying to get all settings");
        }

    }

    const getAllProducts = async () => {
        const all = await ProductsController.getAllProducts();
        if (all) {
            setAllProducts(all);
        }
    }

    const createSetting = async () => {
        setIsCreating(true);
        try {
            if (settingsName === "") {
                toast.error("Please fill in all required fields");
            } else {
                const findPreviousSetting = await HomepageController.findOneCurrentSetting();
                console.log(findPreviousSetting);
                if (findPreviousSetting && use_setting === true) {
                    toast.error("You can not have two settings selected at the same time. \n Please either disable the previous one or disable this setting");
                    setIsCreating(false);
                    return;
                }
                const convertedArrivals = transformedSelectedNewArrivals.toString();
                const convertedSelling = bestselling.toString();
                const newSetting = new HomePageSettings();
                newSetting.setting_name = settingsName;
                newSetting.hero_section_card_1_text = hero_section_card_1_text;
                newSetting.hero_section_card_2_text = hero_section_card_2_text;
                newSetting.hero_section_card_3_text = hero_section_card_3_text;
                newSetting.hero_section_main_text = hero_section_main_text;
                newSetting.hero_section_sub_text = hero_section_sub_text;
                newSetting.use_setting = use_setting;
                newSetting.new_arrivals = convertedArrivals;
                newSetting.best_selling_products = convertedSelling;
                const saved = await HomepageController.createSetting(newSetting);

                let allCaroImg: TopCarouselImages[] = []
                for (let i = 0; i < tempCarousel.length; i++) {
                    let caroImg: TopCarouselImages = new TopCarouselImages();
                    caroImg.settings_id = saved.id
                    caroImg.image = tempCarousel[i].image
                    caroImg.image_name = tempCarousel[i].image_name;
                    allCaroImg.push(caroImg);
                }
                await remult.repo(TopCarouselImages).save(allCaroImg);
                setIsLoading(true);
                setModalMode("");
                getAllSettings();
                setIsCreating(false);
            }
        } catch (error) {
            setIsCreating(false);
            toast.error(`Could not save setting! Reason \n ${error}`);
        }
    }

    const deleteSetting =async (row:HomePageSettings) => {
        setIsLoading(true)
        try {
            const de = await HomepageController.deleteSetting(row);
            getAllSettings();
        } catch (error) {
            toast.error("Could not delete setting");
            setIsLoading(false);
            console.log(error);
        }
    }

    const setAsDefault =async (row:HomePageSettings) => {
        setIsLoading(true)
        try {
            let foundSetting = await HomepageController.findOneCurrentSetting();
            if(foundSetting){
                foundSetting.use_setting = false;
                row.use_setting = true;
                const saved = await remult.repo(HomePageSettings).save([foundSetting,row]);
                getAllSettings();
                // toast.error("You can not set this one as default please disable the current setting and enable this one")
            }else{
                row.use_setting = true;
                const saved = await remult.repo(HomePageSettings).save([foundSetting,row]);
                getAllSettings();
            }
        } catch (error) {
            setIsLoading(false);
            toast.error("An error occurred trying to set this as default")
        }
        
    }

    // const removeAsDefault =async (row:HomePageSettings) => {
    //     setIsLoading(true)
    //     try {
    //         let foundSetting = await HomepageController.findOneCurrentSetting();
    //         if(foundSetting){
    //             foundSetting.use_setting = false;
    //             row.use_setting = true;
    //             const saved = await remult.repo(HomePageSettings).save([foundSetting,row]);
    //             getAllSettings();
    //             // toast.error("You can not set this one as default please disable the current setting and enable this one")
    //         }else{
    //             row.use_setting = true;
    //             const saved = await remult.repo(HomePageSettings).save([foundSetting,row]);
    //             getAllSettings();
    //         }
    //     } catch (error) {
    //         setIsLoading(false);
    //         toast.error("An error occurred trying to set this as default")
    //     }
        
    // }

    const onSelect = async (e: FileUploadSelectEvent) => {
        let files: any[] = []
        for (let i = 0; i < e.files.length; i++) {
            const reader = new FileReader();
            reader.readAsDataURL(e.files[i])
            reader.onload = () => {
                // console.log('called: ', reader)
                files.push({
                    image: reader.result,
                    image_name: e.files[i].name
                })
                setTempCarousel(files);
            }
        }
    }

    const updateTools = (e: HomePageSettings) => {
        return (
            <div className='flex justify-content-evenly'>
                <Button 
                    label='Edit' 
                    onClick={() => {
                        setModalMode("edit")
                        setSelectedSetting(e)
                    }} 
                    icon="pi pi-file-edit" 
                />
                {!e.use_setting ? <Button 
                    label='Set as Default' 
                    icon="pi pi-heart" 
                    onClick={() => {
                        setAsDefault(e)
                    }}
                    className="bg-cyan-500 border-cyan-500"
                />: null}

                {e.use_setting ? 
                <div className="flex border-round-md bg-cyan-500 align-items-center p-3 font-semibold text-white text-lg">
                    <i className="pi pi-home mr-2"></i>
                    Default
                </div>
                : null}

                <Button 
                    className='bg-red-500 border-red-500' 
                    label="Delete" 
                    onClick={() =>{
                        if(e.use_setting === true){
                            toast.error("Please chose another setting as the default before deleting this setting");
                            return
                        }
                        deleteSetting(e)
                    }} 
                    icon="pi pi-trash" 
                />
            </div>
        )
    }

    const footerContent = (
        <div>
            <Button
                label="Cancel"
                loading={isCreating} icon="pi pi-times"
                onClick={() => setModalMode("")} className="p-button-text" />
            <Button
                label="Create"
                loading={isCreating}
                icon="pi pi-check"
                autoFocus
                onClick={() => {
                    createSetting()
                }}
            />
        </div>
    );


    useEffect(() => {
        getAllProducts();
        getAllSettings();
    }, [])


    return (
        <>
            <PageTitle title="Homepage Settings" />
            <div className="p-3 h-screen">
                <h2>Homepage Settings</h2>
                <div className='mb-3'>
                    <Button label='Add' onClick={() => setModalMode("add")} icon={`pi pi-fw ${PrimeIcons.PLUS}`} />
                </div>
                <div className='p-2'>
                    <DataTable
                        value={allSettings}
                        loading={isLoading}
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25, 50]}
                        currentPageReportTemplate="{first} to {last} of {totalRecords}">
                        <Column field="setting_name" header="Setting Name" style={{ width: '25%' }}></Column>
                        {/* <Column field="created_date" header="Date Added" body={dateBody} style={{ width: '25%' }}></Column> */}
                        <Column header="Management Tools" body={(e) => updateTools(e)} style={{ width: '25%' }}></Column>
                    </DataTable>
                </div>
            </div>

            <Dialog
                header="Add a new setting"
                visible={modalMode === "add"}
                style={{ width: '70vw' }}
                onHide={() => setModalMode("")}
                footer={footerContent}
            >
                <div className="m-0 card">
                    <div className='formgrid grid'>
                        <div className="field col-12">
                            <div className="flex flex-column gap-2">
                                <label htmlFor="product_name">Setting Name</label>
                                <InputText onChange={(e) => setSettingName(e.target.value)} id="product_name" aria-describedby="product_name_help" />
                                <small id="product_name_help">
                                    Enter a name for this setting
                                </small>
                            </div>
                        </div>
                        <div className="field col-6">
                            <div className="flex flex-column gap-2">
                                <label htmlFor="product_name">Top Section Header</label>
                                <InputText onChange={(e) => setHeroSectionMain(e.target.value)} id="product_name" aria-describedby="product_name_help" />
                                <small id="product_name_help">
                                    Enter a value for the top left header
                                </small>
                            </div>
                        </div>
                        <div className="field col-6">
                            <div className="flex flex-column gap-2">
                                <label htmlFor="product_name">Top Section Sub Text</label>
                                <InputText onChange={(e) => setHeroSubText(e.target.value)} id="product_name" aria-describedby="product_name_help" />
                                <small id="product_name_help">
                                    Enter a value for header sub text
                                </small>
                            </div>
                        </div>
                        <div className="field col-4">
                            <div className="flex flex-column gap-2">
                                <label htmlFor="product_name">Middle Card 1 Text</label>
                                <InputText onChange={(e) => setCard1Text(e.target.value)} id="product_name" aria-describedby="product_name_help" />
                                <small id="product_name_help">
                                    Enter a value for this setting
                                </small>
                            </div>
                        </div>
                        <div className="field col-4">
                            <div className="flex flex-column gap-2">
                                <label htmlFor="product_name">Middle Card 2 Text</label>
                                <InputText onChange={(e) => setCard2Text(e.target.value)} id="product_name" aria-describedby="product_name_help" />
                                <small id="product_name_help">
                                    Enter a value for this setting
                                </small>
                            </div>
                        </div>
                        <div className="field col-4">
                            <div className="flex flex-column gap-2">
                                <label htmlFor="product_name">Middle Card 3 Text</label>
                                <InputText onChange={(e) => setCard3Text(e.target.value)} id="product_name" aria-describedby="product_name_help" />
                                <small id="product_name_help">
                                    Enter a value for this setting
                                </small>
                            </div>
                        </div>
                        <div className="field col-6">
                            <div className="flex flex-column gap-2">
                                <label htmlFor="product_upload">Upload images for the top carousel (Max of 3)</label>
                                <FileUpload
                                    mode="advanced"
                                    name="image"
                                    // onUpload={onImageUpload} 
                                    accept="image/*"
                                    multiple
                                    maxFileSize={1000000}
                                    // onBeforeUpload={BeforeUpload}
                                    disabled={settingsName === ''}
                                    onSelect={onSelect}
                                />
                            </div>
                        </div>
                        <div className="field col-6">
                            <div className="flex flex-column gap-2">
                                <label htmlFor="product_upload">Select products to appear as new arrivals </label>
                                <div className="card flex justify-content-center">
                                    <MultiSelect
                                        value={selectedNewArrivals}
                                        onChange={(e: MultiSelectChangeEvent) => {
                                            let all = []
                                            for (let i = 0; i < e.value.length; i++) {
                                                all.push(e.value[i].id)
                                            }
                                            setNewArrivals(e.value);
                                            setTNewArrivals(all);
                                        }}
                                        options={products}
                                        display="chip"
                                        optionLabel="product_name"
                                        placeholder="Select Products"
                                        maxSelectedLabels={4}
                                        className="w-full"
                                        showSelectAll={false}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="field col-6">
                            <div className="flex flex-column gap-2">
                                <label htmlFor="product_upload">Select products to appear as best selling products (Max of 4)</label>
                                <div className="card flex justify-content-center">
                                    <MultiSelect
                                        value={selectedBestSelling}
                                        onChange={(e: MultiSelectChangeEvent) => {
                                            let all = []
                                            for (let i = 0; i < e.value.length; i++) {
                                                all.push(e.value[i].id)
                                            }
                                            setSelectedBestSelling(e.value);
                                            setSelBestSelling(all);
                                        }}
                                        options={products}
                                        display="chip"
                                        optionLabel="product_name"
                                        placeholder="Select Products"
                                        maxSelectedLabels={4}
                                        className={selectedBestSelling.length > 4 ? "p-invalid w-full" : "w-full"}
                                        showSelectAll={false}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="field flex col-6 align-content-center ">
                            <div className="flex flex-row text-center gap-2">
                                <Checkbox inputId="use_setting" onChange={(e) => setUseSetting(e.checked as boolean)} checked={use_setting} name="in_stock" />
                                <label htmlFor="use_setting" className="ml-2">Do you want to use this setting on the homepage?</label>
                            </div>
                        </div>
                    </div>
                </div>
            </Dialog>

            <Dialog
                header={`Editing setting ${selectedSetting?.setting_name}`}
                visible={modalMode === "edit"}
                style={{ width: '70vw' }}
                onHide={() => setModalMode("")}
                footer={footerContent}
            >
                <div className="m-0 card">
                    <div className='formgrid grid'>
                        <div className="field col-12">
                            <div className="flex flex-column gap-2">
                                <label htmlFor="product_name">Setting Name</label>
                                <InputText 
                                    onChange={(e) => setSettingName(e.target.value)}
                                    placeholder={selectedSetting?.setting_name}
                                />
                                <small id="product_name_help">
                                    Enter a new name for this setting
                                </small>
                            </div>
                        </div>
                        <div className="field col-6">
                            <div className="flex flex-column gap-2">
                                <label htmlFor="product_name">Top Section Header</label>
                                <InputText 
                                    onChange={(e) => setHeroSectionMain(e.target.value)} 
                                    placeholder={selectedSetting?.hero_section_main_text}
                                />
                                <small id="product_name_help">
                                    Enter a new value for the top left header
                                </small>
                            </div>
                        </div>
                        <div className="field col-6">
                            <div className="flex flex-column gap-2">
                                <label htmlFor="product_name">Top Section Sub Text</label>
                                <InputText 
                                    onChange={(e) => setHeroSubText(e.target.value)}
                                    placeholder={selectedSetting?.hero_section_sub_text}
                                />
                                <small id="product_name_help">
                                    Enter a new value for header sub text
                                </small>
                            </div>
                        </div>
                        <div className="field col-4">
                            <div className="flex flex-column gap-2">
                                <label htmlFor="product_name">Middle Card 1 Text</label>
                                <InputText 
                                    onChange={(e) => setCard1Text(e.target.value)} 
                                    placeholder={selectedSetting?.hero_section_card_1_text}
                                />
                                <small id="product_name_help">
                                    Enter a new value for this setting
                                </small>
                            </div>
                        </div>
                        <div className="field col-4">
                            <div className="flex flex-column gap-2">
                                <label htmlFor="product_name">Middle Card 2 Text</label>
                                <InputText 
                                    onChange={(e) => setCard2Text(e.target.value)} 
                                    placeholder={selectedSetting?.hero_section_card_2_text}
                                />
                                <small id="product_name_help">
                                    Enter a new value for this setting
                                </small>
                            </div>
                        </div>
                        <div className="field col-4">
                            <div className="flex flex-column gap-2">
                                <label htmlFor="product_name">Middle Card 3 Text</label>
                                <InputText 
                                    onChange={(e) => setCard3Text(e.target.value)} 
                                    placeholder={selectedSetting?.hero_section_card_3_text}
                                />
                                <small id="product_name_help">
                                    Enter a new value for this setting
                                </small>
                            </div>
                        </div>
                        <div className="field col-6">
                            <div className="flex flex-column gap-2">
                                <label htmlFor="product_upload">Upload images for the top carousel (Max of 3)</label>
                                <FileUpload
                                    mode="advanced"
                                    name="image"
                                    // onUpload={onImageUpload} 
                                    accept="image/*"
                                    multiple
                                    maxFileSize={1000000}
                                    // onBeforeUpload={BeforeUpload}
                                    disabled={settingsName === ''}
                                    onSelect={onSelect}
                                />
                            </div>
                        </div>
                        <div className="field col-6">
                            <div className="flex flex-column gap-2">
                                <label htmlFor="product_upload">Select products to appear as new arrivals </label>
                                <div className="card flex justify-content-center">
                                    <MultiSelect
                                        value={selectedNewArrivals}
                                        onChange={(e: MultiSelectChangeEvent) => {
                                            let all = []
                                            for (let i = 0; i < e.value.length; i++) {
                                                all.push(e.value[i].id)
                                            }
                                            setNewArrivals(e.value);
                                            setTNewArrivals(all);
                                        }}
                                        options={products}
                                        display="chip"
                                        optionLabel="product_name"
                                        placeholder="Select Products"
                                        maxSelectedLabels={4}
                                        className={"w-full"}
                                        showSelectAll={false}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="field col-6">
                            <div className="flex flex-column gap-2">
                                <label htmlFor="product_upload">Select products to appear as best selling products (Max of 4)</label>
                                <div className="card flex justify-content-center">
                                    <MultiSelect
                                        value={selectedBestSelling}
                                        onChange={(e: MultiSelectChangeEvent) => {
                                            let all = []
                                            for (let i = 0; i < e.value.length; i++) {
                                                all.push(e.value[i].id)
                                            }
                                            setSelectedBestSelling(e.value);
                                            setSelBestSelling(all);
                                        }}
                                        options={products}
                                        display="chip"
                                        optionLabel="product_name"
                                        placeholder="Select Products"
                                        maxSelectedLabels={4}
                                        className={selectedBestSelling.length > 4 ? "p-invalid w-full" : "w-full"}
                                        showSelectAll={false}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="field flex col-6 align-content-center ">
                            <div className="flex flex-row text-center gap-2">
                                <Checkbox inputId="use_setting" onChange={(e) => setUseSetting(e.checked as boolean)} checked={use_setting} name="in_stock" />
                                <label htmlFor="use_setting" className="ml-2">Do you want to use this setting on the homepage?</label>
                            </div>
                        </div>
                    </div>
                </div>
            </Dialog>

        </>
    )
}