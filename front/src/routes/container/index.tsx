import { createFileRoute } from "@tanstack/react-router";
import { ContainerTable } from "./_table";
import { useStore } from "@/store";
import { TiMessages } from "react-icons/ti";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { Button } from "@/components/ui/button";
import { FaSearch } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  ColumnFiltersState,
  RowSelectionState,
  SortingState,
} from "@tanstack/react-table";
import { useState } from "react";
import SelectedActions from "@/components/selected/actions";
import SelectedDelete from "@/components/selected/delete";

export const Route = createFileRoute("/container/")({
  component: Page,
});

function Page() {
  const containers = useStore((state) => state.containers);
  const [show, setShow] = useState<boolean>(false);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [sorting, setSorting] = useState<SortingState>([]);

  function handleSwitch() {
    setColumnFilters((oldValues) => {
      if (show) {
        return oldValues.filter(
          (x) => x.id !== "State" && x.value !== "running"
        );
      }

      return [...oldValues, { id: "State", value: "running" }];
    });
    setShow(!show);
  }

  function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
    setColumnFilters((oldValues) => {
      const index = oldValues.findIndex((x) => x.id === "select");

      if (index === -1)
        return [...oldValues, { id: "select", value: e.target.value }];

      oldValues[index] = { ...oldValues[index], value: e.target.value };

      return [...oldValues];
    });
  }

  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-3">
        <div className="text-lg font-bold">Containers</div>
        <div className="text-xs underline underline-offset-2 text-blue-500 flex items-center gap-1">
          Give feedback
          <TiMessages />
        </div>
      </div>

      <div className="bg-slate-800 my-3 p-3 rounded flex justify-between">
        <div className="flex flex-col">
          <div className="flex items-center gap-3">
            <div>Container cpu usage</div>
            <IoMdInformationCircleOutline />
          </div>
          <div className="text-slate-400">No containers are running.</div>
        </div>

        <div className="flex flex-col">
          <div className="flex items-center gap-3">
            <div>Container memory usage</div>
            <IoMdInformationCircleOutline />
          </div>
          <div className="text-slate-400">No containers are running.</div>
        </div>

        <Button
          variant="outline"
          className="bg-transparent border-0 hover:bg-slate-700"
        >
          Show carts
        </Button>
      </div>

      <div className="flex mb-3 gap-3 justify-between items-center">
        <div className="flex gap-5">
          <div className="border-2 min-w-[400px] rounded flex items-center gap-3 hover:border-white focus-within:!border-blue-500">
            <FaSearch className="ml-3" />
            <Input
              className="border-0 p-0 m-0"
              placeholder="Search"
              style={{ boxShadow: "none" }}
              onChange={handleSearch}
            />
          </div>
          <div className="flex items-center gap-3 text-sm text-slate-400">
            <Switch onClick={handleSwitch} />
            Only show running containers
          </div>
        </div>
        {Object.keys(rowSelection).length !== 0 && (
          <div className="flex gap-5">
            <SelectedDelete rowSelection={rowSelection} />
            <SelectedActions rowSelection={rowSelection} />
          </div>
        )}
      </div>

      <ContainerTable
        data={containers}
        columnFilters={columnFilters}
        setColumnFilters={setColumnFilters}
        rowSelection={rowSelection}
        setRowSelection={setRowSelection}
        sorting={sorting}
        setSorting={setSorting}
      />
    </div>
  );
}
