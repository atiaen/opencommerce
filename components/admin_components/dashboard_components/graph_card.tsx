import { Skeleton } from "primereact/skeleton";

interface ValueProps{
    cardName:string;
    cardValues: string | number;
    isLoadingValues:boolean;
}

const colors: string[] = ["bg-green-400","bg-yellow-500","bg-orange-500"]

export default function ValueCard(props:ValueProps){
    return(
        <div className={`${colors[Math.floor(Math.random() * colors.length)]} col`}>
            <div className="flex justify-content-between">
                <div>
                    {props.isLoadingValues ? <Skeleton size="2rem" className="mr-2"></Skeleton> : <h3>{props.cardValues}</h3>}
                    <p>{props.cardName}</p>
                </div>
                <div>
                    <i className="pi pi-qrcode" style={{fontSize: '5rem'}}></i>
                </div>
            </div>
        </div>
    )
}