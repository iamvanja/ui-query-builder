// import { useState } from "react";
import { QueryBuilder } from "@/components/query-builder";
import { columns } from "@/components/query-builder/columns";
import { Column } from "@/components/query-builder/types";

export default function Page() {
  // const [queryBuilderResult, setQueryBuilderResult] = useState("");

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
          {/* QueryBuilder result (todo): {queryBuilderResult} */}
          <br />
          <QueryBuilder columns={columns as Column[]} isDebug />
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
