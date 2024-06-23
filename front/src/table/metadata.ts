import { LOADING_STATE } from "@/constants";
import { updateNestedDataByPath } from "@/util";
import React from "react";

type RowMetadata = {
  Status?: typeof LOADING_STATE;
};

export function useTableRowsMetadata() {
  const [rowsMetadata, setRowsMetadata] = React.useState(
    new Map<string, RowMetadata>()
  );

  const getRowMetadata = (id: string) => rowsMetadata.get(id);

  const updateRowMetadata = (id: string, update: any) =>
    setRowsMetadata((oldData) => {
      const data = oldData.get(id);
      const newData = updateNestedDataByPath(oldData, [id], {
        ...data,
        ...update,
      });
      return newData;
    });

  const setRowMetadataLoading = (id: string) =>
    updateRowMetadata(id, { Status: LOADING_STATE });

  const unSetRowMetadataLoading = (id: string) =>
    updateRowMetadata(id, { Status: undefined });

  const isRowLoading = (id: string) =>
    getRowMetadata(id)?.Status === LOADING_STATE;

  return {
    isRowLoading,
    setRowMetadataLoading,
    unSetRowMetadataLoading,
  };
}
