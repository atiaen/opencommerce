import type { AppProps } from 'next/app';
import { Inter,Montez,Rubik } from 'next/font/google';
import 'primereact/resources/themes/lara-light-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import '../styles/globals.css'
import Layout from '@/components/global/layout';
import { toast, Toaster, ToastBar } from 'react-hot-toast';
import { Button } from 'primereact/button';

const inter = Rubik({
  subsets: ["cyrillic"],
  weight: '400'
})

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Toaster>
        {(t) => (
          <ToastBar toast={t}>
            {({ icon, message }) => (
              <>
                {icon}
                {message}
                {t.type !== 'loading' && (
                  <Button onClick={() => toast.dismiss(t.id)} icon="pi pi-times" className="p-button-danger p-button-rounded p-button-text" aria-label="Cancel" />
                )}
              </>
            )}
          </ToastBar>
        )}
      </Toaster>
      <Layout classname={inter.className}>
        <Component {...pageProps} />
      </Layout>
    </>
  )
}
