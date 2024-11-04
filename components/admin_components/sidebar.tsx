import { PanelMenu } from 'primereact/panelmenu';
import { MenuItem } from 'primereact/menuitem';
import { useRouter } from 'next/router';

export default function AdminSidebar() {
    const router = useRouter();
    const items: MenuItem[] = [
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
                {
                    label: 'Homepage Settings',
                    icon: 'pi pi-fw pi-home',
                    command(event) {
                        router.push('/admin/manage/homepage_settings');
                    },
                },

            ],
            // style: router.pathname.includes("manage") ? { backgroundColor: "red" } : {}
        }

    ];
    return (
        <div className="hidden md:block h-screen w-15rem fixed z-3 left-auto bg-indigo-700">
            <div className="p-3 flex justify-content-center">
                <h3 className="text-white white-space-nowrap">Medzone Admin</h3>
            </div>
            <div className="sectionHolders p-3 flex justify-content-center">
                <PanelMenu 
                    multiple 
                    model={items} 
                    className="w-full md:w-25rem"
                    pt={{
                        headerAction: {
                            className:"bg-red-500  border-none text-white outline-none hover:text-800"
                        }
                    }}
                />
            </div>
        </div>
    )
}