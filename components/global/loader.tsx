import useAuth from '@/src/shared/utils/hooks/authHook';
import { ProgressSpinner } from 'primereact/progressspinner';

interface LoaderProps {
    children: any;
}

export default function Loader(props: LoaderProps) {
    const auth = useAuth()

    return (
        <>
            {!auth.isLoading ?
                props.children
                : (
                    <div className="card flex justify-content-center align-items-center h-full w-full">
                        <ProgressSpinner />
                    </div>
                )}
        </>
    )
}