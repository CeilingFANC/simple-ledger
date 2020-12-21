import {
  createStyles,
  FormControl,
  FormControlLabel,
  FormGroup,
  InputLabel,
  makeStyles,
  Select,
  Switch,
  Theme,
} from "@material-ui/core";
import React from "react";
import { LedgerFilterAction, LedgerFilterState } from "./Ledger";

export const months = [
  {
    label: "一月",
    value: 0,
  },
  {
    label: "二月",
    value: 1,
  },
  {
    label: "三月",
    value: 2,
  },
  {
    label: "四月",
    value: 3,
  },
  {
    label: "五月",
    value: 4,
  },
  {
    label: "六月",
    value: 5,
  },
  {
    label: "七月",
    value: 6,
  },
  {
    label: "八月",
    value: 7,
  },
  {
    label: "九月",
    value: 8,
  },
  {
    label: "十月",
    value: 9,
  },
  {
    label: "十一月",
    value: 10,
  },
  {
    label: "十二月",
    value: 11,
  },
];
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 360,
    },
  })
);
const LedgerFilter: React.FunctionComponent<{
  filter: LedgerFilterState;
  dispatchFilter: React.Dispatch<LedgerFilterAction>;
}> = ({ filter, dispatchFilter }) => {
  const classes = useStyles();
  return (
    <div>
      <FormControl variant="outlined" className={classes.formControl}>
        <InputLabel htmlFor="outlined-month-native-simple">
          Filter by Month
        </InputLabel>
        <Select
          native
          value={filter.month}
          onChange={(event) => {
            const month = event.target.value as string;
            dispatchFilter({ type: "setMonth", month: parseInt(month, 10) });
          }}
          label="Month"
          inputProps={{
            name: "month",
            id: "outlined-month-native-simple",
          }}
          fullWidth
        >
          <option aria-label="None" value={-1} />
          {months.map((month, index) => (
            <option value={month.value} key={index}>
              {month.label}
            </option>
          ))}
        </Select>
      </FormControl>
      <FormGroup row className={classes.formControl}>
        <FormControlLabel
          control={
            <Switch
              checked={filter.groupByCategory}
              onChange={() =>
                dispatchFilter({ type: "toggleFilterByCategory" })
              }
              name="groupByCategory"
              // color="primary"
            />
          }
          label="Group by Category"
        />
      </FormGroup>
    </div>
  );
};

export default LedgerFilter;
