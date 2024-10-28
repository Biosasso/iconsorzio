import { getSession } from 'next-auth/react';
import Head from 'next/head'

import AuthForm from '../components/auth/auth-form'

export default function Home(props) {

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <Head>
        <title>iConsorzio.it</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex flex-col items-center justify-center w-full flex-1 px-1 md:px-20 text-center">

        <AuthForm {...props} />
      </main>

      <footer className="flex items-center justify-center w-full h-24 border-t">
        <p
          className="block items-center justify-center"
        // href="https://www.mrmichetti.it"
        // target="_blank"
        // rel="noopener noreferrer"
        >
          Powered by{' '} Parsec S.r.l.
        </p>

      </footer>
    </div>
  )
}

export async function getServerSideProps(context) {

  const userSession = await getSession(context);

  if (userSession) {
    return {
      redirect: {
        destination: '/dashboard',
        permanent: false,
      },
    };
  }


  return {
    props: {
      userSession
    }
  }
}
