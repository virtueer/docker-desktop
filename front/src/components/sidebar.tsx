import "./sidebar.css";
import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { IconType } from "react-icons";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import { GoContainer } from "react-icons/go";
import { RxCodesandboxLogo } from "react-icons/rx";
import { TfiHarddrive } from "react-icons/tfi";
import { Button } from "./ui/button";

function SidebarItem({
  open,
  to,
  Icon,
  text,
}: {
  open: boolean;
  to: string;
  Icon: IconType;
  text: string;
}) {
  return (
    <Link
      to={to}
      className="rounded-lg"
      activeProps={{ className: "!bg-slate-700" }}
    >
      <Button
        variant="ghost"
        className="gap-5 justify-start overflow-hidden"
        style={{
          width: open ? "200px" : "50px",
          transition: "width .25s ease-in-out",
        }}
      >
        <Icon size="1.25rem" className="relative min-w-[1.25rem]" />
        {text}
      </Button>
    </Link>
  );
}

export default function Sidebar() {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex">
      <div id="sidebar-content" className="flex flex-col p-3 border-r-2 gap-1">
        <SidebarItem
          open={open}
          to="/container"
          Icon={GoContainer}
          text="Containers"
        />
        <SidebarItem
          open={open}
          to="/images"
          Icon={RxCodesandboxLogo}
          text="Images"
        />
        <SidebarItem
          open={open}
          to="/volumes"
          Icon={TfiHarddrive}
          text="Volumes"
        />
      </div>
      <Button
        id="sidebar-toggle"
        variant="ghost"
        className="relative -left-3 top-3 rounded-full bg-slate-700 hover:text-blue-500 hover:bg-slate-600 p-2.5 h-fit"
        onClick={() => setOpen(!open)}
      >
        {!open && <FaChevronRight className="w-[0.7rem] h-[0.7rem]" />}
        {open && <FaChevronLeft className="w-[0.7rem] h-[0.7rem]" />}
      </Button>
    </div>
  );
}
