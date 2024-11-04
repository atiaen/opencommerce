import React, { useRef, useState } from 'react';
import { OverlayPanel } from 'primereact/overlaypanel';
import { Menu } from 'primereact/menu';
import { MenuItem } from 'primereact/menuitem';
import useAuth from '@/src/shared/utils/hooks/authHook';
import { Avatar } from 'primereact/avatar';
import { useRouter } from 'next/router';
import { toast } from 'react-hot-toast';
import CookieManager from '@/src/shared/utils/cookieManager';
import { Button } from 'primereact/button';
import { Sidebar } from 'primereact/sidebar';
import { PanelMenu } from 'primereact/panelmenu';

export default function AdminNavbar() {
    const auth = useAuth();
    const op = useRef<any>(null);
    const router = useRouter();
    const [sidebarShow, setSidebarShow] = useState(false);

    const signOut = () => {
        CookieManager.deleteCookie("user")
        // sessionStorage.removeItem("user");
        toast.success("Logged out");
        router.push('/admin');
    }

    let items: MenuItem[] = [
        {
            label: 'Signout',
            icon: 'pi pi-fw pi-sign-out',
            command(event) {
                signOut();
            },
        },
    ];

    const items2: MenuItem[] = [
        {
            label: 'Reports',
            icon: 'pi pi-fw pi-th-large',
            items: [
                {
                    label: 'Dashboard',
                    icon: 'pi pi-fw pi-palette',
                    command(event) {
                        router.push('/admin/dashboard');
                    },
                },
                {
                    label: 'Orders',
                    icon: 'pi pi-fw pi-database',
                    command(event) {
                        router.push('/admin/dashboard/orders');
                    },

                },
            ],
            // style: router.pathname.includes("dashboard") ? {backgroundColor:"red"} : {},
            // className: "bg-green-600",
        },
        {
            label: 'Manage',
            icon: 'pi pi-fw pi-cog',
            items: [
                {
                    label: 'Users',
                    icon: 'pi pi-fw pi-users',
                    command(event) {
                        router.push('/admin/manage/user_management');
                    },
                },
                {
                    label: 'Products',
                    icon: 'pi pi-fw pi-chart-bar',
                    command(event) {
                        router.push('/admin/manage/products');
                    },
                },
                {
                    label: 'Categories',
                    icon: 'pi pi-fw pi-book',
                    command(event) {
                        router.push('/admin/manage/categories');
                    },
                },

            ],
            // style: router.pathname.includes("manage") ? { backgroundColor: "red" } : {}
        }

    ];

    return (
        <div className="h-4rem fixed top-auto w-full bg-indigo-800 align-content-center z-2">
            <div className="flex h-full justify-content-between md:justify-content-end align-items-center p-2">
                <Button
                    onClick={() => setSidebarShow(true)}
                    className='hover:surface-700 md:hidden border-transparent bg-indigo-800 p-0 border-0 focus:shadow-none'
                    aria-label="Menu"
                >
                    <i className='pi pi-bars text-white text-xl' />
                </Button>
                <Avatar onClick={(e) => {
                    if (op !== null) {
                        op.current.toggle(e)
                    }
                }} label={auth.user?.first_name.charAt(0)}
                    className="mr-2" size="normal" style={{ backgroundColor: '#2196F3', color: '#ffffff' }} shape="circle" />
                <OverlayPanel dismissable className='no-padding' ref={op}>
                    <Menu className='no-border' model={items} />
                </OverlayPanel>
            </div>
            <Sidebar className='bg-indigo-700' dismissable={false} visible={sidebarShow} position="left" onHide={() => setSidebarShow(false)}>
                <PanelMenu
                    multiple
                    model={items2}
                    className="w-full md:w-25rem"
                    pt={{
                        headerAction: {
                            className: "bg-red-500 border-none text-white outline-none hover:text-800"
                        }
                    }}
                />
            </Sidebar>
        </div>
    )
}