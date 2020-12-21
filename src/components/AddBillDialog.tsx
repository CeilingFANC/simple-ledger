import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { FormControl, InputLabel, MenuItem, Select } from "@material-ui/core";
import { BillCategoryType, BillType } from "../types/bills";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      display: "flex",
      flexWrap: "wrap",
    },
    button: {
      margin: theme.spacing(1),
    },
  })
);

const AddBillForm: React.FunctionComponent<{
  categories: BillCategoryType[];
  addBill: (bill: BillType) => void;
}> = ({ categories, addBill }) => {
  const classes = useStyles();

  const [time, setTime] = useState<string>("2017-05-24T10:30");
  const [category, setCategory] = useState<string>("");
  const [amount, setAmount] = useState<number>(0);
  const [type, setType] = useState<0 | 1>(0);

  const chosenCat = categories.find(
    (predefinedCat) => predefinedCat.id === category
  )?.type;
  return (
    <form
      id="add-bill-form"
      className={classes.container}
      noValidate
      onSubmit={(e) => {
        e.preventDefault();

        addBill({
          time: new Date(time),
          category: category ?? "",
          amount: amount,
          type,
        });
      }}
    >
      <TextField
        id="datetime-local"
        label="Time"
        type="datetime-local"
        value={time}
        onChange={(e) => setTime(e.target.value)}
        required
        fullWidth
      />
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Category</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={category}
          onChange={(e) => {
            const chosenCat =
              categories.find((predefinedCat) => predefinedCat.id === category)
                ?.type ?? 0;
            setType(chosenCat);
            setCategory(e.target.value as string);
          }}
          fullWidth
        >
          <MenuItem value={""}>none</MenuItem>
          {categories.map((cat, index) => (
            <MenuItem value={cat.id} key={cat.id}>
              {cat.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl fullWidth>
        <InputLabel id="type-simple-select-label">Type</InputLabel>
        {category && chosenCat !== undefined ? (
          // when category is choosed, show corresponding type

          <Select
            labelId="type-simple-select-label"
            id="type-simple-select"
            value={type}
            disabled
            required
            fullWidth
          >
            <MenuItem value="0">支出</MenuItem>
            <MenuItem value="1">收入</MenuItem>
          </Select>
        ) : (
          // when no category is choosed, type is derived from amount

          <Select
            labelId="type-simple-select-label"
            id="type-simple-select"
            value={type}
            onChange={(e) =>
              setType(parseInt(e.target.value as string) as 0 | 1)
            }
            required
            fullWidth
          >
            <MenuItem value="0">支出</MenuItem>
            <MenuItem value="1">收入</MenuItem>
          </Select>
        )}
      </FormControl>

      <TextField
        autoFocus
        id="amount"
        label="Amount"
        type="number"
        margin="dense"
        value={amount}
        onChange={(e) => {
          setAmount(parseFloat(e.target.value));
        }}
        inputProps={{ min: "0", step: "0.01" }}
        required
        fullWidth
      />
    </form>
  );
};
const AddBillDialog: React.FunctionComponent<{
  categories: BillCategoryType[];
  addBill: (bill: BillType) => void;
}> = ({ categories, addBill }) => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const toggle = () => {
    setOpen(!open);
  };

  return (
    <div>
      <Button
        className={classes.button}
        variant="outlined"
        color="primary"
        onClick={toggle}
      >
        Add new bill
      </Button>
      <Dialog open={open} onClose={toggle} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Add new bill</DialogTitle>
        <DialogContent>
          <DialogContentText>Add new Bill</DialogContentText>
          <AddBillForm categories={categories} addBill={addBill} />
        </DialogContent>
        <DialogActions>
          <Button onClick={toggle} color="primary">
            Cancel
          </Button>
          {/** external submit */}
          <Button
            onClick={toggle}
            color="primary"
            form="add-bill-form"
            type="submit"
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
export default AddBillDialog;
