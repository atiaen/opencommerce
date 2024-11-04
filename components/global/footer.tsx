import Link from "next/link";

export default function Footer() {
    return (
        <div className="w-full bottom-0 line-height-4">
            <div className="p-4 md:p-7 md:flex justify-content-center md:justify-content-evenly md:gap-1">
                <div className="col-12 sm:text-center text-start md:col-4">
                    <h2 className="font-semibold sm:text-center text-start">About Us</h2>
                    <p>
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                        Eius quae reiciendis distinctio voluptates sed dolorum excepturi iure eaque,
                        aut unde.
                    </p>
                </div>
                <div className="col-12  md:col-4 line-height-4">
                    <h2 className="font-semibold  sm:text-center text-start">Quick Links</h2>
                    <ul className="list-none px-0  sm:text-center text-start">
                        <li>
                            <Link className="no-underline text-900 hover:text-300" href="/">
                                Home
                            </Link>
                        </li>
                        <li>
                            <Link className="no-underline text-900 hover:text-300" href="/store">
                                Store
                            </Link>
                        </li>
                        {/* <li>
                            <Link className="no-underline text-900 hover:text-300" href="/">
                                Another test
                            </Link>
                        </li> */}
                    </ul>
                </div>
                <div className="col-12 text-start md:col-4 line-height-4">
                    <h2 className="font-semibold">Contact Info</h2>
                    <ul className="list-none px-0">
                        <li>
                            <i className="pi pi-map-marker mr-3" />
                            Some address,State,Country
                        </li>
                        <li>
                            <i className="pi pi-phone  mr-3" />
                            +23491212121
                        </li>
                        <li>
                            <i className="pi pi-envelope  mr-3" />
                            Maecenas pharetra
                        </li>
                    </ul>
                </div>
            </div>
            <footer className="p-2 flex justify-content-center text-center">
                <p>Copyright © {new Date().getFullYear()}</p>
            </footer>
        </div>

    )
}