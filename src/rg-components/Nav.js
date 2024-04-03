'use client'

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calculator, Cross, CrossIcon, HomeIcon, ListTodo, MenuIcon, Scroll, ScrollText, X } from "lucide-react"
import { Kanit, Unbounded } from 'next/font/google'
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useSession } from "next-auth/react"

const unbounded = Unbounded({
    variable: '--font-unbounded',
    subsets: ['latin'],
    weight: ["200", "300", "400", "500", "600", "700", "800"]
})

const kanit = Kanit({
    variable: '--font-kanit',
    subsets: ['latin'],
    weight: ["200", "300", "400", "500", "600", "700", "800"],
    display: 'swap'
})

export function RgNav() {
    const [open, setOpen] = useState(false)
    const { data: session } = useSession();

    const [nome, setNome] = useState()
    const [cognome, setCognome] = useState()
    const [role, setRole] = useState()
    const [avatar, setAvatar] = useState()

    useEffect(() => {
        setNome(session?.user.name ?? '')
        setCognome(session?.user.cognome ?? '')
        setRole(session?.user.role ?? '')
        setAvatar(session?.user.avatar ?? '')
    }, [session?.user])

    return (
        <Sheet open={open} className={unbounded.variable}>
            <SheetTrigger asChild>
                <Button onClick={() => setOpen(!open)} className="fixed z-50 bottom-4 left-4 rounded-full w-12 h-12 shadow-md bg-slate-900 text-white" variant="outline">
                    <MenuIcon />
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className={`justify-between flex flex-col ${kanit.className}`}>
                <div>
                    <SheetHeader>
                        <SheetTitle>Menu</SheetTitle>
                    </SheetHeader>
                    <div className="grid gap-4 py-4">
                        <ul>
                            <li>
                                <Link onClick={() => setOpen(!open)} href="/" className="flex gap-2 p-2 hover:bg-gray-100 rounded-sm">
                                    <HomeIcon /> Home
                                </Link>
                            </li>
                            <li>
                                <Link onClick={() => setOpen(!open)} href="/contratti/new" className="flex gap-2 p-2 hover:bg-gray-100 rounded-sm">
                                    <Scroll /> Nuovo contratto
                                </Link>
                            </li>
                            <li>
                                <Link onClick={() => setOpen(!open)} href="/contratti" className="flex gap-2 p-2 hover:bg-gray-100 rounded-sm">
                                    <ScrollText /> Contratti
                                </Link>
                            </li>
                            {role === 'superuser' && <li>
                                <Link onClick={() => setOpen(!open)} href="/servizi" className="flex gap-2 p-2 hover:bg-gray-100 rounded-sm">
                                    <ListTodo /> Servizi
                                </Link>
                            </li>}
                            <li>
                                <Link onClick={() => setOpen(!open)} href="/preventivo" className="flex gap-2 p-2 hover:bg-gray-100 rounded-sm">
                                    <Calculator /> Preventivo
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div onClick={() => setOpen(!open)}
                        className="absolute cursor-pointer right-4 top-4 rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-slate-100 dark:ring-offset-slate-950 dark:focus:ring-slate-300 dark:data-[state=open]:bg-slate-800">
                        <X className="h-4 w-4" />
                        <span className="sr-only">Close</span>
                    </div>
                </div>
                <SheetFooter className="justify-start sm:justify-start">
                    {session && <Link onClick={() => setOpen(!open)} href="/profilo" title={nome} className="flex flex-row items-start justify-start gap-3">
                        <Avatar>
                            <AvatarImage src={avatar} alt={nome} />
                            <AvatarFallback>{nome?.charAt(0).toUpperCase() + cognome?.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                            <h3 className="text-sm">{nome}</h3>
                            <p className="text-xs">{cognome}</p>
                        </div>
                    </Link>}
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}
