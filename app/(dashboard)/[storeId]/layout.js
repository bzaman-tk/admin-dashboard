import NavBar from "@/components/NavBar";
import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export default async function DashboardLayout({ children, params }) {

    const { uesrId } = auth()
    if (uesrId) {
        redirect('/sing-in')
    }

    const store = await prismadb.store.findFirst({
        where: {
            id: params.storeId,
            uesrId,
        }
    })

    if (!store) {
        redirect('/')
    }

    return (
        <>
            <NavBar />
            {children}
        </>
    )

}