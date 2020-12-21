import {
  ValueGetterParams,
  CellValue,
  ColDef,
  CellClassParams,
  DataGrid,
} from "@material-ui/data-grid";
import React, { useMemo } from "react";
import { BillType, BillCategoryType } from "../types/bills";
import { LedgerFilterState } from "./Ledger";

const BillsFilterByMonth: React.FunctionComponent<{
  month: LedgerFilterState["month"];
  groupByCategory: LedgerFilterState["groupByCategory"];
  bills: BillType[];
  categories: BillCategoryType[];
}> = ({ month, bills, groupByCategory, categories }) => {
  const billsFilteredByMonth = useMemo(
    () =>
      bills.filter((bill) => month === -1 || bill.time.getMonth() === month),
    [bills, month]
  );
  return (
    <GroupByCategory
      groupByCategory={groupByCategory}
      bills={billsFilteredByMonth}
      categories={categories}
    />
  );
};

const GroupByCategory: React.FunctionComponent<{
  groupByCategory: LedgerFilterState["groupByCategory"];
  bills: BillType[];
  categories: BillCategoryType[];
}> = ({ groupByCategory, bills, categories }) => {
  const categoryMap = useMemo(
    () =>
      new Map<string, BillCategoryType>(categories.map((cat) => [cat.id, cat])),
    [categories]
  );
  const groupedBills = useMemo(() => {
    const categorySum = new Map<string, number>();
    bills.forEach((bill) => {
      const key =
        bill.category && bill.category !== ""
          ? bill.category
          : bill.type.toString();
      if (categorySum.has(key)) {
        categorySum.set(key, (categorySum.get(key) ?? 0) + bill.amount);
      } else {
        categorySum.set(key, bill.amount);
      }
    });
    const results: BillType[] = [];
    categorySum.forEach((value, key) => {
      // 0 and 1 stands for no category income and expanse
      if (key === "0" || key === "1") {
        results.push({
          time: new Date(),
          type: parseInt(key) as 0 | 1,
          category: "",
          amount: value,
        });
      } else {
        results.push({
          time: new Date(),
          type: categoryMap.get(key)?.type as 0 | 1,
          category: key,
          amount: value,
        });
      }
    });

    return results;
  }, [bills, categoryMap]);
  return (
    <BillsTable
      noTimeColumn={groupByCategory ? true : false}
      bills={groupByCategory ? groupedBills : bills}
      categories={categories}
    />
  );
};
const BillsTable: React.FunctionComponent<{
  noTimeColumn?: boolean;
  bills: BillType[];
  categories: BillCategoryType[];
}> = ({ bills, categories, noTimeColumn = false }) => {
  const categoriesMap = useMemo(() => {
    const catDict = new Map();
    categories.forEach((cat) => catDict.set(cat.id, cat.name));
    return catDict;
  }, [categories]);
  const billsWithId = useMemo(
    () =>
      bills.map((bill, index) => ({
        ...bill,
        id: `${index}-${bill.time.toISOString()}`,
      })),
    [bills]
  );
  const columns = useMemo(
    () =>
      [
        { field: "id", headerName: "ID", hide: true },
        {
          field: "time",
          headerName: "账单时间",
          width: 600,
          hide: noTimeColumn,
        },
        {
          field: "type",
          headerName: "账单类型",
          width: 200,
          valueGetter: (params: ValueGetterParams) =>
            params.value === 0 ? "支出" : "收入",
        },
        {
          field: "category",
          headerName: "账单分类",
          type: "number",
          flex: 1,
          width: 200,
          sortComparator: (v1: CellValue, v2: CellValue) =>
            categoriesMap.get(v1).localeCompare(categoriesMap.get(v2)),
          valueGetter: (params: ValueGetterParams) =>
            params.value ? `${categoriesMap.get(params.value)}` : "",
        },
        {
          field: "amount",
          headerName: "账单金额",
          type: "number",
          //   description: 'This column has a value getter and is not sortable.',
          width: 200,
        },
      ].map(
        (col: ColDef): ColDef => ({
          ...col,
          cellClassName: (params: CellClassParams) => {
            let result: string[] = [];
            if (typeof col.cellClassName === "string") {
              result.push(col.cellClassName);
            } else if (Array.isArray(col.cellClassName)) {
              result = [...result, ...col.cellClassName];
            } else if (typeof col.cellClassName === "function") {
              const excutedResult = col.cellClassName(params);
              if (typeof excutedResult === "string") {
                result.push(excutedResult);
              } else {
                result = [...result, ...excutedResult];
              }
            }
            result = [
              ...result,
              ...[params.getValue("type") === "支出" ? "red" : "green"],
            ];
            return result;
          },
        })
      ),
    [categoriesMap, noTimeColumn]
  );
  return (
    <div style={{ display: "flex", height: "100%" }}>
      <div style={{ flexGrow: 1 }}>
        <DataGrid
          rows={billsWithId}
          autoHeight
          columns={columns}
          pageSize={20}
        />
      </div>
    </div>
  );
};
export { BillsFilterByMonth as BillsTable };
