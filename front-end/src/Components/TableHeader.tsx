const TableHeader = () => {
  const headers = ["Id","Full Name","Age","Gender","Telephone Number"]
 return (
   <thead >
     <tr>
       {headers.map((value: string) => {
         return <th style={{width:`${100/headers.length}%`}}>{value}</th>;
       })}
     </tr>
   </thead>
 );
};

export default TableHeader;