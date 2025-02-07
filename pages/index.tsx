import { QueryBuilder } from "@/components/query-builder";
import { columns } from "@/components/query-builder/columns";
import { Column } from "@/components/query-builder/types";
import { useState } from "react";

export default function Page() {
  const [isDebug, setIsDebug] = useState(false);

  interface DebugChangeEvent extends React.ChangeEvent<HTMLInputElement> {}

  const handleDebugChange = (event: DebugChangeEvent) => {
    setIsDebug(event.target.checked);
  };

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

          <QueryBuilder
            columns={columns as Column[]}
            isDebug={isDebug}
            rootClassName="mt-4"
          />
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
