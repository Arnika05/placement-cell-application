"use client";

import * as React from "react";
import { ChevronsUpDown, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ListItem } from "./list-item";

interface ComboboxProps {
  options: { label: string; value: string }[];
  value?: string[]; // Supports multiple selections
  onChange: (value: string[]) => void;
  heading: string;
  multiple?: boolean;
}

export const Combobox = ({
  options,
  value = [],
  onChange,
  heading,
  multiple = false,
}: ComboboxProps) => {
  const [open, setOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");

  // Filter options based on search input
  const filteredOptions = React.useMemo(() => {
    return searchTerm
      ? options.filter((item) =>
          item.label.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : options;
  }, [searchTerm, options]);

  // Handles user selection
  const handleSelection = (selectedValue: string) => {
    if (multiple) {
      const newValues = value.includes(selectedValue)
        ? value.filter((v) => v !== selectedValue) // Remove if selected again
        : [...value, selectedValue]; // Add to selection
      onChange(newValues);
    } else {
      onChange([selectedValue]); // Single selection
      setOpen(false); // Close dropdown on selection
    }
  };

  // Limit the number of displayed values
  const selectedText =
    value.length > 2
      ? `${value.slice(0, 2).map((v) => options.find((o) => o.value === v)?.label).join(", ")} +${value.length - 2} more`
      : value.map((v) => options.find((o) => o.value === v)?.label).join(", ") || "Select option...";

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between overflow-hidden"
        >
          <span className="truncate max-w-[80%]">{selectedText}</span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-full p-0 md:min-w-96 max-h-60 overflow-auto">
        <Command>
          {/* Search Input */}
          <div className="w-full px-2 py-1 flex items-center border rounded-md border-gray-100">
            <Search className="mr-2 h-4 w-4 min-w-4" />
            <input
              type="text"
              placeholder="Search category"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 w-full outline-none text-sm py-1"
            />
          </div>

          <CommandList>
            <CommandGroup heading={heading}>
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option) => (
                  <ListItem
                    key={option.value}
                    category={option}
                    onSelect={() => handleSelection(option.value)}
                    isChecked={value.includes(option.value)}
                  />
                ))
              ) : (
                <CommandEmpty>No Category Found</CommandEmpty>
              )}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
