"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { useEffect, useState } from "react";

interface AppliedFilter {
    value: string;
    label: string;
    checked?: boolean;
}

interface CheckBoxContainerProps {
    data: AppliedFilter[];
    onChange: (dataValues: string[]) => void;
}

export const CheckBoxContainer = ({ data, onChange }: CheckBoxContainerProps) => {
    const [filters, setFilters] = useState<AppliedFilter[]>(data);

    useEffect(() => {
        setFilters(data); // Ensure state updates when new data is received
    }, [data]);

    const handleCheckedChange = (checked: boolean, applied: AppliedFilter) => {
        const updatedFilters = filters.map((item) =>
            item.value === applied.value ? { ...item, checked } : item
        );

        setFilters(updatedFilters);

        // Call onChange with selected filter values
        onChange(updatedFilters.filter((item) => item.checked).map((item) => item.value));
    };

    return (
        <div className="flex flex-col w-full gap-2">
            {filters.map((item) => (
                <div key={item.value} className="flex items-center gap-2">
                    <Checkbox
                        checked={item.checked || false}
                        onCheckedChange={(checked) => handleCheckedChange(checked as boolean, item)}
                    />
                    <span className="text-sm">{item.label}</span>
                </div>
            ))}
        </div>
    );
};
