import prismadb from "@/lib/prismadb"
import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"

export async function POST(req, { params }) {
    try {
        const { userId } = auth()
        const body = await req.json()
        const {
            name,
            price,
            categoryId,
            sizeId,
            colorId,
            images,
            isFeatured,
            isArchived
        } = body

        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 })
        }
        if (!name) {
            return new NextResponse("Name is Required", { status: 400 })
        }
        if (!images || !images.length) {
            return new NextResponse("Images are Required", { status: 400 })
        }
        if (!price) {
            return new NextResponse("Price is Required", { status: 400 })
        }
        if (!categoryId) {
            return new NextResponse("Category Id is Required", { status: 400 })
        }
        if (!colorId) {
            return new NextResponse("Color ID is Required", { status: 400 })
        }
        if (!sizeId) {
            return new NextResponse("Size ID is Required", { status: 400 })
        }

        if (!params.storeId) {
            return new NextResponse("Store ID is Required", { status: 400 })
        }
        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: params.storeId,
                userId
            }
        })
        if (!storeByUserId) {
            return new NextResponse("Unauthorized", { status: 401 })
        }


        const product = await prismadb.product.create({
            data: {
                name,
                price,
                categoryId,
                sizeId,
                colorId,
                isFeatured,
                isArchived,
                storeId: params.storeId,
                images: {
                    createMany: {
                        // data: [...images.map((image: { url: string }) => image)]
                        data: images.map((image) => ({ url: image.url }))
                    }
                }
            }
        })

        return NextResponse.json(product)

    } catch (error) {
        console.log('[PRODUCT_POST]', error)
        return new NextResponse("Internals Error", { status: 500 })
    }
}


export async function GET(req, { params }) {
    try {
        const { searchParams } = new URL(req.url)
        const categoryId = searchParams.get("categoryId") || undefined;
        const colorId = searchParams.get("colorId") || undefined;
        const sizeId = searchParams.get("sizeId") || undefined;
        const isFeatured = searchParams.get("isFeatured")

        if (!params.storeId) {
            return new NextResponse("Store ID is Required", { status: 400 })
        }

        const products = await prismadb.product.findMany({
            where: {
                storeId: params.storeId,
                categoryId,
                colorId,
                sizeId,
                isFeatured: isFeatured ? true : undefined,
                isArchived: false
            },
            include: {
                images: true,
                category: true,
                color: true,
                size: true,
            },
            orderBy: {
                createdAt: 'desc'
            }
        })

        return NextResponse.json(products)

    } catch (error) {
        console.log('[PRODUCTS_GET]', error)
        return new NextResponse("Internals Error", { status: 500 })
    }
}