'use client'
import Heading from "@/components/ui/Heading";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { columns } from "./columns";
import ApiList from "@/components/ui/ApiList";

const ColorsClient = ({ data }) => {
    const router = useRouter()
    const params = useParams()

    return (
        <>
            <div className="flex items-center justify-between pb-4">
                <Heading title={`Colors [${data?.length}]`} description="Manage Colors For your Store" />
                <Button
                    variant="outline"
                    onClick={() => router.push(`/${params.storeId}/colors/new`)}
                >
                    <Plus className="mr-2 h-4 w-4" />
                    Add New
                </Button>
            </div>

            <Separator />
            <DataTable searchKey="name" columns={columns} data={data} />
            <Heading title="API" description="API calls for Colors" />
            <Separator />
            <ApiList entityName="colors" entityIdName="colorId" />
        </>
    );
};

export default ColorsClient;