import { QueryBuilder } from "@/components/query-builder";
import { columns } from "@/components/query-builder/columns";
import { Column } from "@/components/query-builder/types";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { ListFilter } from "lucide-react";

export default function Page() {
  const [isDebug, setIsDebug] = useState(true);
  const [isSticky, setIsSticky] = useState(true);
  const [isControlBarVisible, setIsControlBarVisible] = useState(true);

  const handleDebugChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setIsDebug(event.target.checked);
  };

  const handleStickyChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setIsSticky(event.target.checked);
  };

  const toggleControlBar = () => {
    setIsControlBarVisible(!isControlBarVisible);
  };

  return (
    <div className="min-h-full bg-gray-100">
      <header className="bg-white shadow relative z-[1]">
        <div className="mx-auto max-w-7xl px-8 py-6">
          <div className="flex justify-between">
            <div className="flex">
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                Query Builder UI demo
              </h1>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:items-center">
              <Button
                variant="outline"
                active={isControlBarVisible}
                onClick={toggleControlBar}
              >
                <ListFilter className="h-5 w-5 mr-1" />
                Filter
              </Button>
            </div>
          </div>
        </div>
      </header>
      <nav
        className={cn(
          "transition-all duration-200 z-1 sticky top-0 shadow backdrop-blur-sm bg-white/80",
          {
            "max-h-screen opacity-100": isControlBarVisible,
            "max-h-0 opacity-0 overflow-hidden": !isControlBarVisible,
            sticky: isSticky,
            relative: !isSticky,
          }
        )}
      >
        <div className="control-bar-container mx-auto max-w-7xl px-8 py-4">
          <div className="px-4">
            <div className="items-top flex space-x-2">
              <input
                type="checkbox"
                id="isDebug"
                checked={isDebug}
                onChange={handleDebugChange}
              />
              <div className="grid gap-1.5 leading-none pr-3">
                <label
                  htmlFor="isDebug"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  isDebug
                </label>
              </div>
              <input
                type="checkbox"
                id="isSticky"
                checked={isSticky}
                onChange={handleStickyChange}
              />
              <div className="grid gap-1.5 leading-none">
                <label
                  htmlFor="isSticky"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  is control bar sticky
                </label>
              </div>
            </div>
            <QueryBuilder
              shouldPersistData
              columns={columns as Column[]}
              isDebug={isDebug}
              rootClassName="mt-4"
            />
          </div>
        </div>
      </nav>
      <main>
        <div className="mx-auto max-w-7xl px-8 py-5">
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
