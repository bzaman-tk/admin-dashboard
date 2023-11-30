'use client'
import Heading from "@/components/ui/Heading";
import { DataTable } from "@/components/ui/data-table";
import { Separator } from "@/components/ui/separator";
import { columns } from "./columns";

const OrderClient = ({ data }) => {

    return (
        <>
            <Heading title={`Orders [${data?.length}]`} description="Orders Description" />
            <Separator />
            <DataTable searchKey="products" columns={columns} data={data} />
        </>
    );
};

export default OrderClient;