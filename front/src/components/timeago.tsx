/* eslint-disable @typescript-eslint/ban-ts-comment */
import ReactTimeago from "react-timeago";
//@ts-ignore
import buildFormatter from "react-timeago/lib/formatters/buildFormatter";
//@ts-ignore
import englishStrings from "react-timeago/lib/language-strings/en";

export const formatter = buildFormatter(englishStrings);

export const TimeAgo = ({ date }: { date: string | number | Date }) => (
  <ReactTimeago date={date} formatter={formatter} />
);
