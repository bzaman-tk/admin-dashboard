import prismadb from "@/lib/prismadb";
import { format } from "date-fns";
import { formatter } from "@/lib/utils";
import ProductClient from "./components/ProductClient";

const ProductsPage = async ({ params }) => {
    const products = await prismadb.product.findMany({
        where: {
            storeId: params.storeId
        },
        include: {
            category: true,
            // size: true,
            productColors: {
                include: {
                    color: true,
                },
            },
            productSizes: {
                include: {
                    size: true,
                },
            },
        },
        orderBy: {
            createdAt: 'desc'
        }
    })

    // console.log('products page', products)

    const formattedProducts = products.map(item => {
        const colors = item.productColors.map((productColor) => ({
            name: productColor.color.name,
            value: productColor.color.value,
        }));
        const sizes = item.productSizes.map((productSize) => ({
            name: productSize.size.name,
            value: productSize.size.value,
        }));

        return {
            id: item.id,
            name: item.name,
            isFeatured: item.isFeatured,
            isArchived: item.isArchived,
            price: formatter.format(item.price.toNumber()),
            category: item.category.name,
            size: sizes,
            color: colors,
            createdAt: format(item.createdAt, "MMMM do, yyyy")
        }
    })

    // console.log('products formatted', formattedProducts.color)


    return (
        <div className="flex-col">
            <div className="flex-1 space-x-4 p-8 pt-6">
                <ProductClient data={formattedProducts} />
            </div>
        </div>
    );
};

export default ProductsPage;