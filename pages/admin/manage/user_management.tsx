import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import PageTitle from "@/components/shared/page_title";
import { Button } from 'primereact/button';
import { useEffect, useState } from 'react';
import { PrimeIcons } from 'primereact/api';
import { Users } from '@/src/shared/entities/User/user';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/router';
import { remult } from 'remult';
import { InputText } from "primereact/inputtext";
import UserController from '@/src/shared/controllers/users/UserController';
import { Dialog } from 'primereact/dialog';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Checkbox } from "primereact/checkbox";
import { Password } from 'primereact/password';
import { ErrorCodes } from '@/src/shared/utils/constants/errorCodes';

export default function UserManagement() {
    const [newUserShow, setNewUserShow] = useState(false);
    const [editUserShow, setEditUserShow] = useState(false);
    const [deleteUserShow, setDeleteUserShow] = useState(false);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [deliveryAddress, setDeliveryAddress] = useState('');
    const [emailAddress, setEmailAddress] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [allUsers, setAllUsers] = useState<Users[]>([]);
    const [selected, setSelectedCategory] = useState<Users>();
    const [fetchLoading, setFetchLoading] = useState(true);
    const [isAdminUser, setIsAdminUser] = useState(false);

    const router = useRouter();

    const createUser = async () => {
        setIsLoading(true);
        if (firstName === '' || lastName === '') {
            toast.error("Please enter a first name or a last name");
        } else {
            try {
                let user = {
                    first_name: firstName,
                    last_name: lastName,
                    isAdmin: isAdminUser,
                    email_address: emailAddress,
                    password: password,
                    phone_number:'',
                    delivery_address: deliveryAddress,
                }

                const res= await UserController.signUp(user);
                if (res.status === 201 && res.response) {
                    toast.success("Thanks for signing up to PharmaCom. You can now log in");
                    setIsLoading(false);
                    router.reload();
                }
                if (res.status === 500 || res.messageCode === ErrorCodes.badRequest) {
                    toast.error(`An error with ${ErrorCodes.badRequest} has occured`);
                    setIsLoading(false);
                    // router.reload();
                }
                if (res.status === 400 && res.messageCode === ErrorCodes.userExists) {
                    toast.error("An account with this email already exists");
                    setIsLoading(false);
                    // router.reload();
                }
                if (res.messageCode === ErrorCodes.unknownError) {
                    toast.error(`An error with ${ErrorCodes.unknownError} has occured`);
                    setIsLoading(false);
                    // router.reload();
                }
            } catch (error) {
                console.log(error);
                toast.error("Could not create user");
                setIsLoading(false);
            }
        }

    }

    const editCategory = async () => {
        setIsLoading(true);
        if (firstName === '' || lastName === '') {
            toast.error("Please enter a category name or a category tag");
        } else {
            try {
                let modified = new Users();
                modified = selected as Users;
                modified.first_name = firstName;
                modified.last_name = lastName;
                modified.modified_date = new Date()
                await remult.repo(Users).update(selected?.id as number, modified)
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

    const deleteUser = async () => {
        setIsLoading(true);
        try {
            let modified = new Users();
            modified = selected as Users;
            modified.is_deleted = 1
            modified.modified_date = new Date();
            await remult.repo(Users).update(selected?.id as number, modified)
            toast.success("User successfully deleted");
            router.reload();
            setIsLoading(false);
        } catch (error) {
            console.log(error);
            toast.error("Could not delete user");
            setIsLoading(false);
        }
    }

    const getallUsers = async () => {
        const all = await UserController.getAllUsers();
        if (all) {
            setAllUsers(all);
            setFetchLoading(false);
        } else {
            setFetchLoading(false);
        }
    }

    const footerContent = (
        <div>
            <Button label="Cancel" loading={isLoading} icon="pi pi-times" onClick={() => setNewUserShow(false)} className="p-button-text" />
            <Button label="Create" loading={isLoading} icon="pi pi-check" onClick={() => createUser()} autoFocus />
        </div>
    );

    const editFooterContent = (
        <div>
            <Button label="Cancel" loading={isLoading} icon="pi pi-times" onClick={() => setEditUserShow(false)} className="p-button-text" />
            <Button label="Save" loading={isLoading} icon="pi pi-check" onClick={() => editCategory()} autoFocus />
        </div>
    );

    const dateBody = (cat: Users) => {
        return <div>{new Date(cat.created_date).toDateString()}</div>
    }

    const onEditClick = (row: any) => {
        setSelectedCategory(row);
        setEditUserShow(true);
        console.log(row);
    }
    const onDeleteClick = (row: any) => {
        setSelectedCategory(row);
        setDeleteUserShow(true);
        console.log(row);
    }

    const updateTools = (e: any) => (
        <div className='flex justify-content-evenly'>
            <Button label='Edit' onClick={() => onEditClick(e)} icon="pi pi-file-edit" />
            <Button className='bg-red-500 border-red-500' label="Delete" onClick={() => onDeleteClick(e)} icon="pi pi-trash" />
        </div>
    )


    useEffect(() => {
        getallUsers();
    }, [])



    return (
        <>
            <PageTitle title="User Management" />
            <div className="p-3 h-screen">
                <h2>User Management</h2>
                <div className='mb-3'>
                    <Button label='Add' onClick={() => setNewUserShow(true)} icon={`pi pi-fw ${PrimeIcons.PLUS}`} />
                </div>
                <div className='p-2'>
                    <DataTable
                        value={allUsers}
                        loading={fetchLoading}
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25, 50]}
                        currentPageReportTemplate="{first} to {last} of {totalRecords}">
                        <Column field="first_name" header="First Name" style={{ width: '10%' }}></Column>
                        <Column field="last_name" header="First Name" style={{ width: '10%' }}></Column>
                        <Column field="created_date" header="Date Added" body={dateBody} style={{ width: '25%' }}></Column>
                        <Column field="email_address" header="Email" style={{ width: '25%' }}></Column>
                        <Column field="isAdmin" header="Is Admin?" style={{ width: '10%' }}></Column>
                        <Column header="Management Tools" body={updateTools} style={{ width: '25%' }}></Column>
                    </DataTable>
                </div>
            </div>
            <Dialog 
                header="Add a new user" 
                visible={newUserShow} 
                // style={{ width: '100vw' }} 
                onHide={() => setNewUserShow(false)} 
                footer={footerContent}
                breakpoints={{
                    '350px': "98vw",
                    '768px': "70vw"
                }}
            >
                <div className="m-0 card">
                    <div className='formgrid grid'>
                        <div className="field col-6">
                            <div className="flex flex-column gap-2 mb-4">
                                <label htmlFor="first_name">First Name</label>
                                <InputText onChange={(e) => setFirstName(e.target.value)} id="first_name" aria-describedby="first_name_help" />
                                <small id="first_name_help">
                                    Enter a first name.
                                </small>
                            </div>
                        </div>
                        <div className="field col-6">
                            <div className="flex flex-column gap-2 mb-4">
                                <label htmlFor="first_name">Last Name</label>
                                <InputText onChange={(e) => setLastName(e.target.value)} id="first_name" aria-describedby="first_name_help" />
                                <small id="first_name_help">
                                    Enter a last name.
                                </small>
                            </div>
                        </div>
                        <div className="field col-6">
                            <div className="flex flex-column gap-2 mb-4">
                                <label htmlFor="first_name">Delivery Address</label>
                                <InputText onChange={(e) => setDeliveryAddress(e.target.value)} id="first_name" aria-describedby="first_name_help" />
                                <small id="first_name_help">
                                    Enter a delivery address.
                                </small>
                            </div>
                        </div>
                        <div className="field col-6">
                            <div className="flex flex-column gap-2 mb-4">
                                <label htmlFor="first_name">Email Address</label>
                                <InputText onChange={(e) => setEmailAddress(e.target.value)} id="first_name" aria-describedby="first_name_help" />
                                <small id="first_name_help">
                                    Enter an email address.
                                </small>
                            </div>
                        </div>
                        <div className="field col-6">
                            <div className="flex flex-column gap-2 mb-4">
                                <label htmlFor="first_name">Password</label>
                                <Password feedback={false} onChange={(e) => setPassword(e.target.value)} id="first_name" toggleMask />
                                <small id="first_name_help">
                                    Enter a password.
                                </small>
                            </div>
                        </div>
                        <div className="field col-6">
                            <div className="flex flex-row gap-2">
                                <Checkbox inputId="is_admin" onChange={(e) => setIsAdminUser(e.checked as boolean)} checked={isAdminUser} name="is_admin" />
                                <label htmlFor="is_admin" className="ml-2">Is this an Admin user?</label>
                            </div>
                        </div>
                    </div>
                </div>
            </Dialog>

            <Dialog 
                header={`Editing ${selected?.first_name} ${selected?.last_name}`} 
                visible={editUserShow}
                style={{ width: '98vw' }} 
                onHide={() => setEditUserShow(false)} 
                footer={editFooterContent}
                breakpoints={{
                    '350px': "98vw",
                    '768px': "70vw"
                }}
                >
                <div className="m-0 card">
                    <div className='formgrid grid'>
                        <div className="field col-6">
                            <div className="flex flex-column gap-2 mb-4">
                                <label htmlFor="first_name">First Name</label>
                                <InputText onChange={(e) => setFirstName(e.target.value)} id="first_name" aria-describedby="first_name_help" />
                                <small id="first_name_help">
                                    Enter a first name.
                                </small>
                            </div>
                        </div>
                        <div className="field col-6">
                            <div className="flex flex-column gap-2 mb-4">
                                <label htmlFor="first_name">Last Name</label>
                                <InputText onChange={(e) => setLastName(e.target.value)} id="first_name" aria-describedby="first_name_help" />
                                <small id="first_name_help">
                                    Enter a last name.
                                </small>
                            </div>
                        </div>
                        <div className="field col-6">
                            <div className="flex flex-column gap-2 mb-4">
                                <label htmlFor="first_name">Delivery Address</label>
                                <InputText onChange={(e) => setDeliveryAddress(e.target.value)} id="first_name" aria-describedby="first_name_help" />
                                <small id="first_name_help">
                                    Enter a delivery address.
                                </small>
                            </div>
                        </div>
                        <div className="field col-6">
                            <div className="flex flex-column gap-2 mb-4">
                                <label htmlFor="first_name">Email Address</label>
                                <InputText onChange={(e) => setEmailAddress(e.target.value)} id="first_name" aria-describedby="first_name_help" />
                                <small id="first_name_help">
                                    Enter an email address.
                                </small>
                            </div>
                        </div>
                        <div className="field col-6">
                            <div className="flex flex-column gap-2 mb-4">
                                <label htmlFor="first_name">Password</label>
                                <Password feedback={false} onChange={(e) => setPassword(e.target.value)} id="first_name" toggleMask />
                                <small id="first_name_help">
                                    Enter a password.
                                </small>
                            </div>
                        </div>
                        <div className="field col-6">
                            <div className="flex flex-row gap-2">
                                <Checkbox inputId="is_admin" onChange={(e) => setIsAdminUser(e.checked as boolean)} checked={isAdminUser} name="is_admin" />
                                <label htmlFor="is_admin" className="ml-2">Is this an Admin user?</label>
                            </div>
                        </div>
                    </div>
                </div>
            </Dialog>

            <ConfirmDialog visible={deleteUserShow} onHide={() => setDeleteUserShow(false)} message="Are you sure you want to delete this category?"
                header="Confirmation" icon="pi pi-exclamation-triangle" accept={deleteUser} reject={() => setDeleteUserShow(false)} />
        </>
    )
}