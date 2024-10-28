import 'tailwindcss/tailwind.css';
import '../src/calendario.css'
import { SessionProvider, useSession } from 'next-auth/react';
import { NotificationContextProvider } from '../store/notifications'

function MyApp({
  Component,
  pageProps: { session, ...pageProps },
}) {

  return (

    <SessionProvider>
      <NotificationContextProvider>
        <Component {...pageProps} />
      </NotificationContextProvider>
    </SessionProvider>


  )
}

export default MyApp


// function Auth({ children }) {
//   const { data: session, status } = useSession()
//   const isUser = !!session?.user
//   React.useEffect(() => {
//     if (status === "loading") return // Do nothing while loading
//     if (!isUser) signIn() // If not authenticated, force log in
//   }, [isUser, status])

//   if (isUser) {
//     return children
//   }

//   // Session is being fetched, or no user.
//   // If no user, useEffect() will redirect.
//   return <div>Loading...</div>
// }