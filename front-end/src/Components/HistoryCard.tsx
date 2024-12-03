import { useEffect, useState } from "react";



const HistoryCard = () => {

  const [history, setHistory] = useState<{ [key: string]: any }[]>([])

  useEffect(() => {
    setHistory([])
  }, [])
  return (<div className="card card-body" style={{height:"81.97vh",overflowY:"auto"}}>
    {history.length > 0 && history.map((value)=>{
      console.log(value);
      return (<div className="card card-body mb-2" style={{height:"200px"}}></div>)
    })}
  </div>)
};

export default HistoryCard;