import { QueryBuilder } from "@/components/query-builder";
import { columns } from "@/components/query-builder/columns";
import { Column, QueryPart } from "@/components/query-builder/types";
import { useState, useEffect } from "react";

const LS_QUERY_PARTS_KEY = "queryParts";
export default function Page() {
  const [isDebug, setIsDebug] = useState(false);

  const handleDebugChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setIsDebug(event.target.checked);
  };

  const [initialFilter, setInitialFilter] = useState<QueryPart[] | undefined>(
    undefined
  );
  useEffect(() => {
    const storedQueryParts = localStorage?.getItem(LS_QUERY_PARTS_KEY);
    setInitialFilter(
      storedQueryParts ? (JSON.parse(storedQueryParts) as QueryPart[]) : []
    );
  }, []);

  return (
    <div className="min-h-full bg-gray-100">
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-8 py-6">
          <div className="flex justify-between">
            <div className="flex">
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                Query Builder UI demo
              </h1>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:items-center">
              [QB toggle button]
            </div>
          </div>
        </div>
      </header>
      <nav>
        <div className="mx-auto max-w-7xl px-8 py-4">
          <div className="items-top flex space-x-2">
            <input
              type="checkbox"
              id="isDebug"
              checked={isDebug}
              onChange={handleDebugChange}
            />
            <div className="grid gap-1.5 leading-none">
              <label
                htmlFor="isDebug"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                isDebug
              </label>
            </div>
          </div>
          {initialFilter !== undefined && (
            <QueryBuilder
              initialFilter={initialFilter}
              columns={columns as Column[]}
              isDebug={isDebug}
              rootClassName="mt-4"
              onFilterChange={(queryParts) => {
                localStorage.setItem(
                  LS_QUERY_PARTS_KEY,
                  JSON.stringify(queryParts)
                );
              }}
            />
          )}
        </div>
      </nav>
      <main>
        <div className="mx-auto max-w-7xl px-8 py-8">
          <div className="px-4 py-4 bg-white shadow rounded-md">
            {Array.from({ length: 100 }, (_, i) => (
              <div
                key={`row-${i}`}
                className="p-2 border-b border-gray-200 bg-white"
              >
                Row {`${i + 1}`.padStart(3, "0")}
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
