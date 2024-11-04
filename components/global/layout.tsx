import useAuth from "@/src/shared/utils/hooks/authHook";
import { useRouter } from "next/router";
import AdminNavbar from "../admin_components/navbar";
import AdminSidebar from "../admin_components/sidebar";
import Push from "../shared/text";

// function Push() {
//     const router = useRouter()
//     router.push("/")
//     return (
//         <>
//    w-screen       </>
//     )
 
// }

export default function Layout(props: { children: any, classname: any }) {
    const router = useRouter()

    return (
        <main className={`${props.classname} h-screen d-flex`}>
            {router.pathname.includes('admin/') ?
                <>
                    <AdminSidebar />
                    <div className="md:mainLayout">
                        <AdminNavbar />
                        <div 
                            className="customWidth bodypos relative"
                        >
                            {props.children}
                        </div>
                    </div>
                </> : <>{props.children}</>
            }

    

        </main>
    )
}