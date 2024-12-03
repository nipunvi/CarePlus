import {ChangeEvent, useEffect, useState} from "react";
import {Modal} from "react-bootstrap";
import {baseURL} from "./Global";
import medilogo from '../assets/carepluslogo.png'
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../Store/store";
import {setDrugAdded, setshowNav} from "../features/DrugSlice"
import { setCrntlyEditingPresCripDataToUndefined,setCrntlyEditingPresCripData, setEditingClor, setNewPrescriptionAdded } from "../features/PrescripHistorySlice";
import { setDrugStatusUpdate } from "../features/DrugEditSlice";
import drugsLogo from "../assets/drugs.png"


interface Props {
  patientId: string | undefined;
  setclickedIndex:React.Dispatch<React.SetStateAction<any>>;
  staticPrescription:{[key:string]:any}
  setPrescriptionEdited:React.Dispatch<React.SetStateAction<boolean>>;
}
const PrescriptionCard = ({patientId,setclickedIndex,staticPrescription,setPrescriptionEdited}: Props) => {
  const dispatch = useDispatch()
  const [disabledDrugStatus,setdisabledDrugStatus] = useState<boolean>(false)
  const [show, setShow] = useState<boolean>(false);
  const [displayArray, setDisplayArray] = useState<string[]>([
    "none",
    "none",
    "none",
  ]);
  const [diagnosisClass,setDiagnosisClass] = useState<string>("form-control")
  const [drugInputValidity, setDrugInputValidity] = useState<string[]>([
    "form-control",
    "form-control",
    "form-control",
  ]);

  const [drugAddedHere,setDrugAddedHere] = useState<boolean>(false)
  const [drugName, setDrugName] = useState<string>("");

  const [allDrugList,setAllDrugList] = useState<{[key:string]:any}[]>([])
  const [drugList,setDrugList] = useState<{[key:string]:any}[]>([])
  const {editingClor,crntlyEditingPresCripData} = useSelector((state:RootState)=>state.prescriptHistorySlice)
  const {drugStatusUpdated} = useSelector((state:RootState)=>state.drugEditSlice)
  const {drugAdded} = useSelector((state:RootState)=>state.drugSlice)
  const [filteredDrugList, setFilteredDrugList] = useState<{[key: string]: string}[]>([]);
  const [date, setDate] = useState<string>("");
  const [filteredDrugListByStatus,setFilteredDrugListByStatus] = useState<{[key: string]: string}[]>([])
  const [drugArray, setDrugArray] = useState<{[key: string]: string}[]>([
    {Drug: "", Comments: ""},
    {Drug: "", Comments: ""},
    {Drug: "", Comments: ""},
  ]);
  const [diagnosis, setDiagnosis] = useState<string>("");
useEffect(()=>{
  console.log(filteredDrugListByStatus)
},[filteredDrugListByStatus])
  useEffect(()=>{
  
    if(crntlyEditingPresCripData['t_id'] !== undefined){
      setDate(crntlyEditingPresCripData['date'].toString().substring(0,10))
      setDiagnosis(crntlyEditingPresCripData['diognosis'])
      crntlyEditingPresCripData['drugs'].forEach((value:{[key:string]:string},index:number)=>{
        if(index > 2){
          setDrugArray(prev=>[...prev,{Drug:value['Drug'],Comments:value['Comments']}])
          setDrugInputValidity(prev=>[...prev,"form-control"])
          setDisplayArray(prev=>[...prev,"none"])
        }else{
          setDrugArray([{Drug:crntlyEditingPresCripData['drugs'][0] ? crntlyEditingPresCripData['drugs'][0]['Drug']:"",
              Comments:crntlyEditingPresCripData['drugs'][0] ? crntlyEditingPresCripData['drugs'][0]['Comments']:""},
            {Drug: crntlyEditingPresCripData['drugs'][1] ? crntlyEditingPresCripData['drugs'][1]['Drug']:"",
              Comments:crntlyEditingPresCripData['drugs'][1] ? crntlyEditingPresCripData['drugs'][1]['Comments']:""},
            {Drug:crntlyEditingPresCripData['drugs'][2] ? crntlyEditingPresCripData['drugs'][2]['Drug']:"",
              Comments:crntlyEditingPresCripData['drugs'][2] ? crntlyEditingPresCripData['drugs'][2]['Comments']:""}])
          setDrugInputValidity(["form-control","form-control","form-control"])
          setDisplayArray(["none","none","none"])
        }
       
      })
      
    }else{
      setDiagnosis("")
      setDrugArray([{Drug: "", Comments: ""},
    {Drug: "", Comments: ""},
    {Drug: "", Comments: ""},])
    }
  },[crntlyEditingPresCripData])

  useEffect(()=>{
    dispatch(setEditingClor(0))
    dispatch(setCrntlyEditingPresCripDataToUndefined())
  },[])

  useEffect(()=>{
    let mydate = new Date();
    let today = `${mydate.getFullYear()}-${(mydate.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${mydate.getDate().toString().padStart(2, "0")}`;
  

    setDate(today);
  },[])

  useEffect(() => {
   
    fetch(`${baseURL}/get-all-drugs`).then(res=>{
      if(res.status == 200){
        return res.json()
      }
    }).then(response=>{
      let recreatedDrugList = []
      for(let i =0; i < response.length;i++){
          let myObj:{[key:string]:string}= {}
          myObj['id'] = response[i]['d_id']
          myObj['drugName'] = response[i]['drug_name']
          myObj['isActive'] = response[i]['is_active']
          recreatedDrugList.push(myObj)
      }
      
     setAllDrugList(recreatedDrugList)
     setDrugList(recreatedDrugList.filter((value)=>value['isActive'] == "1"))
    })
  }, [drugAddedHere,drugStatusUpdated,drugAdded]);

  const handleDateChange = (event: ChangeEvent<any>) => {
  
    setDate(event.target.value);
  };

  const handleDrugChange = (event: ChangeEvent<any>, changeIndex: number) => {
    console.log(drugList[0])
    if(event.target.value.length > 0 ){
      setDisplayArray(prev => {
        const newArr = [...prev];
        newArr[changeIndex] = "block";
        return newArr;
      });
    }
    setDrugArray(prev => {
      const newArr = [...prev];
      newArr[changeIndex] = {...newArr[changeIndex], Drug: event.target.value};
      return newArr;
    });
    //filter and set the filtered array
   

    setFilteredDrugList(
      drugList.filter(value =>
        value.drugName
          .toLowerCase()
          .startsWith(event.target.value.toString().toLowerCase()) && Number(value.isActive) !== 0
      )
    );
console.log(event.target.value)
console.log(drugList)
    setFilteredDrugListByStatus(allDrugList.filter(value=> value.drugName
      .toLowerCase() == event.target.value.toString().toLowerCase() && Number(value.isActive) == 0))
  };
  const handleCommentChange = (
    event: ChangeEvent<any>,
    changeIndex: number
  ) => {
    setDrugArray(prev => {
      const newArr = [...prev];
      newArr[changeIndex] = {
        ...newArr[changeIndex],
        Comments: event.target.value,
      };
      return newArr;
    });
  };

  const handleAddDrugsField = () => {
    setDrugArray(prev => {
      const drugObj = {Drug: "", Comments: ""};
      return [...prev, drugObj];
    });
    //heee
    setDrugInputValidity(prev => [...prev, "form-control"]);
    setDisplayArray(prev => [...prev, "none"]);
  };

  const handleSavePrescription = () => {
     console.log(drugList[0])
    let drugArr = [...drugArray];
    let emptyArr: {[key: string]: string}[] = [];

    drugArr.forEach(value => {
      const comment = value["Comments"];
      let objToPush: {[key: string]: string} = {};
      let DList = [...drugList];
      let matchingElement = DList.find(val => {
        return val["drugName"] == value["Drug"];
      });
      let MatchingId = "";
      if (matchingElement) {
        MatchingId = matchingElement["id"];
      } else {
        if (value["Drug"] == "") {
          MatchingId = "";
        } else {
          MatchingId = "False";
        }
      }
      objToPush["id"] = MatchingId.toString();
      objToPush["Comments"] = comment;

      emptyArr.push(objToPush);
    });

    let newArr = [...drugInputValidity];
    emptyArr.forEach((value, index) => {
      if (value["id"] == "False") {
        newArr[index] = "form-control is-invalid";
      } else if (value["id"] == "") {
        newArr[index] = "form-control";
      } else {
        newArr[index] = "form-control";
      }
    });
    setDrugInputValidity(newArr);
    let formControlCounter = 0;
    newArr.forEach(value => {
      if (value == "form-control") {
        formControlCounter += 1;
      }
    });
    let timeNow = new Date()
    let hours = timeNow.getHours() % 12 || 12; // Convert to 12-hour format, handling 0 as 12
    let AMPM = timeNow.getHours() >= 12 ? 'PM' : 'AM';
    let timeString = `${hours.toString().padStart(2,'0')}:${timeNow.getMinutes().toString().padStart(2,'0')}:${timeNow.getSeconds().toString().padStart(2,'0')} ${AMPM}`
    const prescription = {
      patientId: patientId,
      date: `${date} / ${timeString}`,
      diagnosis: diagnosis,
      drugs: emptyArr,
    };
   
   
    if(crntlyEditingPresCripData['t_id'] == undefined){
    if (formControlCounter == newArr.length && diagnosis.length > 0) {
      setDiagnosisClass("form-control")
      fetch(`${baseURL}/add-treatment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(prescription),
      })
        .then(res => {
          if (res.status == 201) {
            setclickedIndex(-1)
            dispatch(setEditingClor(0))
            dispatch(setNewPrescriptionAdded());
            setDrugArray([    
              {Drug: "", Comments: ""},
              {Drug: "", Comments: ""},
              {Drug: "", Comments: ""},
            ])
            setDiagnosis("");
            let mydate = new Date();
            let today = `${mydate.getFullYear()}-${(mydate.getMonth() + 1)
            .toString()
            .padStart(2, "0")}-${mydate.getDate().toString().padStart(2, "0")}`;
            
             setDate(today)
             
           }
        })
        
    
    }else{
      if(diagnosis.length==0){
        setDiagnosisClass("form-control is-invalid")
      }
        
    }
  }else{
    //fetch update
    
    let updatePrescription = {
      patientId: patientId,
      t_id:crntlyEditingPresCripData['t_id'],
      date: date,
      diagnosis: diagnosis,
      drugs: emptyArr,
    }
    let drugCounter = 0
    drugArr.forEach((value)=>{
      if(value['Drug'].length > 0){
        drugCounter += 1
      }
    })
    let updated = false
    if(updatePrescription['diagnosis'] !== staticPrescription['diognosis']){
      updated = true
    }else if(drugCounter !== staticPrescription['drugs'].length){
        
        updated = true
      }else{
          for(let i =0;i<drugCounter;i++){
            
            if(drugArr[i]['Drug'] !== staticPrescription['drugs'][i]['Drug'] || drugArr[i]['Comments'] !== staticPrescription['drugs'][i]['Comments'] ){
            
              updated = true
              break
            }else{
              updated = false
            }
          }

        
        
      }

if(updated){
  if (formControlCounter == newArr.length && diagnosis.length > 0) {

  fetch(`${baseURL}/update-treatment`,{
    method:'POST',
    headers:{
      "Content-Type": "application/json",
    },
    body:JSON.stringify(updatePrescription)
  }).then(res=>{
    if(res.status == 201){
      dispatch(setCrntlyEditingPresCripDataToUndefined())
      setclickedIndex(-1)
          dispatch(setEditingClor(0))
          dispatch(setNewPrescriptionAdded());
          setDrugArray([    
            {Drug: "", Comments: ""},
            {Drug: "", Comments: ""},
            {Drug: "", Comments: ""},
          ])
          setDiagnosis("");
          let mydate = new Date();
          let today = `${mydate.getFullYear()}-${(mydate.getMonth() + 1)
          .toString()
          .padStart(2, "0")}-${mydate.getDate().toString().padStart(2, "0")}`;
       
           setDate(today)
           dispatch(setCrntlyEditingPresCripDataToUndefined())
          setPrescriptionEdited(prev=>!prev)
    }
  })
}else{
  if(diagnosis.length==0){
    setDiagnosisClass("form-control is-invalid")
  }
}
}
    
  }

  };

  const handleDrugOnfocus = (index: number, event: ChangeEvent<any>) => {
    if (event.target.value.toString().length > 0) {
      setDisplayArray(prev => {
        const newArr = [...prev];
        newArr[index] = "block";
        return newArr;
      });
    } else {
      setDisplayArray(prev => {
        const newArr = [...prev];
        newArr[index] = "none";
        return newArr;
      });
    }
  };

  const handleDrugClick = (val: {[key: string]: string}, index: number) => {
    setDrugArray(prev => {
      const newArr = [...prev];
      newArr[index] = {...newArr[index], Drug: val["drugName"]};
      return newArr;
    });

    setDisplayArray(prev => {
      const newArr = [...prev];
      newArr[index] = "none";
      return newArr;
    });
  };

  const alldropdownsMinimize = () => {
    setDisplayArray(prev => {
      const newArr = Array(prev.length).fill("none");
      return newArr;
    });
  };

  const handleDiagnosisChange = (event: ChangeEvent<any>) => {
    setDiagnosis(event.target.value);
    if(event.target.value.length > 0){
      setDiagnosisClass("form-control")
    }
  };

  const handleOnclickDrug = (crntValue: string) => {
    setShow(true);
    setDrugName(crntValue);
  };

  const handleClose = () => {
    setShow(false);
  };

  const saveTheDrugToTheDatabase = () => {
    let destructuredzFormControls = [...drugInputValidity]
    let theIndex = destructuredzFormControls.findIndex(value => value == "form-control is-invalid")
    if(theIndex !== -1){
      destructuredzFormControls[theIndex] = "form-control"
      setDrugInputValidity(destructuredzFormControls)
    }
    setDisplayArray(prev => {
      const newArr = Array(prev.length).fill("none");
   
      return newArr;
    });

    fetch(`${baseURL}/add-drug`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({drug_name: drugName}),
    }).then(res => {
      if (res.status == 201) {
        dispatch(setDrugAdded())
       setDrugAddedHere(prev=>!prev)
      }
    });
  };

  const yearGenerator = () => {
    const date = new Date()
    return date.getFullYear()
  }
  const handleClearingAll = () => {
    setDiagnosisClass("form-control")
    setDrugInputValidity([
    "form-control",
    "form-control",
    "form-control",
  ])
    dispatch(setCrntlyEditingPresCripDataToUndefined())
    setclickedIndex(-1)
    dispatch(setEditingClor(0))
    let mydate = new Date();
    let today = `${mydate.getFullYear()}-${(mydate.getMonth() + 1)
            .toString()
            .padStart(2, "0")}-${mydate.getDate().toString().padStart(2, "0")}`;
 
    setDate(today)
    setDisplayArray(['none','none','none'])
    setDiagnosis("")
    setDrugArray([{Drug: "", Comments: ""},
      {Drug: "", Comments: ""},
      {Drug: "", Comments: ""}])
    
  }

  const hndleDisabledDrugEnabling = (id:any) => {
       fetch(`${baseURL}/update-drugs-status`,{
     method:'POST',
     headers:{
       'Content-Type':'application/json'
     },
     body:JSON.stringify({id:id,is_active:0})
    }).then(res=>{
     if(res.status == 200){
      setdisabledDrugStatus(true)
      setTimeout(()=>{
       
        dispatch(setDrugStatusUpdate())
       setDisplayArray(prev => {
      const newArr = Array(prev.length).fill("none");
   
      return newArr;
    })
       setdisabledDrugStatus(false)
      },200)
       
  };
     })
  }
  const handleDrugListPopupLaunch = () => {
    dispatch(setshowNav(true))
  }

  const handleDiagnosisInputClick = () => {
    setDisplayArray(prev => {
      const newArr = Array(prev.length).fill("none");
      return newArr;
    })
  }
  return (
    <>
      <div
        className="card card-body shadow"
        style={{height: "81.97vh", overflowY: "auto",border:`${editingClor}px solid lightgreen`}}
      >
        <div className="row">
          <div className="col-8">
              <h4 className="mb-4">{editingClor > 0 ?`Prescription Editing...`:"Prescription Form"} </h4>
          </div>
          <div className="col-4" style={{justifyContent:"end",textAlign:"end"}}>
              <button className="btn btn-sm btn-warning ms-auto" onClick={handleDrugListPopupLaunch}><img src={drugsLogo} className="navbarlogo"/><b> Drugs</b></button>
          </div>  
        </div>
     

        <div className="form-floating mb-2">
          <input
            type="date"
            className="form-control"
            id="floatingInput"
            placeholder="name@example.com"
            onChange={handleDateChange}
            value={date}
            disabled={editingClor > 0?true:false}
          />
          <label htmlFor="floatingInput">Date :</label>
        </div>
        <div className="form-floating mb-2">
          <textarea
            className={diagnosisClass}
            placeholder="Leave a comment here"
            id="floatingTextarea"
            value={diagnosis}
            onClick={handleDiagnosisInputClick}
            onChange={handleDiagnosisChange}
          ></textarea>
          <div id="floatingTextarea" className="invalid-feedback">
             Please Enter a Diagnosis
          </div>
          <label htmlFor="floatingTextarea">Diagnosis :</label>
        </div>
        {drugArray.map((value, index) => {
          return (
            <div className="row g-0 p-0">
              <div className="col-6">
                <div className="form-floating mb-2 me-1">
                  <input
                    type="text"
                    className={drugInputValidity[index]}
                    id="floatingInput2"
                    placeholder="name@example.com"
                    value={drugArray[index]["Drug"]}
                    onClick={(event)=>{alldropdownsMinimize(); handleDrugChange(event, index);}}
                    onChange={event => {
                      handleDrugChange(event, index);
                      handleDrugOnfocus(index, event);
                    }}
                  />
                  <div id="floatingInput2" className="invalid-feedback">
                    Invalid Drug Name
                  </div>
                  <label htmlFor="floatingInput2">
                    {Object.keys(value)[0]} :{" "}
                  </label>
                  <div
                    className="card card-body p-0 drop"
                    style={{display: `${displayArray[index]}`}}
                  >
                  {filteredDrugList.length == 0 || -1 !== filteredDrugList.findIndex(value=>value['drugName'] == drugArray[index]["Drug"])  ?<></>:<div><u
                      className="ms-2 mb-1"
                        style={{color: "blue", cursor: "pointer"}}
                        onClick={() => {
                          handleOnclickDrug(drugArray[index]["Drug"]);
                        }}
                      >
                        Add drug
                    </u></div>}
                    {filteredDrugList.length > 0 ? (
                      filteredDrugList.map(val => {
                        return (
                          <div
                            className="drugItem pb-1"
                            onClick={() => {
                              handleDrugClick(val, index);
                            }}
                          >
                            {val["drugName"]}
                          </div>
                        );

                      })
                    ) : filteredDrugListByStatus.length > 0 ?(filteredDrugListByStatus.map(values=>{
                      return( <div
                        className="drugItem"
                      ><div className="row p-0 g-0">
                            <div className="col-9">
                            <span style={{color:"red"}}>"{values["drugName"] }" Disabled</span>
                            </div>
                            <div className="col-3 ps-2">
                              {<div className="form-check form-switch">
                                            <input
                                              className="form-check-input"
                                              type="checkbox"
                                              id="flexSwitchCheckCheckedDisabled"
                                              onClick={()=>{hndleDisabledDrugEnabling(values['id'])}}
                                              checked={disabledDrugStatus}
                                              
                                            />
                                          </div>}
                            </div>
                          </div>
                       
                      </div>)
                    })): (
                      <div className="p-2" style={{textAlign: "center"}}>
                        No Matches Found{" "}
                        <u
                          style={{color: "blue", cursor: "pointer"}}
                          onClick={() => {
                            handleOnclickDrug(drugArray[index]["Drug"]);
                          }}
                        >
                          Add drug
                        </u>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="col-6">
                <div className="form-floating mb-2 ms-1">
                  <input
                    type="text"
                    className="form-control"
                    id="floatingInput3"
                    placeholder="name@example.com"
                    value={drugArray[index]["Comments"]}
                    onChange={event => {
                      handleCommentChange(event, index);
                    }}
                    onClick={alldropdownsMinimize}
                  />
                  <label htmlFor="floatingInput3">
                    {Object.keys(value)[1]} :
                  </label>
                </div>
              </div>
            </div>
          );
        })}
<div className="row g-2 p-0">
<div style={{justifyContent:"end",textAlign:"end"}} className="col-12">
            {" "}
            <button
              className="btn btn-outline-primary"
            
              onClick={() => {
                handleAddDrugsField();
                alldropdownsMinimize();
              }}
            >
             <b>
             + Drug field
              </b> 
            </button>
          </div>
          <div className="col-6">
          
            <button
              className={`btn btn-lg btn-${editingClor > 0?'warning':'secondary'}`}
              style={{width:"100%"}}
              onClick={handleClearingAll}
            >
             {editingClor > 0 ?"Cancel Editing":"Clear Prescription"}
            </button>
          </div>
          <div className="col-6">
            <button
              className="btn btn-lg btn-success"
              style={{width:"100%"}}
              onClick={() => {
                handleSavePrescription();
                alldropdownsMinimize();
              }}
            >
              {editingClor > 0 ?"Update Prescription":"Save the Prescription"}
              
            </button>
          </div>
          </div>
        <div className="mt-auto card-footer"
        style={{
          backgroundColor:"rgba(255, 255, 255, 0)",
          height:"30px",
          textAlign:"center",
          color:"grey",
          
        }}>
          <small className="footer" style={{textAlign:"center",justifyContent:"center",}}>
          
          &copy; {yearGenerator()} NEX7 IT Services & Consulting | 
          <span>
          <img className="ms-1"
            src={medilogo}  
            
          /> {' '} v1.0 
          </span>
        </small>
        </div>
      </div>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add The Drug</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="form-floating mb-3">
            <input
              type="text"
              className="form-control"
              id="floatingInput"
              placeholder="name@example.com"
              value={drugName}
            />
            <label htmlFor="floatingInput">Drug Name</label>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button
            className="btn btn-success"
            onClick={() => {
              handleClose();
              saveTheDrugToTheDatabase();
            }}
          >
            Add
          </button>
          <button className="btn btn-danger" onClick={handleClose}>
            Close
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default PrescriptionCard;