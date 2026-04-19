import { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogFooter,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Filter, X } from "lucide-react";
import ModalHeader from "./ModalHeader";

export interface FilterOption {
    value: string;
    label: string;
}

export interface FilterConfig {
    key: string;           // The data field key to filter on
    label: string;         // Display label for this filter group
    options: FilterOption[];
    multiple?: boolean;    // Allow multiple selections (default: false)
}

export interface ActiveFilters {
    [key: string]: string[];  // key -> selected values
}

interface FilterModalProps {
    isOpen: boolean;
    onClose: () => void;
    onApply: (filters: ActiveFilters) => void;
    filters: FilterConfig[];
    activeFilters?: ActiveFilters;
    title?: string;
}

const FilterModal = ({
    isOpen,
    onClose,
    onApply,
    filters,
    activeFilters = {},
    title = "Filter",
}: FilterModalProps) => {
    const [localFilters, setLocalFilters] = useState<ActiveFilters>({});

    // Sync local state when modal opens
    useEffect(() => {
        if (isOpen) {
            setLocalFilters({ ...activeFilters });
        }
    }, [isOpen, activeFilters]);

    const handleToggleOption = (filterKey: string, optionValue: string, multiple: boolean) => {
        setLocalFilters(prev => {
            const current = prev[filterKey] || [];

            if (multiple) {
                // Toggle in the array
                if (current.includes(optionValue)) {
                    return { ...prev, [filterKey]: current.filter(v => v !== optionValue) };
                }
                return { ...prev, [filterKey]: [...current, optionValue] };
            } else {
                // Single select — toggle off if already selected, otherwise replace
                if (current.includes(optionValue)) {
                    return { ...prev, [filterKey]: [] };
                }
                return { ...prev, [filterKey]: [optionValue] };
            }
        });
    };

    const handleApply = () => {
        // Clean out empty arrays
        const cleaned: ActiveFilters = {};
        Object.entries(localFilters).forEach(([key, values]) => {
            if (values.length > 0) {
                cleaned[key] = values;
            }
        });
        onApply(cleaned);
        onClose();
    };

    const handleReset = () => {
        setLocalFilters({});
        onApply({});
        onClose();
    };

    const hasActiveFilters = Object.values(localFilters).some(v => v.length > 0);

    return (
        <Dialog open={isOpen} onOpenChange={(open: boolean) => !open && onClose()}>
            <DialogContent className="max-w-sm xs:max-w-md rounded-2xl p-0 gap-0 overflow-hidden [&>button]:hidden bg-surface">
                <ModalHeader title={title} onClose={onClose} />

                {/* Filter Groups */}
                <div className="px-6 py-5 space-y-5 max-h-[60vh] overflow-y-auto">
                    {filters.map((filter) => (
                        <div key={filter.key}>
                            <h4 className="text-sm font-medium surface-text mb-3">
                                {filter.label}
                            </h4>
                            <div className="flex flex-wrap gap-2">
                                {filter.options.map((option) => {
                                    const isSelected = (localFilters[filter.key] || []).includes(option.value);
                                    return (
                                        <button
                                            key={option.value}
                                            type="button"
                                            onClick={() =>
                                                handleToggleOption(filter.key, option.value, filter.multiple ?? false)
                                            }
                                            className={`
                                                px-4 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer
                                                border
                                                ${isSelected
                                                    ? "bg-primary text-white border-primary dark:bg-white dark:text-[#1A1A1A] dark:border-white"
                                                    : "bg-transparent surface-text border-[--stroke] hover:border-primary dark:border-border-dark dark:hover:border-white"
                                                }
                                            `}
                                        >
                                            {option.label}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    ))}

                    {filters.length === 0 && (
                        <div className="text-center py-4 text-sm surface-text opacity-60">
                            No filters available
                        </div>
                    )}
                </div>

                {/* Footer */}
                <DialogFooter className="flex flex-row items-center justify-between gap-3 px-6 py-4 border-t border-surface">
                    <Button
                        variant="outline"
                        type="button"
                        onClick={handleReset}
                        disabled={!hasActiveFilters}
                        className="gap-1.5"
                    >
                        <X className="h-4 w-4" />
                        Reset
                    </Button>
                    <Button
                        type="button"
                        onClick={handleApply}
                        className="gradient-box text-white gap-1.5 border-0"
                    >
                        <Filter className="h-4 w-4" />
                        Apply Filters
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default FilterModal;