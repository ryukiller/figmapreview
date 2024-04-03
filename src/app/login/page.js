'use client'
import Image from "next/image"
import { useFormState, useFormStatus } from 'react-dom';
import { authenticate } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSession } from "next-auth/react"

const Login = () => {

    const { data: session } = useSession()
    if (session?.user) {
        window.location = '/'
    }

    const [errorMessage, dispatch] = useFormState(authenticate, undefined);

    return (
        <div className="loginContainer flex flex-row items-center justify-center">
            <div className="herocontainer bg-[#1a170f] bg-[url(/loginhero.png)] w-6/12 min-h-screen flex flex-col items-start justify-between bg-contain bg-no-repeat p-14">
                <Image src="/logo-white.svg" width={300} height={100} alt="SWI Agency" className="w-[100px] invert brightness-50" />
                <h2 className="text-white font-bold text-6xl">EVERYTHING BEGINS WITH A LOGIN</h2>
            </div>
            <div className="formContainer w-6/12 min-h-screen flex felx-col items-center justify-center">
                <form className="space-y-6" action={dispatch}>
                    <h3 className="text-2xl font-bold">Effettua il login</h3>
                    <p className="text-sm text-gray-600">Accedi al tuo account per poter utilizzari i nostri servizi</p>
                    <Input name="email" type="email" autoComplete="email" placeholder="email@swi.it" required />
                    <Input name="password" type="password" autoComplete="current-password" placeholder="********" required />
                    <LoginButton />
                    <div
                        className="flex h-8 items-end space-x-1"
                        aria-live="polite"
                        aria-atomic="true"
                    >
                        {errorMessage && (
                            <>
                                <p className="text-sm text-red-500">{errorMessage}</p>
                            </>
                        )}
                    </div>
                    <p className="text-xs text-gray-500">- il tuo account rimarrà connesso per 30 giorni</p>
                </form>
            </div>
        </div>
    )
}

function LoginButton() {
    const { pending } = useFormStatus();

    return (
        <Button aria-disabled={pending}>
            Entra
        </Button>
        // <button className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600" aria-disabled={pending}>
        //     Entra
        // </button>
    );
}

export default Login