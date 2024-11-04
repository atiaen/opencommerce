import Image from "next/image";
import { Rating } from "primereact/rating";
import { useRouter } from 'next/router';

interface ProductProps {
    imageUrl: string;
    productName: string;
    categoryName: string;
    price: string | number;
    id: number;
}


export default function ProductItemHomePage(props: ProductProps) {
    const router = useRouter();

    return (
        <div 
            className="col-12 md:col-3  cursor-pointer text-center"
            onClick={() => {
                router.push(`/product/${props.id}`)
            }}
        >
            <div>
                <Image src={props.imageUrl} width={200} height={300} alt={`${props.productName} image`} />
            </div>
            <div>
                <p className="mb-0 text-sm">
                    {props.categoryName}

                </p>
            </div>
            <div>
                <h4 className="font-semibold mt-0 mb-0">
                    {props.productName}

                </h4>
            </div>
            <div>
                <h4 className="font-semibold mt-2">
                    &#8358;{props.price}

                </h4>
            </div>
        </div>
    )
}