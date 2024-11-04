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
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/router';
import CookieManager from '@/src/shared/utils/cookieManager';
import useAuth from '@/src/shared/utils/hooks/authHook';

export default function Login() {
    const router = useRouter();
    const auth = useAuth();

    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [loading, setLoading] = useState(false);

    const login = async () => {
        setLoading(true);
        try {
            if (email !== null && password !== '') {
                const response = await UserController.login(email, password);
                if (response.status === 200) {
                    setLoading(false);
                    CookieManager.setCookie("user", JSON.stringify(response.response))
                    toast.success("Successfully logged in");
                    router.push('/cart');
                }
                if (response.status === 400) {
                    setLoading(false);
                    toast.error(response.message);
                }
                if (response.status === 404) {
                    setLoading(false);
                    toast.error(response.message);
                }
            } else {
                setLoading(false);
                toast.error("Please enter an email or password");
            }
        } catch (error) {
            console.log(error);
            setLoading(false);
            toast.error("Unfortunately and error has occured please try again later");
        }

    }

    if (auth.user) {
        router.push('/profile');
    }

    return (
        <>
            <PageTitle title="Login | PharmaCom" />
            {/* <Navbar /> */}
            <div className="flex justify-content-center px-4 md:px-3 w-full">
                <div className="card flex justify-content-center align-items-center">
                    <Card className='h-auto shadow-none'>
                        <div className=''>
                            <h2 className='mb-3'>Welcome back to Medzone</h2>
                            <p className='mb-3'>Please log in here</p>
                            <div className='flex flex-column gap-3'>
                                <div className='mb-3 mt-2'>
                                    <span className="p-float-label">
                                        <InputText id="email" className='w-12' value={email} onChange={(e) => setEmail(e.target.value)} />
                                        <label htmlFor="email">Email</label>
                                    </span>
                                </div>
                                <div>
                                    <span className="p-float-label">
                                        <Password 
                                            inputId="password" 
                                            className='w-full'
                                            inputClassName='w-full'
                                            feedback={false} 
                                            value={password} 
                                            onChange={(e) => setPassword(e.target.value)} 
                                            toggleMask 
                                        />
                                        <label htmlFor="password">Password</label>
                                    </span>
                                </div>
                                <div className='flex justify-content-end'>
                                    <Button label="Login" onClick={login} loading={loading} />
                                </div>
                            </div>
                            <div className='mt-4'>
                                <span>Don't have an account? <Link href="/auth/signup">Sign up</Link></span>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
            <Footer />
        </>
    )
}