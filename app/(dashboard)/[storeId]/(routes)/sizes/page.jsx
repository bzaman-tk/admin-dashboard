import prismadb from "@/lib/prismadb";
import SizesClient from "./components/SizesClient";
import { format } from "date-fns";

const SizesPage = async ({ params }) => {
    const sizes = await prismadb.size.findMany({
        where: {
            storeId: params.storeId
        },
        orderBy: {
            createdAt: 'desc'
        }
    })

    const formattedSizes = sizes.map(item => ({
        id: item.id,
        name: item.name,
        value: item.value,
        createdAt: format(item.createdAt, "MMMM do, yyyy")
    }))

    return (
        <div className="flex-col">
            <div className="flex-1 space-x-4 p-8 pt-6">
                <SizesClient data={formattedSizes} />
            </div>
        </div>
    );
};

export default SizesPage;