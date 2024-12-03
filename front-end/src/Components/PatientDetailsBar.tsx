import {ChangeEvent, useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import { useDispatch } from "react-redux";
import {baseURL} from "./Global";
import {setHistory } from "../features/PrescripHistorySlice";
interface Props {
  patientDetails: {[key: string]: string};
  setProfileEditsSaved: React.Dispatch<React.SetStateAction<boolean>>;
}
const PatientDetailsBar = ({patientDetails, setProfileEditsSaved}: Props) => {
  const [detailsEditing, setDetailsEditing] = useState<boolean>(true);
  const [patientDetail, setPatientDetails] = useState<{[key: string]: any}>();
  const [staticPatientDetail, setStaticPatientDetails] = useState<{
    [key: string]: any;
  }>();
  const dispatch = useDispatch()
  const [saveDisable, setSaveDisable] = useState<boolean>(true);
  const [inputTypes, setInputTypes] = useState<{[key: string]: string}>();
  
  useEffect(() => {
    setInputTypes({
      "Full Name": "text",
      Age: "text",
      Gender: "text",
      "Telephone Number": "number",
  });
  }, []);

  useEffect(() => {
    setPatientDetails(patientDetails); 
  }, [patientDetails, detailsEditing]);

  useEffect(() => {
  
  }, [patientDetail]);

  const navigate = useNavigate();
  const handleGoingBackHome = () => {
    dispatch(setHistory([]));
    navigate(-1);
  };

  const handlePationDetailsEdit = () => {
    setStaticPatientDetails(patientDetail);
    setDetailsEditing(false);
  };

  const handleChangeDetail = (key: string, event: ChangeEvent<any>) => {
    setPatientDetails(prev => {
      return {...prev, [key]: event.target.value};
    });
  };

  useEffect(() => {
    let staticObj = {...staticPatientDetail};
    let editingPationDetails = {...patientDetail};

    for (const key in staticObj) {
     
      if (staticObj[key] == editingPationDetails[key]) {
        setSaveDisable(true);
      } else {
        setSaveDisable(false);
        break;
      }
    }
    if(editingPationDetails['Age']!==undefined){
    

      if(editingPationDetails['Age'] < 1 && !detailsEditing){
        setSaveDisable(true);
      }else{
        setSaveDisable(false);
      }
    }
    
    if(editingPationDetails['Full Name']!==undefined){

      if(editingPationDetails['Full Name'].length > 0 && !detailsEditing){
        setSaveDisable(false);
      }else{
        setSaveDisable(true);
      }
    }

  }, [patientDetail]);

  const handleSaveChanges = () => {
    //make a post API call to back end using patientDetail
    //updated data update tp setPatientDetails so it will refresh the page
    fetch(`${baseURL}/update-patient`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(patientDetail),
    }).then(res => {
      if (res.status == 200) {
        setProfileEditsSaved(prev => !prev);
        setDetailsEditing(true);
        setStaticPatientDetails(patientDetail);
      }
    });
  };

  const handleCancelEditing = () => {
    setDetailsEditing(true);
    setPatientDetails(staticPatientDetail);
  };

 
  return (
    <div className="col-12" style={{height: "15vh"}}>
      <div
        className="card card-body shadow"
        style={{
          overflowY: "auto",
        }}
      >
        <div className="row" style={{height: "100%"}}>
          <div className="col-1">
            <button
              className="btn btn-lg btn-warning"
              onClick={handleGoingBackHome}
              style={{width: "70%", height: "100%"}}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 1 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                className="feather feather-arrow-left"
              >
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
            </button>
          </div>
          <div
            className="col-11"
            style={{display: "flex", justifyContent: "space-around"}}
          >
            {patientDetail &&
              Object.entries(patientDetail).map((value, index) => {
                return (
                  <div className="card card-body p-2 me-2 patientDetails">
                    {detailsEditing ? (
                      <>
                        {" "}
                        <small>{value[0]}</small>
                        <b>{value[1]}</b>
                      </>
                    ) : (
                      <>
                        {index == 0 ?(
                          <>
                            <small>{value[0]}</small>
                            <b>{value[1]}</b>
                          </>
                        ) : (
                          <>
                            <small>{value[0]}</small>{" "}

                            {value[0] == "Gender" ?
                            <select name="" id="" value={value[1]} onChange={event=>{
                              handleChangeDetail(value[0], event);
                            }}>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                            </select>:inputTypes && <input
                              id={value[0]}
                              className="pdInputs"
                              min={0}
                              type={inputTypes[value[0]]}
                              value={inputTypes[value[0]] == "number"? Number(value[1]):value[1]}
                              onChange={event => {
                                handleChangeDetail(value[0], event);
                              }}
                            />}
                          </>
                        )}
                      </>
                    )}
                  </div>
                );
              })}

            {detailsEditing ? (
              <button
                className="btn btn-lg btn-primary"
                style={{
                  maxWidth: "60px",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onClick={handlePationDetailsEdit}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 2 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  className="feather feather-edit"
                >
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
              </button>
            ) : (
              <div className="row g-0 p-0" style={{maxWidth: "60px"}}>
                <div className="col-12">
                  <button
                    className="btn btn-sm btn-success"
                    style={{width: "100%"}}
                    disabled={saveDisable}
                    onClick={handleSaveChanges}
                  >
                    Save
                  </button>
                </div>
                <div className="col-12">
                  <button
                    className="btn btn-sm btn-danger"
                    style={{width: "100%"}}
                    onClick={handleCancelEditing}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDetailsBar;


