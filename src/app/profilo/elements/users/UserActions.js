'use client'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { CopyIcon } from "lucide-react";
import { useEffect, useState } from "react"

function formatDateTime(timestamp) {

    const date = new Date(timestamp);

    const pad = (num) => (num < 10 ? '0' + num : num);

    const day = pad(date.getDate());
    const month = pad(date.getMonth() + 1); // Months are zero indexed
    const year = date.getFullYear();
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    const seconds = pad(date.getSeconds());

    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
}

export function UserActions({ session, allusers }) {

    const [actions, setActions] = useState([])

    const url = allusers ? '/api/user-actions?allusers=true' : '/api/user-actions'

    const fetchActions = async () => {
        try {
            const response = await fetch(url, {
                headers: {
                    Authorization: `Bearer ${session?.user.accessToken}`,
                },
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setActions(data.data)
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
        }
    }

    useEffect(() => {
        fetchActions()
    }, [])

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
    };

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[100px]">ID Utente</TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead>Azione</TableHead>
                    <TableHead className="text-right">Data</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {actions?.map((action, index) => (
                    <TableRow key={index}>
                        <TableCell className="flex flex-row items-center justify-start gap-2"><CopyIcon className="cursor-pointer" size={14} onClick={() => copyToClipboard(action.userID)} /> {action.userID?.slice(0, 3)}...{action.userID?.slice(-3)}</TableCell>
                        <TableCell>{action.userName}</TableCell>
                        <TableCell>{action.action}</TableCell>
                        <TableCell className="text-right">{formatDateTime(action.date)}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}
