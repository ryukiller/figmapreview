
'use client'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import CreateUpdateUser from "./elements/users/CreateUpdateUser";

import { ToastAction } from "@/components/ui/toast"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button";
import { LogOutIcon, UserPlus2Icon } from "lucide-react";
import UsersList from "./elements/users/UsersList";
import { signOut } from "next-auth/react";
import { UserActions } from "./elements/users/UserActions";
import { useState, useEffect } from "react";


const Profile = () => {

    const { data: session } = useSession({
        required: true,
        onUnauthenticated() {
            redirect("/login");
        },
    });

    const dialogClose = () => {
        document.getElementById('closeDialog')?.click();
    };

    const { toast } = useToast()

    function manageupdate() {
        toast({
            title: "Utente Creato!",
            description: "Utente creato con successo!",
            action: <ToastAction altText="ok">OK</ToastAction>,
        })
        dialogClose()
    }

    const [nome, setNome] = useState()
    const [cognome, setCognome] = useState()

    useEffect(() => {
        setNome(session?.user.name)
        setCognome(session?.user.cognome)
    }, [session?.user])

    return (
        <>
            {session ? (
                <main className="p-5">
                    <div className="flex flex-col items-start justify-between">
                        <h1 className="font-bold text-2xl">Profilo</h1>
                        <p className="text-sm font-light">Informazioni sul tuo account</p>
                        <Separator className="my-4" />
                    </div>

                    <div className="contetnt flex flex-row items-start mt-4 justify-start min-h-screen">
                        <div className="sidebar w-2/12">
                            <div className="flex flex-row items-start justify-start gap-3">
                                <Avatar>
                                    <AvatarImage src={session?.user.avatar} alt={session?.user.name} />
                                    <AvatarFallback>{nome?.charAt(0) + cognome?.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <h1 className="tex-lg">{session?.user.name}</h1>
                                    <p className="text-sm font-bold">{session?.user.cognome}</p>
                                    <span onClick={() => signOut()} className="cursor-pointer flex flex-row items-center justify-start gap-3 text-sm mt-4 border px-4 py-2 rounded-lg w-max">Esci <LogOutIcon size={16} /></span>
                                </div>

                            </div>
                            <Separator className="my-4" />
                            <h3 className="my-4">Info Utente</h3>
                            <ul>
                                <li><span className="font-normal">Email:</span> {session?.user.email}</li>
                                <li><span className="font-normal">Telefono:</span> {session?.user.email}</li>
                                <li><span className="font-normal">Ruolo:</span> {session?.user.role}</li>
                            </ul>
                        </div>

                        <div className="flex flex-col items-start justify-start w-10/12 ml-5 pl-5 border-l-[1px]">
                            {session?.user.role === 'superuser' && (
                                <>
                                    <div className="maincontent w-full flex flex-col items-end justify-center">
                                        <UsersList session={session} />
                                    </div>
                                    <h3 className="my-4">Lista Azioni degli Utenti</h3>
                                    <UserActions session={session} allusers={true} />
                                    <Separator className="my-4" />
                                </>
                            )}
                            <div className="maincontent w-full">
                                <h3 className="my-4">Lista Azioni dell'Utente: {session?.user.name}</h3>
                                <UserActions session={session} />
                            </div>
                        </div>
                    </div>

                </main>
            ) : (
                <main className="p-5 bg-[url(/notfound.jpeg)] min-h-screen bg-center bg-no-repeat bg-cover">
                    <div className="flex flex-col items-start justify-between">
                        <h1 className="font-bold text-2xl">Permesso Negato</h1>
                        <p className="text-sm font-light">Effettuan il login per vedere questi contenuti.</p>
                        <Separator className="my-4" />
                    </div>
                </main>
            )}
        </>

    )
}

export default Profile