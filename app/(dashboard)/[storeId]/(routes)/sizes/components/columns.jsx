"use client"

import CellAction from "./CellAction"

export const columns = [
    {
        accessorKey: "name",
        header: "Name",
    }, {
        accessorKey: "value",
        header: "Value",
    },
    {
        accessorKey: "createdAt",
        header: "Date",
    },
    {
        id: "actions",
        cell: ({ row }) => <CellAction data={row.original} />
    }
]
