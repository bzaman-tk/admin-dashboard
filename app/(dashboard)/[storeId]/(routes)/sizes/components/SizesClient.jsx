'use client'
import Heading from "@/components/ui/Heading";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { columns } from "./columns";
import ApiList from "@/components/ui/ApiList";

const SizesClient = ({ data }) => {
    const router = useRouter()
    const params = useParams()

    return (
        <>
            <div className="flex items-center justify-between pb-4">
                <Heading title={`Sizes [${data?.length}]`} description="Manage Sizes For your Store" />
                <Button
                    variant="outline"
                    onClick={() => router.push(`/${params.storeId}/sizes/new`)}
                >
                    <Plus className="mr-2 h-4 w-4" />
                    Add New
                </Button>
            </div>

            <Separator />
            <DataTable searchKey="name" columns={columns} data={data} />
            <Heading title="API" description="API calls for Sizes" />
            <Separator />
            <ApiList entityName="sizes" entityIdName="sizeId" />
        </>
    );
};

export default SizesClient;