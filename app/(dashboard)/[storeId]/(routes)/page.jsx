import prismadb from "@/lib/prismadb";

const DashboardPage = async ({ params }) => {

    const store = await prismadb.store.findFirst({
        where: {
            id: params.storeId
        }
    })

    return (
        <div>
            Dashboard <br />
            Store ID: {params?.storeId} <br />
            Store Name: {store?.name}
        </div>
    );
};

export default DashboardPage;