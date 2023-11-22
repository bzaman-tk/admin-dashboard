'use client'
import Heading from "@/components/ui/Heading";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { columns } from "./columns";
import ApiList from "@/components/ui/ApiList";

const BillboardClient = ({ data }) => {
    const router = useRouter()
    const params = useParams()

    return (
        <>
            <div className="flex items-center justify-between pb-4">
                <Heading title={`Billboard [${data?.length}]`} description="Billboard Description" />
                <Button
                    variant="outline"
                    onClick={() => router.push(`/${params.storeId}/billboards/new`)}
                >
                    <Plus className="mr-2 h-4 w-4" />
                    Add New
                </Button>
            </div>

            <Separator />
            <DataTable searchKey="label" columns={columns} data={data} />
            <Heading title="API" description="API calls for Billboards" />
            <Separator />
            <ApiList entityName="billboards" entityIdName="billboardId" />
        </>
    );
};

export default BillboardClient;