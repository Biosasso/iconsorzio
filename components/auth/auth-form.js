import { useState, useRef } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import logoPic from '../../public/logo.png'


function AuthForm() {
  const emailInputRef = useRef();
  const passwordInputRef = useRef();
  const nameInputRef = useRef();
  const autoscuolaInputRef = useRef();
  const [appartenenza, setAppartenenza] = useState('autoscuola');

  const [isLogin, setIsLogin] = useState(true);
  const router = useRouter();
  const [loginError, setLoginError] = useState();
  const [resetError, setResetError] = useState(true);
  const [showLoader, setShowLoader] = useState(false);

  const [emailSend, setEmailSend] = useState(false);
  const [emailMessage, setEmailMessage] = useState('')

  const {
    query: { subscription },
  } = useRouter();

  const [hidden, setHidden] = useState('hidden')

  async function switchAuthModeHandler() {
    setIsLogin((prevState) => !prevState);
    setHidden('hidden')
  }

  async function submitHandler(event) {

    event.preventDefault();
    // setShowLoader(true);

    const enteredEmail = emailInputRef.current.value;
    const enteredPassword = isLogin ? passwordInputRef.current.value : '';
    const enteredName = !isLogin ? nameInputRef.current.value : '';
    const enteredAutoscuola = !isLogin && appartenenza === 'autoscuola' ? autoscuolaInputRef.current.value : '';

    // optional: Add validation

    if (isLogin) {
      const result = await signIn('credentials', {
        redirect: false,
        email: enteredEmail,
        password: enteredPassword,
        linkAccount: true,
      });

      if (result.error) {
        setLoginError('Controlla email e password. Se non sei ancora registrato registrati adesso!')
        setHidden('')
        setShowLoader(false)
      }

      if (!result.error) {
        router.replace('/dashboard');
        if (!subscription) {
          router.replace('/dashboard');
        }
        else if (subscription == 'true') {
          router.replace('/dashboard');
        }

      }
    } else {

      try {
        const response = await fetch('/api/auth/newAccountRequest', {
          method: 'POST',
          body: JSON.stringify({
            email: enteredEmail,
            name: enteredName,
            appartenenza: appartenenza,
            autoscuola: enteredAutoscuola
          }),
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();
        if (data.statusCode === 200) {
          setEmailSend(true)
          setEmailMessage(data.message)
        }

      } catch (error) {
        if (error instanceof SyntaxError) {
          setLoginError("Errore generico, riprova! Se l'errore dovesse persistere ti preghiamo di contattarci. Grazie")
        }
        else {
          setLoginError(error.message)
        }

        setHidden('')
        setShowLoader(false)
      }
    }
  }

  async function validationEmail(email) {
    if (!isLogin) {
      const data = {
        email: email
      }
      const findEmail = await fetch('/api/auth/checkEmailExist', {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const emailRes = await findEmail.json();

      if (emailRes.statusCode === 200) {
        setResetError(false)

      }
      else if (emailRes.statusCode === 400) {
        setResetError(true)
      }

    }

  }

  return (
    <>
      <div className="min-h-full flex flex-col justify-center py-12 px-0 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <Image
            className="mx-auto h-12 w-auto"
            src={logoPic}
            alt="iConsorzio"
            priority={true}
          />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">{isLogin ? 'Accedi al portale' : 'Richiedi un account'}</h2>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <form onSubmit={submitHandler} method="POST" className="space-y-6">
              {!isLogin &&
                <>
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Nome e cognome
                    </label>
                    <div className="mt-1">
                      <input
                        id="name"
                        name="name"
                        type="text"
                        autoComplete="Nome"
                        ref={nameInputRef}
                        required
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                      Appartenenza
                    </label>
                    <select
                      id="appartenenza"
                      name="appartenenza"
                      className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                      value={appartenenza}
                      onChange={(e) => setAppartenenza(e.target.value)}
                    >
                      <option value="autoscuola">Autoscuola</option>
                      <option value="insegnante">Insegnante</option>
                      <option value="istruttore">Istruttore</option>
                      <option value="insegnanteistruttore">Insegnante ed istruttore</option>
                    </select>
                  </div>
                  {appartenenza === 'autoscuola' &&
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Nome autoscuola
                      </label>
                      <div className="mt-1">
                        <input
                          id="autoscuola"
                          name="autoscuola"
                          type="text"
                          autoComplete="Autoscuola"
                          ref={autoscuolaInputRef}
                          required
                          onChange={() => setLoginError(false)}
                          className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                      </div>
                    </div>
                  }
                </>
              }
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Indirizzo Email
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    ref={emailInputRef}
                    onChange={(e) => validationEmail(e.target.value)}
                    required
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                </div>
              </div>
              {resetError && !isLogin &&
                <div className="space-y-1 ">
                  <p className='-mb-4 text-red-700 font-semibold'>
                    Email già presente in archivio
                  </p>
                </div>
              }
              {isLogin &&
                <div className="space-y-1">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <div className="mt-1">
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete={isLogin ? "current-password" : 'new-password'}
                      ref={passwordInputRef}
                      required
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                  </div>
                </div>
              }
              {
                loginError &&
                <div className={`rounded-md bg-red-50 p-4 ${hidden}`}>
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>

                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">
                        Errore di accesso. Controlla i dati inseriti
                      </h3>
                      <div className="mt-2 text-sm text-red-700">
                        <ul className="list-disc pl-5 space-y-1">
                          <li>
                            {loginError}
                          </li>

                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              }
              {emailSend &&
                <div className={`rounded-md bg-green-50 p-4 `}>
                  <div className="flex">
                    <div>
                      <h3 className="text-sm font-medium text-green-800">
                        Invio email avvenuto
                      </h3>
                      <div className="mt-2 font-medium text-sm text-green-700">
                        <ul>
                          <li>
                            {emailMessage}
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              }


              <div className="flex items-center justify-between">
                <div className="text-sm">
                  {isLogin &&
                    <a href="/recoveryPassword" className="font-medium text-indigo-600 hover:text-indigo-500">
                      Password dimenticata?
                    </a>
                  }
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLogin ? false : resetError}
                  className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${isLogin ? 'bg-indigo-600 hover:bg-indigo-700' : `${resetError ? 'bg-gray-300 hover:bg-gray-400' : 'bg-indigo-600 hover:bg-indigo-700'}`}   focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}>
                  {isLogin ? 'Accedi' : 'Richiedi nuovo Account'}
                </button>
                <button
                  type='button'
                  onClick={switchAuthModeHandler}
                  className="mt-6"
                >
                  {isLogin ? 'Non hai un account? Richiedine uno adesso' : 'Hai già un account? Accedi con le tue credenziali'}
                </button>
              </div>
            </form>
            {/* <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Seguici su</span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-3 gap-3">
                <div>
                  <a
                    href="#"
                    className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    <span className="sr-only">Facebook</span>
                    <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M20 10c0-5.523-4.477-10-10-10S0 4.477 0 10c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V10h2.54V7.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V10h2.773l-.443 2.89h-2.33v6.988C16.343 19.128 20 14.991 20 10z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </a>
                </div>

                <div>
                  <a
                    href="#"
                    className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    <span className="sr-only">Twitter</span>
                    <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
                    </svg>
                  </a>
                </div>

                <div>
                  <a
                    href="#"
                    className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    <span className="sr-only">GitHub</span>
                    <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </a>
                </div>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </>
  )
}

export default AuthForm;
