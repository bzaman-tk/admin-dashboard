"use client"

import CellAction from "./CellAction"

export const columns = [
    {
        accessorKey: "name",
        header: "Name",
    },
    {
        accessorKey: "isArchived",
        header: "Archived",
    },
    {
        accessorKey: "isFeatured",
        header: "Featured",
    },
    {
        accessorKey: "price",
        header: "Price",
    },
    {
        accessorKey: "category",
        header: "Category",
    },
    {
        accessorKey: "size",
        header: "Size",
        cell: ({ row }) => (
            <div className="flex items-center gap-x-2">
                <div>
                    {row.original.size.map((size, i) => (
                        <span key={size.value}>
                            {
                                i === 0 ? size.name : (', ' + size.name)
                            }
                        </span>
                    ))}
                </div>
            </div>
        ),
    },
    {
        accessorKey: "color",
        header: "Color",
        cell: ({ row }) => (
            <div className="flex items-center gap-x-2">
                {/* <div>
                    {row.original.color.map((color, i) => (
                        <span key={color.value}>
                            {
                                i === 0 ? color.name : (', ' + color.name)
                            }
                        </span>
                    ))}
                </div> */}
                {row.original.color.map((color) => (
                    <div key={color.value} className="h-6 w-6 rounded-full border" style={{ backgroundColor: color.value }} />
                ))}
            </div>
        ),
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
