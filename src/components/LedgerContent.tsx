import { Grid } from "@material-ui/core";
import React from "react";
import { BillType, BillCategoryType } from "../types/bills";
import { LedgerFilterState } from "./Ledger";
import { months } from "./LedgerFilter";
import { BillsTable } from "./Table";

const BillSum: React.FunctionComponent<{
  month: LedgerFilterState["month"];
  bills: BillType[] | undefined;
}> = ({ month, bills }) => {
  const chosenBills =
    (bills && bills.filter((bill) => bill.time.getMonth() === month)) ?? [];

  return (
    <div>
      <p>{months[month].label}</p>
      <p>
        总支出:{" "}
        {chosenBills
          .filter((bill) => bill.type === 0)
          .reduce((sum, bill) => sum + bill.amount, 0)}
      </p>
      <p>
        总收入:{" "}
        {chosenBills
          .filter((bill) => bill.type === 1)
          .reduce((sum, bill) => sum + bill.amount, 0)}
      </p>
    </div>
  );
};

const LedgerContent: React.FunctionComponent<{
  filter: LedgerFilterState;
  bills: BillType[];
  categories: BillCategoryType[];
}> = ({ filter, bills, categories }) => {
  return (
    <Grid container>
      <Grid item xs={12}>
        {filter.month > -1 && <BillSum bills={bills} month={filter.month} />}
      </Grid>

      <Grid item xs={12}>
        <BillsTable
          groupByCategory={filter.groupByCategory}
          bills={bills}
          categories={categories}
          month={filter.month}
        />
      </Grid>
    </Grid>
  );
};

export default LedgerContent;
