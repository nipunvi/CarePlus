import PrescriptionCard from "./PrescriptionCard";
import {useEffect, useState} from "react";
import {baseURL} from "./Global";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../Store/store";
import { setCrntlyEditingPresCripData, setEditingClor } from "../features/PrescripHistorySlice";

interface Props {
  patientId: string | undefined;
}
const PrescripAndHistoryArea = ({patientId}: Props) => {
  const dispatch = useDispatch()
  const [history, setHistory] = useState<{[key: string]: any}[]>([]);
 
  const {newPrescriptionAdded} = useSelector((state:RootState)=>state.prescriptHistorySlice)

  const [prescriptionEdited,setPrescriptionEdited] = useState<boolean>(false)
  const [clickedIndex,setclickedIndex] = useState<any>()
  const [staticPrescription,setStaticPrescription] =  useState<{[key:string]:any}>({})

  // useEffect(()=>{
  //   console.log("hahahahahahahahahahahaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")
  //   console.log(history)
  // },[history])
 
  useEffect(() => {
    fetch(`${baseURL}/patient-treatments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({p_id: patientId}),
    })
      .then(res => {
        if (res.status == 200) {
          return res.json();
        }
      })
      .then(response => {
        console.log()
        let recreatedResponse = [];
        for (let i = 0; i < response.length; i++) {
          let drugsArray = [];
          for (let x = 0; x<response[i]["drugs"].length; x++) {
      
            let drugObj: {[key: string]: string} = {};
            drugObj["Drug"] = response[i]["drugs"][x]["drug_name"];
            drugObj["Comments"] = response[i]["drugs"][x]["note"];
            drugsArray.push(drugObj);
          }
          let myObj = {
            t_id:response[i]['t_id'],
            date: response[i]["created_at"],
            diognosis: response[i]["diagnosis"],
            drugs: drugsArray,
          };
          recreatedResponse.push(myObj);
        }
        //dispatch(setHistory([]));
       console.log(recreatedResponse)
        setHistory(recreatedResponse)
      })
    
  }, [newPrescriptionAdded,prescriptionEdited]);

  const handleEditPrescription = (t_id:number,index:number) => {
    setclickedIndex(index)
    dispatch(setEditingClor(5))
    dispatch(setCrntlyEditingPresCripData(history.filter(value=>value['t_id'] == t_id)[0]))
    setStaticPrescription(history.filter(value=>value['t_id'] == t_id)[0])
  }
  return (
    <div className="col-12 mt-1" style={{height: "81.97vh"}}>
      <div
        className="card card-body p-0"
        style={{
          height: "100%",
          backgroundColor: "rgba(255, 255, 255, 0)",
          border: "0",
        }}
      >
        <div className="row gx-2 p-0" style={{height: "100%"}}>
          <div className="col-6">
            <PrescriptionCard
            setclickedIndex={setclickedIndex}
            
              patientId={patientId}
              
          
              staticPrescription={staticPrescription && staticPrescription}
         
              setPrescriptionEdited={setPrescriptionEdited}
            />
          </div>
          <div
            className="col-6 shadow"
            style={{height: "100%", overflowY: "auto"}}
          >
            {history.length > 0 ? (
              history.map((value,index) => {
                return (
                  <div className="card card-body mb-1 shadow" style={{border:`${index == clickedIndex?5:0}px solid lightgreen`}}>
                    <>
                    <div className="row">
                      <div className="col-10">
                      <p>
                        <b>Date :</b> {value.date}
                      </p>
                      </div>
                      <div className="col-2" style={{justifyContent:"end",textAlign:"end"}}>
                        <button className="btn btn-sm btn-primary" onClick={()=>{handleEditPrescription(value['t_id'],index)}}>Edit</button>
                      </div>
                    </div>
                      
                    </>
                    <>
                      <p>
                        <b>Diagnosis :</b> {value.diognosis}
                      </p>
                    </>
                    <table className="table table-bordered table-striped shadow">
                      <thead className="bg-primary text-white">
                        <tr>
                          <th>Drug Name</th><th>Comments</th>
                        </tr>
                      </thead>
                      <tbody>
                        {value.drugs.length > 0 ? value.drugs.map((val: {[key: string]: string}) => {
                          return (
                            <tr>
                              {" "}
                              {Object.values(val).map(va => (
                                <td>{va}</td>
                              ))}
                            </tr>
                          );
                        }):<></>}
                      </tbody>
                      
                    </table>
                    {value.drugs.length == 0 && (
                        <div
                          className="card card-body p-0"
                          style={{
                            textAlign: "center",
                            justifyContent: "center",
                            border:"0",
                            padding:"10px"
                          }}
                        >
                          No Drugs to show
                        </div>
                      )}
                  </div>
                );
              })
            ) : (
              <div
                className="card card-body mb-0 shadow"
                style={{
                  height: "100%",
                  textAlign: "center",
                  justifyContent: "center",
                  color: "grey",
                }}
              >
                <h1> NO HISTORY TO SHOW</h1>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrescripAndHistoryArea;


