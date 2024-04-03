"use client"
import * as React from "react"
import {
    ChevronDownIcon,
} from "@radix-ui/react-icons"
import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CopyIcon, Dice1Icon, DicesIcon, Edit, LockKeyholeIcon, MoreHorizontal, Trash2Icon, UserPlus2Icon } from "lucide-react"


import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import CreateUpdateUser from "./CreateUpdateUser"

export default function UsersList({ session }) {

    const [users, setUsers] = React.useState([{
        name: "",
        cognome: "",
        email: "",
        role: "",
        status: "",
        telefono: "",
        codAgente: "",
        avatar: ""
    }]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);

    const fetchUsers = async () => {
        try {
            const response = await fetch('/api/users', {
                headers: {
                    Authorization: `Bearer ${session?.user.accessToken}`, // Ensure you're using token.accessToken correctly
                },
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            console.log(data)
            setUsers(data.data)
            return data.data
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
        }
    };

    React.useEffect(() => {
        fetchUsers()
            .then(data => {
                console.log(data)
                setUsers(data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Failed to fetch services:', error);
                setError(error);
                setLoading(false);
            });
    }, []);


    const [sorting, setSorting] = React.useState([])
    const [columnFilters, setColumnFilters] = React.useState(
        []
    )
    const [columnVisibility, setColumnVisibility] = React.useState({})
    const [rowSelection, setRowSelection] = React.useState({})

    const [passwordLength, setPasswordLength] = React.useState(20);
    const [includeSpecialChars, setIncludeSpecialChars] = React.useState(true);
    const [generatedPassword, setGeneratedPassword] = React.useState('');
    const [isCopied, setIsCopied] = React.useState(false);
    const [isShowing, setIsShowing] = React.useState(false)
    const passwordRef = React.useRef(null);
    const [saved, setSaved] = React.useState('')

    const deleteService = async (id) => {
        try {
            //console.log(id)
            const response = await fetch(`/api/users/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${session?.user.accessToken}`,
                },
            });
            if (!response.ok) {
                console.log(response)
            }
            fetchUsers()
            return await response.json();
        } catch (error) {
            console.error('Error deleting service:', error);
        }
    };

    function manageupdate() {
        fetchUsers()
    }

    const columns = [
        {
            accessorKey: "status",
            header: "",
            cell: ({ row }) => (
                <div className={`${row.original.status ? 'bg-green-500' : 'bg-red-500'} w-4 h-4 rounded-full`}></div>
            ),
        },
        {
            accessorKey: "codAgente",
            header: "C.AG",
            cell: ({ row }) => (
                <>
                    <div className="font-normal text-xs max-w-[500px]">
                        {row.original.codAgente}
                    </div>
                </>
            ),
        },
        {
            accessorKey: "avatar",
            header: "",
            cell: ({ row }) => (
                <>
                    <Avatar>
                        <AvatarImage src={row.original.avatar} alt={session?.user.name} />
                        <AvatarFallback>{row.original.name.charAt(0).toUpperCase() + row.original.cognome.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                </>
            ),
        },
        {
            accessorKey: "name",
            header: "Nome",
            cell: ({ row }) => (
                <>
                    <div className="font-bold text-sm max-w-[500px]">
                        {row.original.name + ' ' + row.original.cognome}
                    </div>
                </>
            ),
        },
        {
            accessorKey: "email",
            header: "Email",
            cell: ({ row }) => (
                <>
                    <div className="font-normal text-xs max-w-[500px]">
                        {row.original.email}
                    </div>
                </>
            ),
        },
        {
            accessorKey: "telefono",
            header: "Telefono",
            cell: ({ row }) => (
                <>
                    <div className="font-normal text-xs max-w-[500px]">{row.original.telefono}</div>
                </>
            ),
        },
        {
            accessorKey: "role",
            header: () => <div className="text-left">Ruolo</div>,
            cell: ({ row }) => {


                return (
                    <span className="font-normal text-xs max-w-[500px]">{row.original.role}</span>
                )
            },
        },
        {
            id: "actions",
            enableHiding: false,
            cell: ({ row }) => {



                const generatePassword = () => {
                    let charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
                    if (includeSpecialChars) {
                        charset += '!@#$%^&*()_-+=';
                    }
                    let password = '';
                    const array = new Uint8Array(passwordLength);
                    window.crypto.getRandomValues(array);
                    for (let i = 0; i < passwordLength; i++) {
                        password += charset[array[i] % charset.length];
                    }
                    setGeneratedPassword(password);
                    setIsShowing(true)
                    setIsCopied(false)
                };

                const copyToClipboard = (e) => {
                    navigator.clipboard.writeText(generatedPassword);
                    setIsCopied(true)
                };

                const changePass = async (userID) => {
                    console.log(userID)

                    try {
                        const response = await fetch('/api/changepass', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${session?.user.accessToken}`,
                            },
                            body: JSON.stringify({ id: userID, password: generatedPassword }),
                        });
                        if (!response.ok) {
                            setSaved('errore nel cambiare pass')
                            //throw new Error('Network response was not ok');
                        }
                        setSaved('passsword cambiata')
                        return await response.json();
                    } catch (error) {
                        console.error('Error creating user:', error);
                    }

                }



                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Azioni</DropdownMenuLabel>
                            <DropdownMenuSeparator />

                            <CreateUpdateUser session={session} user={row.original} manageupdate={manageupdate}>
                                <button className="relative select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-slate-100 hover:bg-slate-100 focus:text-slate-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 dark:focus:bg-slate-800 dark:focus:text-slate-50 cursor-pointer flex gap-3 w-full" >
                                    <Edit size={18} /> Modifica
                                </button>
                            </CreateUpdateUser>
                            <div className="flex flex-col items-start justify-center">
                                <button
                                    className="relative select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-slate-100 hover:bg-slate-100 focus:text-slate-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 dark:focus:bg-slate-800 dark:focus:text-slate-50 cursor-pointer flex gap-3 w-full"
                                    onClick={() => setIsShowing(!isShowing)}>
                                    <LockKeyholeIcon size={18} />Cambia Password
                                </button>
                                {isShowing && (
                                    <div className="flex flex-col items-start justify-center gap-3 px-3 my-3">
                                        <div className="flex flex-row items-center justify-center gap-3">
                                            <Input name="pass" ref={passwordRef} defaultValue={generatedPassword} onChange={(e) => {
                                                setGeneratedPassword(e.target.value)
                                                setIsCopied(false)
                                            }} />
                                            <CopyIcon className={`cursor-pointer ${isCopied ? 'text-green-400' : ''}`} size={22} onClick={() => copyToClipboard()} />
                                            <DicesIcon className="cursor-pointer" size={22} onClick={() => generatePassword()} />
                                        </div>
                                        <Button onClick={() => changePass(row.original._id)}>Salva</Button>
                                        {saved && <p>{saved}</p>}
                                    </div>
                                )}
                            </div>
                            <DropdownMenuItem className="cursor-pointer flex gap-3" onClick={() => deleteService(row.original._id)}><Trash2Icon size={18} /> Elimina</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )
            },
        },
    ]

    const table = useReactTable({
        data: users,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        initialState: {
            pagination: {
                pageSize: 20,
            },
        },
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    })


    return (
        <>
            <div className="flex flex-row items-center justify-between w-full">
                <h3>Lista utenti</h3>
                <CreateUpdateUser session={session} manageupdate={manageupdate} >
                    <Button className="flex gap-3" >
                        Aggiungi Utente <UserPlus2Icon />
                    </Button>
                </CreateUpdateUser>
            </div>
            <div className="w-full mb-2">
                <div className="flex items-center justify-between py-4">
                    <Input
                        placeholder="Cerca utente..."
                        value={(table.getColumn("name")?.getFilterValue()) ?? ""}
                        onChange={(event) =>
                            table.getColumn("name")?.setFilterValue(event.target.value)
                        }
                        className="max-w-sm"
                    />
                    <div className="flex flex-row items-center justify-center gap-3">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="ml-auto">
                                    Colonne <ChevronDownIcon className="ml-2 h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                {table
                                    .getAllColumns()
                                    .filter((column) => column.getCanHide())
                                    .map((column) => {
                                        return (
                                            <DropdownMenuCheckboxItem
                                                key={column.id}
                                                className="capitalize"
                                                checked={column.getIsVisible()}
                                                onCheckedChange={(value) =>
                                                    column.toggleVisibility(!!value)
                                                }
                                            >
                                                {column.id}
                                            </DropdownMenuCheckboxItem>
                                        )
                                    })}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => {
                                        return (
                                            <TableHead key={header.id}>
                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(
                                                        header.column.columnDef.header,
                                                        header.getContext()
                                                    )}
                                            </TableHead>
                                        )
                                    })}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow
                                        key={row.id}
                                        data-state={row.getIsSelected() && "selected"}
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id}>
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext()
                                                )}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={columns.length}
                                        className="h-24 text-center"
                                    >
                                        Nessun risultato.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
                <div className="flex items-center justify-end space-x-2 py-4">
                    <div className="flex-1 text-sm text-muted-foreground">
                        {/* {table.getFilteredSelectedRowModel().rows.length} di{" "}
                        {table.getFilteredRowModel().rows.length} righe selezioate. */}
                    </div>
                    <div className="space-x-2">
                        {table.getCanPreviousPage() && <Button
                            variant="outline"
                            size="sm"
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                        >
                            Precedente
                        </Button>}
                        {table.getCanNextPage() && <Button
                            variant="outline"
                            size="sm"
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                        >
                            Prossima
                        </Button>}
                    </div>
                </div>
            </div>
        </>
    )
}
