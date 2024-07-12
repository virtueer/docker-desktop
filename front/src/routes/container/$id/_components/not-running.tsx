import { IconType } from "react-icons";

type Props = {
  text: string;
  Icon: IconType;
};

export default function NotRunning({ Icon, text }: Props) {
  return (
    <div className="bg-black w-full h-full flex flex-col items-center justify-center gap-3">
      <div className="text-white rounded-full bg-slate-800 p-3 flex items-center justify-center">
        <Icon className="text-slate-400" size={30} />
      </div>
      <div className="font-semibold">{text}</div>
    </div>
  );
}
