import TableRow from "./TableRow";

interface Props {
  bodyDaya: {[key: string]: string}[];
}
const TableBody = ({bodyDaya}: Props) => {
  return (
    <tbody>
      {bodyDaya.map(value => {
        return <TableRow rowData={Object.values(value)} />;
      })}
    </tbody>
  );
};

export default TableBody;