import {
  createStyles,
  Grid,
  makeStyles,
  Paper,
  Theme,
} from "@material-ui/core";
import React, { useCallback, useReducer, useState } from "react";
import { BillType, BillCategoryType } from "../types/bills";
import AddBillDislog from "./AddBillDialog";
import InitFileReader from "./InitFileReader";
import LedgerContent from "./LedgerContent";
import LedgerFilter from "./LedgerFilter";

export type LedgerFilterState = {
  /** [-1,11] */
  month: number;
  groupByCategory: boolean;
};
export type LedgerFilterAction =
  | {
      type: "setMonth";
      month: number;
    }
  | {
      type: "toggleFilterByCategory";
    };
const initialState: LedgerFilterState = { month: -1, groupByCategory: false };

function ledgerFilterReducer(
  state: LedgerFilterState,
  action: LedgerFilterAction
): LedgerFilterState {
  switch (action.type) {
    case "setMonth":
      return { ...initialState, month: action.month };
    case "toggleFilterByCategory":
      return { ...state, groupByCategory: !state.groupByCategory };
    default:
      throw state;
  }
}
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: theme.spacing(1),
      flexGrow: 1,
    },
    paper: {
      padding: theme.spacing(2),
      // textAlign: 'center',
      color: theme.palette.text.secondary,
    },
  })
);

// main component
function Ledger() {
  const classes = useStyles();

  const [bills, setBills] = useState<BillType[]>();
  const [categories, setCategories] = useState<BillCategoryType[]>();
  const [filter, dispatchFilter] = useReducer(
    ledgerFilterReducer,
    initialState
  );
  // for add new bill
  const addBill = useCallback(
    (bill: BillType) => {
      setBills([...(bills ?? []), bill]);
    },
    [bills]
  );

  return (
    <Grid container className={classes.root} spacing={3}>
      <Grid item xs={12}>
        <Paper className={classes.paper}>
          <h2>1. 上传账单及账单分类</h2>
          <InitFileReader setBills={setBills} setCategories={setCategories} />
        </Paper>
      </Grid>
      <Grid item xs={12}>
        <Paper className={classes.paper} elevation={0}>
          <h2>2. 根据月份及类别筛选</h2>

          {
            //only show following when correct files are uploaded
            bills && categories ? (
              <>
                <LedgerFilter filter={filter} dispatchFilter={dispatchFilter} />
                <AddBillDislog categories={categories} addBill={addBill} />
                <LedgerContent
                  bills={bills}
                  categories={categories}
                  filter={filter}
                />
              </>
            ) : (
              "请先上传账单及账单分类"
            )
          }
        </Paper>
      </Grid>
    </Grid>
  );
}

export default Ledger;
