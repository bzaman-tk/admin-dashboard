import Heading from "@/components/ui/Heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";

const BillboardClient = () => {
    return (
        <>
            <div className="flex items-center justify-between">
                <Heading title="Billboard Title" description="Billboard Description" />
                <Button
                    variant="outline"
                >
                    <Plus className="mr-2 h-4 w-4" />
                    Add New
                </Button>
            </div>

            <Separator />
        </>
    );
};

export default BillboardClient;