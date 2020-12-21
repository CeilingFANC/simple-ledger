import Ledger from "./components/Ledger";
import "./App.css";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
const theme = createMuiTheme();

function App() {
  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <Ledger />
      </div>
    </ThemeProvider>
  );
}

export default App;
