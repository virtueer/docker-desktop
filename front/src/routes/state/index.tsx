import { createFileRoute } from "@tanstack/react-router";
import { JsonEditor } from "json-edit-react";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/state/")({
  component: Page,
});

function Page() {
  const [data, setData] = useState([]);

  const getData = async () => {
    const response = await fetch("http://localhost:3000/container/list").then(
      (r) => r.json()
    );

    setData(response);
  };

  useEffect(() => {
    setInterval(getData, 1000);
  }, []);

  return (
    <div className="overflow-auto">
      <JsonEditor
        data={data}
        maxWidth=""
        theme={"githubDark"}
        rootName="data"
        restrictEdit
        restrictDelete
        restrictAdd
        restrictDrag
        restrictTypeSelection
        enableClipboard={false}
        rootFontSize={13}
      />
    </div>
  );
}
