import { Input } from "@/components/ui/input";

export default function Page() {
  return (
    <>
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
            <Input
              type="text"
              placeholder="Future Autocomplete component here..."
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
    </>
  );
}
