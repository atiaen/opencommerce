import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Push() {
    const router = useRouter();
    useEffect(() => {
        router.push("/")

    }, [])
    return (
        <>
        </>
    )

}