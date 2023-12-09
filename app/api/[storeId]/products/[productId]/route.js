import prismadb from "@/lib/prismadb"
import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"


export async function GET(req, { params }) {
    try {

        if (!params.productId) {
            return new NextResponse("Product ID is Required", { status: 400 })
        }

        const product = await prismadb.product.findUnique({
            where: {
                id: params.productId,
            },
            include: {
                Image: true,
                category: true,
                size: true,
                color: true,
            }
        })

        return NextResponse.json(product)
    } catch (error) {
        console.log("[PRODUCT_GET]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}

export async function PATCH(req, { params }) {
    try {
        const { userId } = auth()
        const body = await req.json()
        const {
            name,
            price,
            categoryId,
            // sizeId,
            productSizes,
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
        if (!productSizes) {
            return new NextResponse("Size is Required", { status: 400 })
        }

        if (!params.productId) {
            return new NextResponse("Product ID is Required", { status: 400 })
        }
        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: params.storeId,
                userId
            }
        })
        if (!storeByUserId) {
            console.log('80');
            return new NextResponse("Unauthorized", { status: 401 })
        }

        await prismadb.product.update({
            where: {
                id: params.productId,
            },
            data: {
                name,
                price,
                categoryId,
                // sizeId,
                productSizes: {
                    deleteMany: {}
                },
                productColors: {
                    deleteMany: {}
                },
                description,
                isFeatured,
                isArchived,
                Image: {
                    deleteMany: {}
                }
            }
        })

        const product = await prismadb.product.update({
            where: {
                id: params.productId
            },
            data: {
                Image: {
                    createMany: {
                        // data: [...Image.map((image: { url: string }) => image)]
                        data: Image.map((image) => ({ url: image.url }))
                    }
                },
                productSizes: {
                    create: productSizes.map(size => ({
                        size: {
                            connect: { id: size.sizeId }
                        }
                    }))
                },
                productColors: {
                    create: productColors.map(color => ({
                        color: {
                            connect: { id: color.colorId }
                        }
                    }))
                }
            }
        })

        return NextResponse.json(product)

    } catch (error) {
        console.log("[PRODUCT_PATCH]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}

export async function DELETE(req, { params }) {
    try {
        const { userId } = auth()

        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 })
        }
        if (!params.productId) {
            return new NextResponse("Product ID is Required", { status: 400 })
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
        await prismadb.productColor.deleteMany({
            where: {
                productId: params.productId,
            }
        });
        const product = await prismadb.product.deleteMany({
            where: {
                id: params.productId,
            }
        })
        return NextResponse.json(product)

    } catch (error) {
        console.log("[PRODUCT_DELETE]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}