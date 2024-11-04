import Head from "next/head";

interface TitleProps {
    title: string;
}

export default function PageTitle(props: TitleProps) {
    return (
        <Head>
            <title>
                {props.title}
            </title>
            <meta name="description" content="Pharmacom, your one stop ecommerce platform" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <link rel="icon" href="/favicon.ico" />
        </Head>
    )
}