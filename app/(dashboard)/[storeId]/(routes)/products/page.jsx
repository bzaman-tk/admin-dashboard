import prismadb from "@/lib/prismadb";
import BillboardClient from "./components/BillboardClient";
import { format } from "date-fns";

const ProductsPage = async ({ params }) => {
    const billboards = await prismadb.billboard.findMany({
        where: {
            storeId: params.storeId
        },
        orderBy: {
            createdAt: 'desc'
        }
    })

    const formattedBillboards = billboards.map(item => ({
        id: item.id,
        label: item.label,
        createdAt: format(item.createdAt, "MMMM do, yyyy")
    }))

    return (
        <div className="flex-col">
            <div className="flex-1 space-x-4 p-8 pt-6">
                <BillboardClient data={formattedBillboards} />
            </div>
        </div>
    );
};

export default ProductsPage;