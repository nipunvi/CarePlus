import { useNavigate } from "react-router-dom";

interface Props {
  rowData: string[];
}

const TableRow = ({rowData}: Props) => {
    const navigate = useNavigate()

    const handleRowDataClick = (id:string) => {
           navigate(`/patientDetails/${id}`)
    }
  return (
    <tr style={{cursor:"pointer"}} onClick={()=>{handleRowDataClick(rowData[0])}}>
      {rowData.map((value,index) => {
        return index == 0?<th style={{width:`${100/rowData.length}%`}}>{value}</th >:<td style={{width:`${100/rowData.length}%`}}>{value}</td>;
      })}
    </tr>
  );
};

export default TableRow;