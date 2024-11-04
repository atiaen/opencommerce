import { Button } from 'primereact/button';
import PageTitle from '@/components/shared/page_title';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { useEffect, useState } from 'react';
import { Users } from '@/src/shared/entities/User/user';
import UserController from '@/src/shared/controllers/users/UserController';
import { useRouter } from 'next/router';
import { toast } from 'react-hot-toast';
import useAuth from '@/src/shared/utils/hooks/authHook';
import { ProgressSpinner } from 'primereact/progressspinner';
import PageLoading from '@/components/shared/fullPageLoading';
import CookieManager from '@/src/shared/utils/cookieManager';


export default function SignIn() {
    const router = useRouter()
    const auth = useAuth()
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(true);

    const getUser = async () => {
        setLoading(true);
        if (email !== '' && password !== '') {
            try {
                // const controller = new UserController()
                const res = await UserController.getAdminUserByEmailPassword(email, password)
                if (res?.response && res.status === 200) {
                    CookieManager.setCookie("user", JSON.stringify(res.response));
                    // sessionStorage.setItem("user", JSON.stringify(user));
                    toast.success("Successfully logged in");
                    setLoading(false);
                    router.push('/admin/dashboard');
                } else {
                    setLoading(false);
                    toast.error("User could not be found");
                }
            } catch (err) {
                console.log(err);
                setLoading(false);
                toast.error("Unfortunately and error has occured please try again later");
            }
        } else {
            setLoading(false);
            toast.error("Please enter an appropriate email/password");
        }

    }

    useEffect(() => {
       setPageLoading(false);

    }, [])


    if (auth.user?.isAdmin && !auth.isLoading) {
        router.push('/admin/dashboard');
    }

    return (
        <>
            <PageTitle title='Admin Login' />
            {!pageLoading ? (
                <div className="flex justify-content-center h-full w-full">
                    <div className="card flex justify-content-center align-items-center">
                        <Card className='w-max h-auto'>
                            <div className=''>
                                <h2 className='mb-3'>Admin Center</h2>
                                <div className='flex flex-column gap-3'>
                                    <div>
                                        <span className="p-float-label">
                                            <InputText id="email" className='w-12' value={email} onChange={(e) => setEmail(e.target.value)} />
                                            <label htmlFor="email">Email</label>
                                        </span>
                                    </div>
                                    <div>
                                        <span className="p-float-label">
                                            <Password inputId="password" feedback={false} value={password} onChange={(e) => setPassword(e.target.value)} toggleMask />
                                            <label htmlFor="password">Password</label>
                                        </span>
                                    </div>
                                    <div className='flex justify-content-end'>
                                        <Button label="Login" loading={loading} onClick={getUser} />
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            ) : (
                <PageLoading />
            )}

        </>
    )
}