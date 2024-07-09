import { GoContainer } from "react-icons/go";
import { Button } from "./ui/button";
import { RxCodesandboxLogo } from "react-icons/rx";
import { TfiHarddrive } from "react-icons/tfi";
import { Link } from "@tanstack/react-router";

export default function Sidebar() {
  return (
    <div className="flex flex-col p-3 border-r-2 gap-1">
      <Link
        to="/v2/container"
        className="rounded-lg"
        activeProps={{ className: "!bg-slate-700" }}
      >
        <Button variant="ghost" className="gap-3 justify-start w-full">
          <GoContainer size="1.25rem" />
          Containers
        </Button>
      </Link>
      <Link
        to="/images"
        className="rounded-lg"
        activeProps={{ className: "!bg-slate-700" }}
      >
        <Button variant="ghost" className="gap-3 justify-start w-full">
          <RxCodesandboxLogo size="1.25rem" />
          Images
        </Button>
      </Link>
      <Link
        to="/volumes"
        className="rounded-lg"
        activeProps={{ className: "!bg-slate-700" }}
      >
        <Button variant="ghost" className="gap-3 justify-start w-full">
          <TfiHarddrive size="1.25rem" />
          Volumes
        </Button>
      </Link>
    </div>
  );
}
