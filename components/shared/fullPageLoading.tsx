import { ProgressSpinner } from "primereact/progressspinner";

export default function PageLoading() {
    return (
        <div className="card flex justify-content-center align-items-center h-full w-full">
            <ProgressSpinner />
        </div>
    )
}