'use client'
import * as z from 'zod'
import Heading from "@/components/ui/Heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Trash } from "lucide-react";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import AlertModal from '@/components/modals/AlertModal';

const formSchema = z.object({
    name: z.string().min(1)
})

const SettingsForm = ({ initialData }) => {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    const params = useParams()
    const router = useRouter()

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: initialData,
    })

    const onSubmit = async data => {

        try {
            setLoading(true)
            await axios.patch(`/api/stores/${params.storeId}`, data)
            router.refresh()
            toast.success("Store Updated")

        } catch (error) {
            toast.error("Something Went Wrong")
        } finally {
            setLoading(false)
        }

    }

    const onDelete = async () => {
        try {
            setLoading(true)
            await axios.delete(`/api/stores/${params.storeId}`)
            router.refresh()
            router.push('/')
            toast.success("Store Deleted")

        } catch (error) {
            toast.error("Make Sure you Remove all Products and Categories First.")
        } finally {
            setLoading(false)
            setOpen(false)
        }
    }

    return (
        <>
            <AlertModal
                isOpne={open}
                onClose={() => setOpen(false)}
                onConfirm={onDelete}
                loading={loading}
            />
            <div className="flex items-center justify-between">
                <Heading title="Store Settings" description="Manage Store Preferences" />
                <Button
                    disabled={loading}
                    variant="destructive"
                    size="icon"
                    onClick={() => setOpen(true)}
                >
                    <Trash className="h-4 w-4" />
                </Button>
            </div>
            <Separator />
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8 w-full'>
                    <div className="grid grid-cols-3 gap-8">
                        <FormField
                            contron={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input disabled={loading} placeholder="Store Name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <Button disabled={loading} className="me-0 block" type="submit">
                        Save Changes
                    </Button>
                </form>
            </Form>
        </>
    );
};

export default SettingsForm;