import Image from 'next/image';
import Navbar from "@/components/global/navbar";
import Footer from "@/components/global/footer";
import PageTitle from "@/components/shared/page_title";

export default function AboutUs() {
    return (
        <>
            <PageTitle title="Store" />
            <Navbar />
            <div>
                <div
                    style={{
                        objectFit: 'cover',
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'center',
                        position: 'relative',
                        width: '100%',
                        minHeight: 400,
                        height: 700,
                        backgroundImage: "url('/hero_1.jpg')",
                        backgroundSize: 'cover'
                    }}
                    className='flex align-items-center'
                >
                    <div className='mx-auto w-6 text-white text-center text-xl'>
                        <h1 className='mt-0'>About Us</h1>
                        <p>
                            Lorem ipsum dolor sit amet consectetur adipisicing elit.
                            Rerum obcaecati natus iure voluptatum eveniet harum recusandae ducimus saepe.
                        </p>
                    </div>
                </div>

                <div className='px-2 py-5 mt-5 mb-5 md:flex justify-content-evenly'>
                    <div className='mb-4 md:mb-0'>
                        <Image
                            className=''
                            src={'/hero_1.jpg'} alt="section 2 image"
                            width={350} height={250}
                        />
                    </div>
                    <div className='md:w-6'>
                        <h2 className='mt-0 text-center'>How we started</h2>
                        <p className='text-justify'>
                            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eius repellat,
                            dicta at laboriosam, nemo exercitationem itaque eveniet architecto cumque,
                            deleniti commodi molestias repellendus quos sequi hic fugiat asperiores illum.
                            Atque, in, fuga excepturi corrupti error corporis aliquam unde nostrum quas.
                        </p>
                        <p className='text-justify'>
                            Accusantium dolor ratione maiores est deleniti nihil?
                            Dignissimos est, sunt nulla illum autem in, quibusdam cumque recusandae,
                            laudantium minima repellendus.
                        </p>
                    </div>
                </div>

                <div className='px-2 py-5  md:flex justify-content-evenly'>
                    <div className='md:w-6'>
                        <h2 className='mt-0 text-center'>What we do</h2>
                        <p className='text-justify'>
                            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eius repellat,
                            dicta at laboriosam, nemo exercitationem itaque eveniet architecto cumque,
                            deleniti commodi molestias repellendus quos sequi hic fugiat asperiores illum.
                            Atque, in, fuga excepturi corrupti error corporis aliquam unde nostrum quas.
                        </p>
                        <p className='text-justify'>
                            Accusantium dolor ratione maiores est deleniti nihil?
                            Dignissimos est, sunt nulla illum autem in, quibusdam cumque recusandae,
                            laudantium minima repellendus.
                        </p>
                    </div>
                    <div className='mb-4 md:mb-0'>
                        <Image
                            className=''
                            src={'/hero_1.jpg'} alt="section 2 image"
                            width={350} height={250}
                        />
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}