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
            productColors,
            Image,
            description,
            isFeatured,
            isArchived
        } = body

        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 })
        }
        if (!name) {
            return new NextResponse("Name is Required", { status: 400 })
        }
        if (!Image || !Image.length) {
            return new NextResponse("Image are Required", { status: 400 })
        }
        if (!price) {
            return new NextResponse("Price is Required", { status: 400 })
        }
        if (!categoryId) {
            return new NextResponse("Category Id is Required", { status: 400 })
        }
        if (!productColors) {
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

        const productColorsData = productColors.map(color => ({
            color: {
                connect: { id: color.colorId }
            }
        }));

        const product = await prismadb.product.create({
            data: {
                name,
                price,
                categoryId,
                sizeId,
                productColors: {
                    create: productColorsData
                },
                description,
                isFeatured,
                isArchived,
                storeId: params.storeId,
                Image: {
                    createMany: {
                        // data: [...Image.map((image: { url: string }) => image)]
                        data: Image.map((image) => ({ url: image.url }))
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
        const productColors = searchParams.get("productColors") || undefined;
        const sizeId = searchParams.get("sizeId") || undefined;
        const isFeatured = searchParams.get("isFeatured")

        if (!params.storeId) {
            return new NextResponse("Store ID is Required", { status: 400 })
        }

        const products = await prismadb.product.findMany({
            where: {
                storeId: params.storeId,
                categoryId,
                sizeId,
                isFeatured: isFeatured ? true : undefined,
                isArchived: false
            },
            include: {
                Image: true,
                category: true,
                // color: true,
                size: true,
                productColors: {
                    include: {
                        color: true,
                    },
                },
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