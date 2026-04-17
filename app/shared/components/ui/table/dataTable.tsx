import { useState } from "react";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import AddIcon from "@/shared/components/icons/addIcon";
import FilterIcon from "@/shared/components/icons/filterIcon";
import FilterModal, { type FilterConfig, type ActiveFilters } from "../models/FilterModal";

// Types
interface Column {
  key: string;
  label: string;
  render?: (value: any, row: any) => React.ReactNode;
}

interface Action {
  icon: React.ReactNode;
  onClick: (row: any) => void;
  color?: string;
  label?: string;
  show?: boolean; // Control visibility (default: true)
  className?: string; // Additional classes for the action button
}

interface Tab {
  id: string;
  label: string;
  data: any[];
}

interface DataTableProps {
  icon?: React.ReactNode;
  title: string;
  columns: Column[];
  data: any[];
  actions?: Action[];
  searchable?: boolean;
  filterable?: boolean;
  filterConfigs?: FilterConfig[];  // Filter options for the filter modal
  onFilterChange?: (filters: ActiveFilters) => void; // Callback when filters change
  addButton?: {
    label: string;
    onClick: () => void;
    show?: boolean; // Control visibility (default: true)
  };
  selectable?: boolean;
  pagination?: boolean;
  itemsPerPage?: number;
  tabs?: Tab[];
  defaultTab?: string;
  serverSidePagination?: boolean;
  totalPage?: number;
  currentPage?: number;
  onPageChange?: (page: number) => void;
}

export function DataTable({
  icon,
  title,
  columns,
  data,
  actions,
  searchable = true,
  filterable = true,
  filterConfigs,
  onFilterChange,
  addButton,
  // selectable = true,
  pagination = true,
  itemsPerPage = 5,
  tabs,
  defaultTab,
  serverSidePagination = false,
  totalPage,
  currentPage: currentPageProp,
  onPageChange
}: DataTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [internalCurrentPage, setInternalCurrentPage] = useState(1);
  const currentPage = (serverSidePagination && currentPageProp !== undefined) ? currentPageProp : internalCurrentPage;
  const [activeTab, setActiveTab] = useState<string>(defaultTab || 'default');
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<ActiveFilters>({});

  const currentData = tabs && tabs.length > 0
    ? tabs.find(tab => tab.id === activeTab)?.data || []
    : data;

  // Apply column filters
  const columnFilteredData = (() => {
    const filterKeys = Object.keys(activeFilters);
    if (filterKeys.length === 0) return currentData;

    return currentData.filter(row => {
      return filterKeys.every(key => {
        const selectedValues = activeFilters[key];
        if (!selectedValues || selectedValues.length === 0) return true;

        const rowValue = row[key];
        if (rowValue === null || rowValue === undefined) return false;

        return selectedValues.some(sv =>
          String(rowValue).toLowerCase() === sv.toLowerCase()
        );
      });
    });
  })();

  // Apply search
  const filteredData = searchQuery
    ? columnFilteredData.filter(row => {
        const query = searchQuery.toLowerCase();

        // 1. Search through column keys (with one-level nesting for objects)
        const matchesColumn = columns.some(column => {
            const value = row[column.key];
            if (value === null || value === undefined) return false;
            if (typeof value === 'object') {
                return Object.values(value).some(nestedVal =>
                    String(nestedVal ?? '').toLowerCase().includes(query)
                );
            }
            return String(value).toLowerCase().includes(query);
        });
        if (matchesColumn) return true;

        // 2. Also search through all flat (primitive) row values
        //    This catches fields like "email" that are rendered but aren't column keys
        return Object.values(row).some(value => {
            if (value === null || value === undefined) return false;
            if (typeof value === 'object') return false; // skip objects, already handled above
            return String(value).toLowerCase().includes(query);
        });
    })
    : columnFilteredData;

  const handleFilterApply = (filters: ActiveFilters) => {
    setActiveFilters(filters);
    handlePageChange(1);
    onFilterChange?.(filters);
  };

  const activeFilterCount = Object.values(activeFilters).filter(v => v.length > 0).length;

  const totalPages = serverSidePagination && totalPage !== undefined
    ? totalPage
    : Math.ceil(filteredData.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = pagination 
    ? (serverSidePagination ? filteredData.slice(0, itemsPerPage) : filteredData.slice(startIndex, endIndex)) 
    : filteredData;

  const handlePageChange = (page: number) => {
    if (!serverSidePagination) {
      setInternalCurrentPage(page);
    }
    if (onPageChange) {
      onPageChange(page);
    }
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push('...');

      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) pages.push('...');
      pages.push(totalPages);
    }

    return pages;
  };

  const visibleActions = actions?.filter(action => action.show !== false) || [];
  const hasVisibleActions = visibleActions.length > 0;

  return (
    <div className="rounded-xl bg-surface shadow-custom">
      <div className="p-3 rounded-xl">
        {/* Tabs and Search and Actions Bar */}
        <div className="flex flex-col">
          {/* Tabs Section */}
          {tabs && tabs.length > 0 && (
            <div className="flex mb-4">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  className="px-4 py-2 font-medium text-sm rounded-lg transition"
                  style={{
                    color: activeTab === tab.id ? "var(--text-primary)" : "var(--text-primary)",
                    backgroundColor: activeTab === tab.id ? "var(--background-secondary-light)" : "transparent"
                  }}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          )}

          <div className="flex flex-col md:flex-row md:items-end justify-between w-full mb-4 gap-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl p-1.5 bg-white flex items-center justify-center shadow-overall shrink-0 dark:bg-primary dark:shadow-none dark:border dark:border-border-dark">
                {icon}
              </div>
              <h2 className="text-xl font-medium text-primary dark:text-white">
                {title}
              </h2>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
              {searchable && (
                <div className="relative w-full sm:w-auto">
                  <Search
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2"
                    style={{ color: "var(--text-sec)" }}
                  />
                  <input
                    type="text"
                    placeholder="Search here"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      handlePageChange(1);
                    }}
                    className="w-full sm:w-64 pl-10 pr-4 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 text-primary border border-[--stroke] dark:text-white dark:border-border-dark dark:bg-transparent"
                  />
                </div>
              )}

              <div className="flex gap-3 w-full sm:w-auto">
                {filterable && (
                  <button
                    onClick={() => setIsFilterModalOpen(true)}
                    className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 
                              rounded-lg text-sm transition hover:opacity-90 whitespace-nowrap 
                              border cursor-pointer
                              ${activeFilterCount > 0
                                ? 'border-primary bg-primary/5 dark:border-white dark:bg-white/10'
                                : 'border-[--stroke] dark:border-border-dark'
                              }
                              dark:text-white`}>
                    <FilterIcon />
                    Filter
                    {activeFilterCount > 0 && (
                      <span className="ml-1 bg-primary text-white dark:bg-white dark:text-[#1A1A1A] text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                        {activeFilterCount}
                      </span>
                    )}
                  </button>
                )}

                {addButton && addButton.show !== false && (
                  <button
                    onClick={addButton.onClick}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-3 rounded-[18px] text-sm text-white transition hover:opacity-90 whitespace-nowrap gradient-box cursor-pointer"
                  >
                    <AddIcon />
                    {addButton.label}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Table for desktop, stacked cards for mobile */}
          <div className="overflow-x-auto hidden md:block">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottomColor: "var(--stroke)", backgroundColor: "var(--background-secondary-light)" }}>
                  {columns.map((column) => (
                    <th
                      key={column.key}
                      className="text-left py-3 px-4 text-xs dark:bg-[#2A2A2A] text-gray-900 dark:text-white"
                      style={{ fontSize: '13px' }}
                    >
                      {column.label}
                    </th>
                  ))}
                  {hasVisibleActions && (
                    <th
                      className="text-left py-3 px-4 text-xs font-bold text-[14px] dark:bg-secondary text-gray-900 dark:text-white"
                    >
                      Action
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {paginatedData.length === 0 ? (
                  <tr>
                    <td
                      colSpan={columns.length + (actions ? 1 : 0)}
                      className="text-center py-8 text-sm"
                      style={{ color: "var(--text-sec)" }}
                    >
                      No data found
                    </td>
                  </tr>
                ) : (
                  paginatedData.map((row, rowIndex) => {
                    const actualIndex = startIndex + rowIndex;
                    return (
                      <tr
                        key={actualIndex}
                        className="transition hover:bg-gray-50 dark:hover:bg-transparent"
                        style={{ borderBottomColor: "var(--stroke)", borderBottom: `1px solid var(--stroke)` }}
                      >
                        {columns.map((column) => (
                          <td
                            key={column.key}
                            className="py-3 px-4 text-sm"
                            style={{ color: "var(--text-primary)" }}
                          >
                            {column.render ? column.render(row[column.key], row) : row[column.key]}
                          </td>
                        ))}
                        {hasVisibleActions && (
                          <td className="py-3 px-4 pr-2">
                            <div className="flex items-center gap-2">
                              {visibleActions.map((action, actionIndex) => (
                                <button
                                  key={actionIndex}
                                  onClick={() => action.onClick(row)}
                                  className={`p-1.5 hover:bg-gray-100 dark:hover:bg-transparent rounded transition ${action.className || ""}`}
                                  title={action.label}
                                >
                                  {action.icon}
                                </button>
                              ))}
                            </div>
                          </td>
                        )}
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Stacked card layout for mobile */}
          <div className="block md:hidden">
            {paginatedData.length === 0 ? (
              <div className="text-center py-8 text-sm" style={{ color: "var(--text-sec)" }}>
                No data found
              </div>
            ) : (
              paginatedData.map((row, rowIndex) => {
                const [firstCol, ...restCols] = columns;
                return (
                  <div
                    key={rowIndex}
                    className="rounded-xl mb-4 overflow-hidden bg-surface"
                  >
                    {/* Card Header */}
                    <div className="px-4 py-3 border-b border-stroke bg-secondary-light dark:bg-secondary">
                      <div className="font-semibold text-sm text-primary dark:text-white">
                        {firstCol.render ? firstCol.render(row[firstCol.key], row) : row[firstCol.key]}
                      </div>
                    </div>

                    {/* Card Body: label left, value right */}
                    <div className="px-4 py-3 space-y-2.5">
                      {restCols.map((column, idx) => {
                        // Special case: Shipping Contact and Country in one line
                        if (
                          (column.key === 'shippingContact' || column.label === 'Shipping Contact') &&
                          restCols[idx + 1] &&
                          (restCols[idx + 1].key === 'country' || restCols[idx + 1].label === 'Country' || restCols[idx + 1].label === 'Shipping Country')
                        ) {
                          const countryCol = restCols[idx + 1];
                          return (
                            <div key={column.key + '-with-country'} className="flex items-center justify-between gap-3">
                              <span className="text-xs surface-text shrink-0 w-2/5">
                                {column.label}
                              </span>
                              <span className="text-xs font-medium surface-text flex justify-end w-3/5">
                                {/* Phone and country in one line, no gap */}
                                <span>
                                  {(column.render ? column.render(row[column.key], row) : row[column.key])}
                                  {countryCol ? (
                                    <span className="ml-2 text-xs surface-text dark:text-gray-300">
                                      {countryCol.render ? countryCol.render(row[countryCol.key], row) : row[countryCol.key]}
                                    </span>
                                  ) : null}
                                </span>
                              </span>
                            </div>
                          );
                        }
                        // Skip rendering the country column itself, since it's merged above
                        if (
                          idx > 0 &&
                          (column.key === 'country' || column.label === 'Country' || column.label === 'Shipping Country') &&
                          (restCols[idx - 1].key === 'shippingContact' || restCols[idx - 1].label === 'Shipping Contact')
                        ) {
                          return null;
                        }
                        return (
                          <div key={column.key} className="flex items-center justify-between gap-3">
                            <span className="text-xs text-gray-500 dark:text-gray-400 shrink-0 w-2/5">
                              {column.label}
                            </span>
                            <span className="text-xs font-medium text-primary dark:text-white flex justify-end w-3/5">
                              {column.render ? column.render(row[column.key], row) : row[column.key]}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Actions Row */}
                    {hasVisibleActions && (
                      <div className="flex items-center border-t border-stroke">
                        {visibleActions.map((action, actionIndex, filteredArr) => (
                          <button
                            key={actionIndex}
                            onClick={() => action.onClick(row)}
                            className={
                              `flex-1 flex items-center justify-center py-3 transition
                            hover:bg-gray-50 dark:hover:bg-gray-800
                            ${actionIndex < filteredArr.length - 1 ? 'border-r border-stroke' : ''}
                            ${action.className || ""}
                            surface-text`
                            }
                          >
                            {action.icon}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Pagination */}
          {pagination && totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <button
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="flex items-center gap-2 px-4 py-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed transition"
                style={{ color: "var(--text-sec)" }}
              >
                <ChevronLeft size={16} />
                Previous
              </button>

              <div className="flex items-center gap-2">
                {getPageNumbers().map((page, index) => (
                  page === '...' ? (
                    <span key={`ellipsis-${index}`} style={{ color: "var(--text-sec)" }}>...</span>
                  ) : (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page as number)}
                      className={`
                        w-8 h-8 rounded text-sm transition flex items-center justify-center
                        ${currentPage === page
                          ? "bg-primary text-white dark:bg-primary dark:text-white"
                          : "text-[--text-sec] hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
                        }
                      `}
                    >
                      {page}
                    </button>
                  )
                ))}
              </div>

              <button
                onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="flex items-center gap-2 px-4 py-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed transition"
                style={{ color: "var(--text-sec)" }}
              >
                Next
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Filter Modal */}
      {filterConfigs && filterConfigs.length > 0 && (
        <FilterModal
          isOpen={isFilterModalOpen}
          onClose={() => setIsFilterModalOpen(false)}
          onApply={handleFilterApply}
          filters={filterConfigs}
          activeFilters={activeFilters}
        />
      )}
    </div>
  );
}