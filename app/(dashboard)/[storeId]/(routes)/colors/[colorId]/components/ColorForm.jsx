'use client'

import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Trash } from "lucide-react";
import { useForm } from 'react-hook-form';
import * as z from 'zod'
import { useParams, useRouter } from 'next/navigation';

import Heading from "@/components/ui/Heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { zodResolver } from '@hookform/resolvers/zod';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import AlertModal from '@/components/modals/AlertModal';

const formSchema = z.object({
    name: z.string().min(1),
    value: z.string().min(4).regex(/^#/, {
        message: "String Must be a valid HEX code"
    })
})

const ColorForm = ({ initialData }) => {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    const params = useParams()
    const router = useRouter()

    const title = initialData ? 'Edit Color' : 'Create Color'
    const description = initialData ? 'Edit a Color' : 'Add a New Color'
    const toastMessage = initialData ? 'Color Updated' : 'Color Created'
    const action = initialData ? 'Save Changes' : 'Create Color'


    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            name: '',
            value: ''
        },
    })

    const onSubmit = async data => {
        try {
            setLoading(true)
            if (initialData) {
                await axios.patch(`/api/${params.storeId}/colors/${params.colorId}`, data)
            } else {
                await axios.post(`/api/${params.storeId}/colors`, data)
            }
            router.refresh()
            router.push(`/${params.storeId}/colors`)
            toast.success(toastMessage)
        } catch (error) {
            toast.error("Something Went Wrong")
        } finally {
            setLoading(false)
        }
    }

    const onDelete = async () => {
        try {
            setLoading(true)
            await axios.delete(`/api/${params.storeId}/colors/${params.sizeId}`)
            router.refresh()
            router.push(`/${params.storeId}/colors`, undefined, { shallow: true })
            toast.success("Color Deleted")

        } catch (error) {
            toast.error("Make Sure you Remove all Product using this Color First.")
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
                <Heading title={title} description={description} />
                {initialData &&
                    <Button
                        disabled={loading}
                        variant="destructive"
                        size="icon"
                        onClick={() => setOpen(true)}
                    >
                        <Trash className="h-4 w-4" />
                    </Button>
                }
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
                                        <Input disabled={loading} placeholder="Color Name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            contron={form.control}
                            name="value"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Color Value</FormLabel>
                                    <FormControl>
                                        <div className="flex items-center gap-x-4">
                                            <Input type='color' disabled={loading} placeholder="Color Value" {...field} />
                                            <div className="border p-4 rounded-full"
                                                style={{ backgroundColor: field.value }}
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <Button disabled={loading} className="me-0 block" type="submit">
                        {action}
                    </Button>
                </form>
            </Form>

        </>
    );
};

export default ColorForm;