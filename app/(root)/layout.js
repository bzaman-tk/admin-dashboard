import StoreSwitcher from "@/components/StoreSwitcher";
import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export default async function SetupLayout({ children }) {

    const { userId } = auth()
    if (!userId) {
        redirect('/sing-in')
    }

    const store = await prismadb.store.findFirst({
        where: {
            userId
        }
    })
    // console.log(store)
    if (store) {
        redirect(`/${store.id}`)
    }

    return (
        <>
            {children}
        </>
    )

}