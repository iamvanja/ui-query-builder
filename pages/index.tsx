import { AutoComplete } from "@/components/ui/autocomplete";
import { useState } from "react";

const columns = [
  "Name",
  "Stage",
  "my nifty column",
  "Date of Last Interactions",
  "PatientsReferred",
  "add 1",
  "A",
  "B",
  "Close Date",
  "coffee shop type",
  "Column 15",
  "Column 18",
  "Column 35",
  "Deal Size",
  "Industry",
  "Inserter",
  "Lead Source",
  "Priority",
  "Priority Type",
  "Products Sold",
  "Team Size",
  "type",
  "Wedding Date",
  "(line break)",
  "AssignedTo",
  "Notes",
  "Email Addresses",
  "Last Email From",
  "First Email From",
  "Email Thread Count",
  "Received Email Count",
  "Date of Last Email",
  "Date of Last Sent Email",
  "Date of Last Received Email",
  "Date of First Email",
  "Date of First Sent Email",
  "Date of First Received Email",
  "Total Tracked Views",
  "Total Links Clicked",
  "Date of Last Tracked Views",
  "Date of Last Link Clicked",
  "Total Assignees",
  "Overdue Task Assignees",
  "Incomplete Task Assignees",
  "Tasks Count",
  "Complete Tasks Count",
  "Incomplete Tasks Count",
  "Overdue Tasks Count",
  "Date of Most Overdue Task",
  "Date of Next Due Task",
  "Comment Count",
  "Date of Last Comment",
  "Date of Last Interaction",
  "Last Interaction Type",
];

export default function Page() {
  const [autoCompleteSelection, setAutoCompleteSelection] = useState("");

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
            autocomplete selection: {autoCompleteSelection}
            <br />
            <AutoComplete
              fields={columns}
              placeholder="Future Autocomplete component here..."
              onSelectionChange={setAutoCompleteSelection}
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
