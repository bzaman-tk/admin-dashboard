'use client'
import React, { useEffect, useState } from "react";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export function DropdownMenuCheckboxes({ label, options, defaultvalue, setColorValue, form }) {
    const [checked, setChecked] = useState(
        defaultvalue.length !== 0 ?
            options.filter(op => defaultvalue.some(dv => dv.colorId === op.id))
            : []
    );
    const handleCheck = (item) => {
        setChecked((prevChecked) => {
            const alreadyChecked = prevChecked.map(pre => pre.id).includes(item.id);
            if (alreadyChecked) {
                return prevChecked.filter(pre => pre.id !== item.id);
            } else {
                return [...prevChecked, item];
            }
        });
    };
    useEffect(() => {
        setColorValue(checked.map(item => item.id))
        if (checked.length !== 0) {
            form.setValue("productColors", checked.map(item => ({ colorId: item.id })))
        }
        // console.log(defaultvalue, checked, options)
    }, [checked, setColorValue, form])
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" className="text-left block w-full">
                    {checked.length !== 0 ?
                        checked.map((color, i) => {
                            if (i === 0) {
                                return color.name
                            } else {
                                return ',' + color.name
                            }
                        })
                        : 'Select Colors'}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
                {
                    options.map(option => (
                        <DropdownMenuCheckboxItem key={option.id}
                            checked={checked.map(pre => pre.id).includes(option.id)}
                            onCheckedChange={() => handleCheck(option)}
                        >
                            {option.name}
                        </DropdownMenuCheckboxItem>
                    ))
                }

            </DropdownMenuContent>
        </DropdownMenu>
    );
}
