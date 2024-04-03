'use client'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { CopyIcon, DicesIcon, Plus, Trash2Icon } from "lucide-react"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { TagInput } from "@/components/TagsInput"
import { Textarea } from "@/components/ui/textarea"
import { useState, useRef } from "react"
import Upload from "@/lib/Upload"
import Image from "next/image"


function slugify(text) {
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')           // Replace spaces with -
        .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
        .replace(/\-\-+/g, '-')         // Replace multiple - with single -
        .replace(/^-+/, '')             // Trim - from start of text
        .replace(/-+$/, '');            // Trim - from end of text
}



export default function CreateUpdateUser({ session, user, manageupdate, children }) {

    const initialFormData = {
        name: "",
        cognome: "",
        email: "",
        role: "",
        hashedPassword: "",
        status: "",
        telefono: "",
        codAgente: "",
        avatar: "",
        options: []
    };

    const [formData, setFormData] = useState(user || initialFormData);

    const handleSubmit = () => {
        //e.preventDefault();
        user ? updateUser(formData._id, formData) : createUser(formData);
        setOpen(!open)
    };

    const createUser = async (userData) => {
        try {
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session?.user.accessToken}`,
                },
                body: JSON.stringify(userData),
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            manageupdate()
            return await response.json();
        } catch (error) {
            console.error('Error creating user:', error);
        }
    };

    const updateUser = async (id, userData) => {
        //console.log(userData)
        try {
            const response = await fetch(`/api/users/${id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session?.user.accessToken}`,
                },
                body: JSON.stringify(userData),
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            manageupdate()
            return await response.json();
        } catch (error) {
            console.error('Error updating user:', error);
        }
    };

    const handleChange = (e, index, key, value) => {

        if (index !== undefined && key) {
            const newOptions = [...formData.options];

            if (key === 'title') {
                newOptions[index].optionName = slugify(e.target.value);
                newOptions[index][key] = e.target.value;
            } else if (key === 'values') {
                if (['select', 'checkbox'].includes(newOptions[index].type)) {
                    newOptions[index][key] = value.map(val => val.text);
                } else if (newOptions[index].type === 'assistenza') {
                    // Assuming the format is "title:budget,title:budget,..."
                    console.log(value)
                    newOptions[index][key] = value;
                } else if (newOptions[index].type === 'seoprovincie') {
                    // Assuming the format is "title:budget,title:budget,..."
                    console.log(value)
                    newOptions[index][key] = value;
                } else {
                    //console.log('here input text', value)
                    newOptions[index][key] = value;
                }
            } else {
                newOptions[index][key] = value;
            }
            setFormData({ ...formData, options: newOptions });
        } else {
            setFormData({ ...formData, [key]: value });
        }
    };

    const addOption = () => {
        const newOptions = [...formData.options, { type: "", title: "", optionName: "", values: [""] }];
        setFormData({ ...formData, options: newOptions });
    };

    const removeOption = (index) => {
        const newOptions = formData.options.filter((_, idx) => idx !== index);
        setFormData({ ...formData, options: newOptions });
    };

    const [editAvatar, setEditAvatar] = useState(true);
    const fileTypes = [".jpg", ".png", ".jpeg", ".webp"];

    const handleUploadComplete = (imagePath) => {
        // Handle the image path, e.g., save it to the database
        // const parsedPaths = JSON.parse(imagePath);
        // console.log('Image path:', parsedPaths.images[0]);
        setFormData((prevFormData) => ({
            ...prevFormData,
            avatar: imagePath
        }));
    };

    const [open, setOpen] = useState(false);

    const [generatedPassword, setGeneratedPassword] = useState('');
    const [isCopied, setIsCopied] = useState(false);
    const passwordRef = useRef(null);

    const generatePassword = () => {
        let charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        charset += '!@#$%^&*()_-+=';
        let password = '';
        const array = new Uint8Array(20);
        window.crypto.getRandomValues(array);
        for (let i = 0; i < 20; i++) {
            password += charset[array[i] % charset.length];
        }
        setGeneratedPassword(password);
        setFormData((prevFormData) => ({
            ...prevFormData,
            password: password
        }));
        setIsCopied(false)
    };

    const copyToClipboard = (e) => {
        navigator.clipboard.writeText(generatedPassword);
        setIsCopied(true)
    };


    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[625px]">
                <DialogHeader>
                    <DialogTitle>{user ? 'Modifica Utente' : 'Crea Nuovo Utente'}</DialogTitle>
                    <DialogDescription>
                        {user ? 'Modifica le informazioni riguardanti l\'utente selezionato' : 'Crea un nuovo utente'}
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 p-4 relative max-h-[700px] overflow-y-scroll">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="status" className="text-right">Stato</Label>
                        <Switch
                            id="status"
                            name="status"
                            checked={formData?.status}
                            onCheckedChange={(value) => handleChange(value, undefined, 'status', value)}
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                            Nome
                        </Label>
                        <Input
                            id="name"
                            name="name"
                            defaultValue={formData?.name ? user?.name : ""}
                            className="col-span-3"
                            onChange={(e) => handleChange(e, undefined, 'name', e.target.value)}
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="cognome" className="text-right">
                            Cognome
                        </Label>
                        <Input
                            id="cognome"
                            name="cognome"
                            defaultValue={formData?.cognome ? user?.cognome : ""}
                            className="col-span-3"
                            onChange={(e) => handleChange(e, undefined, 'cognome', e.target.value)}
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="email" className="text-right">
                            Email
                        </Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            defaultValue={formData?.email ? user?.email : ""}
                            className="col-span-3"
                            onChange={(e) => handleChange(e, undefined, 'email', e.target.value)}
                        />
                    </div>
                    {!user && <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="password" className="text-right">
                            Password
                        </Label>
                        <div className="col-span-3 flex flex-row items-center justify-center gap-3 w-full">
                            <Input
                                ref={passwordRef}
                                id="password"
                                name="password"
                                type="text"
                                defaultValue={generatedPassword}
                                className="col-span-3"
                                onChange={(e) => {
                                    handleChange(e, undefined, 'password', e.target.value)
                                    setGeneratedPassword(e.target.value)
                                    setIsCopied(false)
                                }}
                            />
                            <CopyIcon className={`cursor-pointer ${isCopied ? 'text-green-400' : ''}`} size={22} onClick={() => copyToClipboard()} />
                            <DicesIcon className="cursor-pointer" size={22} onClick={() => generatePassword()} />
                        </div>
                    </div>}

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="telefono" className="text-right">
                            Telefono
                        </Label>
                        <Input
                            id="telefono"
                            name="telefono"
                            type="tel"
                            defaultValue={formData?.telefono ? user?.telefono : ""}
                            className="col-span-3"
                            onChange={(e) => handleChange(e, undefined, 'telefono', e.target.value)}
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="codAgente" className="text-right">
                            Codice Agente
                        </Label>
                        <Input
                            id="codAgente"
                            name="codAgente"
                            defaultValue={formData?.codAgente ? user?.codAgente : ""}
                            className="col-span-3"
                            onChange={(e) => handleChange(e, undefined, 'codAgente', e.target.value)}
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="codAgente" className="text-right">
                            Percentuale Massima di sconto
                        </Label>
                        <Input
                            id="percentualeSconto"
                            name="percentualeSconto"
                            defaultValue={formData?.percentualeSconto ? user?.percentualeSconto : ""}
                            className="col-span-3"
                            onChange={(e) => handleChange(e, undefined, 'percentualeSconto', e.target.value)}
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="role" className="text-right">
                            Ruolo
                        </Label>
                        <Select id="role" onValueChange={(value) => handleChange(value, undefined, 'role', value)} defaultValue={user?.role ? user?.role : 'agente'}>
                            <SelectTrigger className="w-[250px]">
                                <SelectValue placeholder="Seleziona Ruolo" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Ruolo</SelectLabel>
                                    <SelectItem value="agente">Agente</SelectItem>
                                    <SelectItem value="superuser">Admin</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="note" className="text-right">
                            Note
                        </Label>
                        <Textarea
                            id="note"
                            name="note"
                            defaultValue={formData?.note ? user?.note : ""}
                            className="col-span-3"
                            onChange={(e) => handleChange(e, undefined, 'note', e.target.value)}
                        />
                    </div>
                    <div className="flex flex-col items-start justify-center gap-4 border-t border-gray-200 pt-4 mt-4">
                        <h3>Avatar</h3>
                        <p className="text-xs">Caricare un'immagine 250x250</p>
                        <div className="flex flex-row items-center justify-center gap-4">
                            <div className="" onClick={() => setEditAvatar(!editAvatar)}>
                                <Image
                                    className="cursor-pointer rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 hover:ring-secondary"
                                    src={formData.avatar ? formData.avatar : '/logo.png'}
                                    alt="profile image"
                                    width={60}
                                    height={60}
                                />
                            </div>
                            {editAvatar ? (
                                <><input
                                    type="hidden"
                                    name="options.avatar"
                                    value={formData.avatar}
                                /></>
                            ) : (
                                <Upload
                                    acceptedFileTypes={fileTypes}
                                    onUploadComplete={handleUploadComplete}
                                />
                            )}
                        </div>
                    </div>
                    <div className="flex flex-col items-center gap-4 border-t border-gray-200 pt-4 mt-4">
                        <div className="flex flex-row justify-between items-center w-full">
                            <div>
                                <h3>Opzioni</h3>
                                <p className="text-xs">es: Telefono secondario ecc</p>
                            </div>
                            <Button onClick={addOption} className="bg-green-500 mt-4">Opzioni <Plus /></Button>
                        </div>
                        <div className="my-5 w-full">
                            {formData.options && formData.options?.map((option, index) => (
                                <div key={index} className="relative flex flex-col w-full gap-3 p-8 border-2 border-gray-300 rounded-lg my-8">
                                    <Label htmlFor={"optiontitle" + index} className="mt-4 border-l-4 border-black pl-2 w-auto">Titolo opzione</Label>
                                    <Input
                                        id={"optiontitle" + index}
                                        type="text"
                                        value={option.title}
                                        onChange={(e) => handleChange(e, index, 'title', e.target.value)}
                                        placeholder="Titolo opzione"
                                    />
                                    <Input
                                        type="text"
                                        value={option.optionName}
                                        disabled
                                        placeholder="Option Name (Slug)"
                                        className="hidden"
                                    />
                                    <Label htmlFor={"optionvalue" + index} className="mt-4 border-l-4 border-black pl-2 w-auto">Valori dell'opzione</Label>
                                    <Input
                                        type="text"
                                        id={"optionvalue" + index}
                                        value={option.value}
                                        onChange={(e) => handleChange(e, index, 'optionvalue', e.target.value)}
                                        placeholder="Valore Opzione"
                                        className="text"
                                    />
                                    <Button onClick={() => removeOption(index)} className="absolute right-2 top-2 rounded-full p-2 w-10 h-10"><Trash2Icon /></Button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <DialogFooter onClick={() => handleSubmit()} className="border-t border-gray-200 pt-4">
                    <Button type="submit">{user ? 'Salva Utente' : 'Crea Utente'}</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog >
    )
}
