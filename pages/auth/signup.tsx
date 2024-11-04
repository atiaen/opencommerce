import { Button } from 'primereact/button';
import PageTitle from '@/components/shared/page_title';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { useState } from 'react';
import Footer from '@/components/global/footer';
import Link from 'next/link';
import Navbar from '@/components/global/navbar';
import UserController from '@/src/shared/controllers/users/UserController';
import { Users } from '@/src/shared/entities/User/user';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/router';
import { ErrorCodes } from '@/src/shared/utils/constants/errorCodes';
import axios from 'axios';
import { remult } from 'remult';

const controller = new UserController();
// const user = new Users();

export default function Login() {
    const [password, setPassword] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [deliveryAddress, setDeliveryAddress] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [emailAddress, setEmailAddress] = useState('');
    const router = useRouter();


    const createUser = async () => {
        let user = {
            first_name: firstName,
            last_name: lastName,
            isAdmin: false,
            email_address: emailAddress,
            password: password,
            phone_number:phoneNumber,
            delivery_address: deliveryAddress,
        }
        setLoading(true);
        try {
            const res = await UserController.signUp(user);
            console.log(res);
            if (res.status === 201 && res.response) {
                toast.success("Thanks for signing up to PharmaCom. You can now log in");
                setLoading(false);
                router.push("/auth/login")
            }
            if (res.status === 500 || res.messageCode === ErrorCodes.badRequest) {
                toast.error(`An error with ${ErrorCodes.badRequest} has occured`);
                setLoading(false);
                // router.reload();
            }
            if (res.status === 400 && res.messageCode === ErrorCodes.userExists) {
                toast.error("An account with this email already exists");
                setLoading(false);
                // router.reload();
            }
            if (res.messageCode === ErrorCodes.unknownError) {
                toast.error(`An error with ${ErrorCodes.unknownError} has occured`);
                setLoading(false);
                // router.reload();
            }
        } catch (error) {
            console.log(error);
            setLoading(false);
            toast.error(`An error with ${ErrorCodes.unknownError} has occured`);
        }

    }

    return (
        <>
            <PageTitle title="Signup | PharmaCom" />
            <div className="flex justify-content-center px-8 w-full">
                <div className="card flex justify-content-center align-items-center">
                    <Card className='h-auto shadow-none'>
                        <div className=''>
                            <h2 className='mb-3'>Welcome to Medzone</h2>
                            <p className='mb-3'>Please create an account here</p>
                            <div className='formgrid grid'>
                                <div className="field md:col-6">
                                    <div className="flex flex-column gap-2 mb-4">
                                        <label htmlFor="first_name">First Name</label>
                                        <InputText onChange={(e) => setFirstName(e.target.value)} id="first_name" aria-describedby="first_name_help" />
                                        <small id="first_name_help">
                                            Enter a first name.
                                        </small>
                                    </div>
                                </div>
                                <div className="field md:col-6">
                                    <div className="flex flex-column gap-2 mb-4">
                                        <label htmlFor="first_name">Last Name</label>
                                        <InputText onChange={(e) => setLastName(e.target.value)} id="first_name" aria-describedby="first_name_help" />
                                        <small id="first_name_help">
                                            Enter a last name.
                                        </small>
                                    </div>
                                </div>
                                <div className="field md:col-6">
                                    <div className="flex flex-column gap-2 mb-4">
                                        <label htmlFor="first_name">Delivery Address</label>
                                        <InputText onChange={(e) => setDeliveryAddress(e.target.value)} id="first_name" aria-describedby="first_name_help" />
                                        <small id="first_name_help">
                                            Enter a delivery address.
                                        </small>
                                    </div>
                                </div>
                                <div className="field md:col-6">
                                    <div className="flex flex-column gap-2 mb-4">
                                        <label htmlFor="first_name">Email Address</label>
                                        <InputText onChange={(e) => setEmailAddress(e.target.value)} id="first_name" aria-describedby="first_name_help" />
                                        <small id="first_name_help">
                                            Enter an email address.
                                        </small>
                                    </div>
                                </div>
                                <div className="field md:col-6">
                                    <div className="flex flex-column gap-2 mb-4">
                                        <label htmlFor="pasword">Password</label>
                                        <Password inputClassName='w-full' feedback={false} onChange={(e) => setPassword(e.target.value)} id="first_name" toggleMask />
                                        <small id="">
                                            Enter a password.
                                        </small>
                                    </div>
                                </div>
                                 <div className="field md:col-6">
                                    <div className="flex flex-column gap-2 mb-4">
                                        <label htmlFor="phone_number">Phone Number</label>
                                        <InputText onChange={(e) => setPhoneNumber(e.target.value)} id="first_name" aria-describedby="first_name_help" />
                                        <small id="first_name_help">
                                            Enter a phone number.
                                        </small>
                                    </div>
                                </div>
                            </div>
                            <div className='flex justify-content-end'>
                                <Button className='md:w-3 w-full' label="Create" onClick={createUser} loading={loading} />
                            </div>
                            <div className='mt-4'>
                                <span>Already have an account? <Link href="/auth/login">Log in</Link></span>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
            <Footer />
        </>
    )
}