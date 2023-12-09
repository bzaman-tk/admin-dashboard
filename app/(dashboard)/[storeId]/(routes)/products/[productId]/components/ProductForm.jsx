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
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import AlertModal from '@/components/modals/AlertModal';
import ImageUpload from '@/components/ui/ImageUpload';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { DropdownMenuCheckboxes } from '@/components/ui/DropdownMenuCheckboxes';

const formSchema = z.object({
    name: z.string().min(1),
    Image: z.object({ url: z.string() }).array(),
    price: z.coerce.number().min(1),
    categoryId: z.string().min(1),
    productColors: z.array(z.object({ colorId: z.string().min(1), })).min(1),
    productSizes: z.array(z.object({ sizeId: z.string().min(1), })).min(1),
    // sizeId: z.string().min(1),
    description: z.string().min(1).optional(),
    isFeatured: z.boolean().default(false).optional(),
    isArchived: z.boolean().default(false).optional(),
})

const ProductForm = ({ initialData, categories, colors, sizes }) => {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [colorValue, setColorValue] = useState([])

    const params = useParams()
    const router = useRouter()

    const title = initialData ? 'Edit Product' : 'Create Product'
    const description = initialData ? 'Edit a Product' : 'Add a New Product'
    const toastMessage = initialData ? 'Product Updated' : 'Product Created'
    const action = initialData ? 'Save Changes' : 'Create'


    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: initialData ? {
            ...initialData,
            price: parseFloat(String(initialData?.price))
        } : {
            name: '',
            Image: [],
            price: 0,
            categoryId: '',
            productColors: '',
            productSizes: '',
            // sizeId: '',
            description: '',
            isFeatured: false,
            isArchived: false
        },
    })

    const onSubmit = async data => {
        try {
            setLoading(true)
            if (initialData) {
                await axios.patch(`/api/${params.storeId}/products/${params.productId}`, data) // 
            } else {
                await axios.post(`/api/${params.storeId}/products`, data) // 
            }
            router.refresh()
            router.push(`/${params.storeId}/products`, undefined, { shallow: true })
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
            await axios.delete(`/api/${params.storeId}/products/${params.productId}`)
            router.refresh()
            router.push(`/${params.storeId}/products`)
            toast.success("Product Deleted")

        } catch (error) {
            toast.error("Something Went Wrong!!!")
        } finally {
            setLoading(false)
            setOpen(false)
        }
    }
    // console.log(initialData)
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
                    <FormField
                        control={form.control}
                        name="Image"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Image</FormLabel>
                                <FormControl>
                                    <ImageUpload
                                        value={field.value.map(image => image.url)}
                                        disabled={loading}
                                        onChange={url => field.onChange([...field.value, { url }])}
                                        onRemove={url => field.onChange([...field.value.filter(current => current.url !== url)])}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="grid grid-cols-3 gap-8">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input disabled={loading} placeholder="Product Name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="price"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Price</FormLabel>
                                    <FormControl>
                                        <Input type='number' min='0' disabled={loading} placeholder="9.99" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="categoryId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Category</FormLabel>
                                    <Select disabled={loading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue defaultValue={field.value} placeholder="Select a Category" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {
                                                categories.map(category => (
                                                    <SelectItem key={category.id} value={category.id}>
                                                        {category.name}
                                                    </SelectItem>
                                                ))
                                            }
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="productSizes"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Size</FormLabel>
                                    <FormControl>
                                        <DropdownMenuCheckboxes
                                            defaultvalue={field.value}
                                            options={sizes}
                                            form={form}
                                            setColorValue={setColorValue}
                                            label="Size"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="productColors"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Color</FormLabel>
                                    <FormControl>
                                        <DropdownMenuCheckboxes
                                            defaultvalue={field.value}
                                            options={colors}
                                            form={form}
                                            setColorValue={setColorValue}
                                            label="Color"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="isFeatured"
                            render={({ field }) => (
                                <FormItem className='flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4'>
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                        <FormLabel>Featured</FormLabel>
                                        <FormDescription>
                                            This Product will appear on HOME page
                                        </FormDescription>
                                    </div>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="isArchived"
                            render={({ field }) => (
                                <FormItem className='flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4'>
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                        <FormLabel>Archived</FormLabel>
                                        <FormDescription>
                                            This Product will not appear anywhere on the site
                                        </FormDescription>
                                    </div>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Input disabled={loading} placeholder="Product Description" {...field} />
                                        {/* <RichTextEditor
                                            value={field.value}
                                            onChange={(value) => field.onChange(value)}
                                        /> */}
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

export default ProductForm;