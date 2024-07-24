import PropTypes from "prop-types";
import MuiTable from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

export default function Table({ columns, rows, primaryKey = "id" }) {
  return (
    <TableContainer component={Paper}>
      <MuiTable aria-label="simple table">
        <TableHead>
          <TableRow>
            {columns.map((col) => (
              <TableCell key={col}>{col}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows &&
            rows.map((row) => (
              <TableRow
                key={row[primaryKey]}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                {columns.map((col) => (
                  <TableCell key={`${row}-${col}`}>{row[col]}</TableCell>
                ))}
              </TableRow>
            ))}
        </TableBody>
      </MuiTable>
    </TableContainer>
  );
}

Table.propTypes = {
  columns: PropTypes.arrayOf(PropTypes.string).isRequired,
  rows: PropTypes.arrayOf(PropTypes.object).isRequired,
  primaryKey: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};
