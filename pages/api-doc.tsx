import { InferGetServerSidePropsType } from 'next';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import dynamic from 'next/dynamic';
import { SwaggerUIProps } from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';
import PageTitle from '@/components/shared/page_title';
import api from './api/[...remult]';

const SwaggerUI = dynamic<SwaggerUIProps>(import('swagger-ui-react'), { ssr: false });

function ApiDoc({ spec }: InferGetServerSidePropsType<typeof getServerSideProps>) {
    return (
        <>
            <PageTitle title='Api Documents' />
            <SwaggerUI spec={spec} />
        </>
    );
}

export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {
    const { user } = context.req.cookies;
    let parsedUser;
    if (user !== null && user !== undefined) {
        parsedUser = JSON.parse(user as string);
    }
    if (parsedUser === undefined) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            }
        }
    } else if (parsedUser.isAdmin) {
        const spec = api.openApiDoc({title:"PharmaCom Docs"});
        return {
            props: {
                spec
            }
        }
    } else {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            }
        }
    }

}

// export const getStaticProps: GetStaticProps = async (context) => {
//     console.log(context);
//     const spec = await api.openApiDoc({ title: "Pharma-Com Docs" });
//     return {
//         props: {
//             spec,
//         },
//     };
// };

export default ApiDoc;