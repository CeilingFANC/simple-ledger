import { createStyles, makeStyles, Theme } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { CSVReader } from "react-papaparse";
import { BillType, BillCategoryType } from "../types/bills";
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    csvReader: {
      padding: theme.spacing(1),
      // textAlign: 'center',
      color: theme.palette.text.secondary,
    },
  })
);
const InitFileReader: React.FunctionComponent<{
  setCategories: any;
  setBills: any;
}> = ({ setCategories, setBills }) => {
  const classes = useStyles();
  return (
    <div>
      <div className={classes.csvReader}>
        <CSVReaderWrapper
          key={1}
          onLoad={setBills}
          checkValid={(obj: any) =>
            Object.keys(obj).length === 4 &&
            Object.keys(obj).reduce(
              (hasKey: boolean, key): boolean =>
                hasKey && ["type", "time", "category", "amount"].includes(key),
              true
            )
          }
          transform={(obj: any): BillType => ({
            ...obj,
            type: parseInt(obj.type, 10),
            time: new Date(parseInt(obj.time, 10)),
            amount: parseInt(obj.amount, 10),
          })}
        />
      </div>
      <div className={classes.csvReader}>
        <CSVReaderWrapper
          key={2}
          onLoad={(data: any) => setCategories(data)}
          checkValid={(obj: any) =>
            Object.keys(obj).length === 3 &&
            Object.keys(obj).reduce(
              (hasKey: boolean, key): boolean =>
                hasKey && ["id", "name", "type"].includes(key),
              true
            )
          }
          transform={(obj: any): BillCategoryType => ({
            ...obj,
            type: parseInt(obj.type, 10),
          })}
        />
      </div>
    </div>
  );
};

const CSVReaderWrapper: React.FunctionComponent<{
  onLoad: Function;
  transform: Function;
  checkValid: Function;
}> = ({ onLoad, transform, checkValid }) => {
  const [key, setKey] = useState(0);

  useEffect(() => {
    return () => {
      onLoad(undefined);
    };
    // eslint-disable-next-line
  }, []);

  return (
    <CSVReader
      key={key}
      onDrop={(data: any[]) => {
        console.log(data);
        const isValid = data.reduce(
          (isValid, obj) => checkValid(obj.data) && isValid,
          true
        );
        if (!isValid) {
          setKey(key + 1);
        } else {
          const processed = data.map((obj) => transform(obj.data));
          console.log(processed);
          onLoad(processed);
        }
      }}
      onError={handleOnError}
      noDrag
      config={{ header: true }}
      addRemoveButton
      onRemoveFile={() => onLoad(undefined)}
    >
      <span>Click to upload.</span>
    </CSVReader>
  );
};

const handleOnError = (err: any) => {
  console.log(err);
};

export default InitFileReader;
