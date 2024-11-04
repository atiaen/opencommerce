
import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Button } from 'primereact/button';
import { Sidebar } from 'primereact/sidebar';
import { OverlayPanel } from 'primereact/overlaypanel';
import { useRouter } from 'next/router';
import useAuth from '@/src/shared/utils/hooks/authHook';
import { Category } from '@/src/shared/entities/Categories/category';
import CategoryController from '@/src/shared/controllers/category/CategoryController';
import CookieManager from '@/src/shared/utils/cookieManager';
import toast from 'react-hot-toast';


export default function Navbar() {
    const [sidebarShow, setSidebarShow] = useState(false);
    const [categories, setCategories] = useState<Category[]>([])
    const op = useRef<any>(null);
    const auth = useAuth()
    const router = useRouter();

    const getAllCategories = async () => {
        try {
            const categories = await CategoryController.getAllCategories();
            setCategories(categories);
        } catch (e) {
            console.log(e);
        }
    }

    const signOut = () => {
        CookieManager.deleteCookie("user")
        // sessionStorage.removeItem("user");
        if (router.pathname === "/profile") {
            router.push('/store');
        } else {
            router.reload();
        }
        toast.success("Logged out");
    }


    useEffect(() => {
        getAllCategories();
    }, [])

    return (
        <nav className="bg-red-500 shadow-3 w-full ">
            <div className='container md:mx-7 flex justify-content-evenly md:justify-content-evenly align-items-center px-4 py-2 md:py-2 md:px-4 '>
                <div className='flex w-6 md:w-2 md:ml-4'>
                    <Link href="/" style={{ textDecoration: "none", color: "white" }}>
                        <h1>
                            Medzone
                        </h1>
                    </Link>
                </div>
                <div className='md:flex hidden justify-content-around w-6'>
                    <div
                        onClick={() => {
                            router.push('/store')
                        }}
                        className={`hover:text-300 text-white p-3 cursor-pointer focus:shadow-none ${router.pathname.includes('store') ? 'border-bottom-2 border-white' : ''}`}
                    >
                        <span className='font-semibold '>Store</span>
                    </div>
                    <div
                        className={`hover:text-300 text-white p-3 cursor-pointer focus:shadow-none ${router.pathname.includes('categories') ? 'border-bottom-2 border-white' : ''}`}
                        onClick={(e) => {
                            op.current.toggle(e);
                        }}
                    >
                        <span className='font-semibold'>Categories</span>
                    </div>
                    <OverlayPanel className='w-8rem text-center' ref={op} showCloseIcon={false}>
                        {categories.length === 0 ? (<p>No categories found</p>) :
                            categories.map((cat, index) => (
                                <Link key={index} className='no-underline' href={`/store?category=${encodeURIComponent(cat.id)}`}>
                                    <p key={index} className='font-semibold select-none cursor-pointer hover:text-300'>{cat.category_name}</p>
                                </Link>
                            ))
                        }
                    </OverlayPanel>
                    <div
                        className={`hover:text-300 text-white p-3 cursor-pointer focus:shadow-none ${router.pathname.includes('about') ? 'border-bottom-2 border-white' : ''}`}
                        onClick={() => {
                            router.push('/about_us')
                        }}
                    >
                        <span className='font-semibold'>About Us</span>
                    </div>
                    <div
                        className={`hover:text-300 text-white p-3 cursor-pointer focus:shadow-none ${router.pathname.includes('contact') ? 'border-bottom-2 border-white' : ''}`}
                        onClick={() => {
                            router.push('/contact_us')
                        }}
                    >
                        <span className='font-semibold'>Contact Us</span>
                    </div>
                </div>
                <div className='flex align-items-center md:w-2 w-6 justify-content-end '>
                    <div className='hidden md:flex mr-2 justify-content-between'>
                        <Button onClick={() => {
                            router.push("/cart")
                        }} className='bg-red-500 hover:bg-primary-200 border-transparent p-2 border-0 focus:shadow-none' aria-label="Cart">
                            <i className='pi pi-shopping-cart text-white text-xl' />
                        </Button>
                        <Button onClick={() => {
                            if (auth.user !== undefined) {
                                router.push("/profile");
                            } else {
                                router.push("/auth/login")
                            }
                        }} className='bg-red-500 hover:bg-primary-200 border-transparent p-2 border-0 focus:shadow-none' aria-label="User">
                            <i className='pi pi-user text-white text-xl' />
                        </Button>
                        {auth.user !== undefined ?
                            <Button
                                onClick={signOut}
                                className='bg-red-500 hover:bg-primary-200 border-transparent p-2 border-0 focus:shadow-none' aria-label="User"
                            >
                                <i className='pi pi-sign-out text-white text-xl' />
                            </Button> : null}
                    </div>
                    <div className='sm:block md:hidden flex justify-content-end'>
                        <Button onClick={() => setSidebarShow(true)} className='bg-red-500 hover:surface-700 border-transparent p-0 border-0 focus:shadow-none' aria-label="Menu">
                            <i className='pi pi-bars text-white text-xl' />
                        </Button>
                        <Sidebar dismissable={false} visible={sidebarShow} position="right" onHide={() => setSidebarShow(false)}>
                            <h2>Menu</h2>
                            <div>
                                {auth.user === undefined ?
                                    <>
                                        <Link href="/auth/login" className='link-no-color'>
                                            <p>Login</p>
                                        </Link>
                                        <Link href="/auth/signup" className='link-no-color'>
                                            <p>Sign up</p>
                                        </Link>
                                    </>
                                    :
                                    <>
                                        <Link href="/cart" style={{ textDecoration: "none", color: "black" }}>
                                            <p>
                                                Cart
                                            </p>
                                        </Link>
                                        <Link href="/profile" style={{ textDecoration: "none", color: "black" }}>
                                            <p>
                                                Profile
                                            </p>
                                        </Link>
                                    </>}
                                <Link href="/store" style={{ textDecoration: "none", color: "black" }}>
                                    <p>
                                        Store
                                    </p>
                                </Link>
                                <Link href="/about_us" style={{ textDecoration: "none", color: "black" }}>
                                    <p>
                                        About Us
                                    </p>
                                </Link>
                                <Link href="/contact_us" style={{ textDecoration: "none", color: "black" }}>
                                    <p>
                                        Contact Us
                                    </p>
                                </Link>
                            </div>
                        </Sidebar>
                    </div>
                </div>
            </div>
        </nav >
    )
}
