import {ChangeEvent, Dispatch, SetStateAction, useEffect, useState} from "react";
import {Modal} from "react-bootstrap";
import {useNavigate} from "react-router-dom";
import {baseURL} from "./Global";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../Store/store";
import { setCrntDrug, setCrntEditingDrugId, setDrugAdded, setDrugFieldClass, setDrugList, setDrugShow } from "../features/DrugSlice";
import { setcrntEditingDrugClassName, setCrntEditingDrugName, setCurrentEditingDrugStaticName, setDrugListStatic, setDrugNameChanged, setDrugStatusUpdate } from "../features/DrugEditSlice";
import { setAge, setDisplayNameDrop, setDisplayNumberDrop, setName } from "../features/SearchCardSlice";





interface Props {
  setResults: (value: {[key: string]: string}[]) => void;
  setLoad: (value: boolean) => void;
  setDoYouWantToAddBtnVisibility : React.Dispatch<SetStateAction<string>>
  btnClicked:boolean
}

const SearchCard = ({setResults, setLoad,setDoYouWantToAddBtnVisibility,btnClicked}: Props) => {
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const {crntEditingDrugId,drugFieldClass,
         drugList,crntDrug,drugAdded,drugShow} = useSelector((state:RootState)=>state.drugSlice)
  const {name,age,displayNameDrop,displayNumberDrop} =  useSelector((state:RootState)=>state.searchCardSlice)
  const {drugStatusUpdated,drugListStatic,
         currentEditingDrugStaticName,drugNameChanged,
         crntEditingDrugName,crntEditingDrugClassName} = useSelector((state:RootState)=> state.drugEditSlice)
  
  useEffect(()=>{
     dispatch(setName(''))
     dispatch(setAge(''))
    console.log(displayNameDrop,displayNumberDrop);
  },[]);




  const handleNameChange = (event: ChangeEvent<any>) => {
    dispatch(setName(event.target.value))
    if (event.target.value.toString().length > 0) {
      dispatch(setDisplayNameDrop("block"));
    } else {
      dispatch(setDisplayNameDrop("none"));
    }
  };

  // useEffect(() => {
  //   if (allNamesAndNumbers.length > 0) {
  //     setFilteredNamesAndNumbers(
  //       allNamesAndNumbers.filter(
  //         (value: {[key: string]: string}) =>
  //           value["name"].toLowerCase().includes(name.toLowerCase()) &&
  //           value["age"].toLowerCase().startsWith(age.toLowerCase())
  //       )
  //     );
  //   }
  // }, [name, age, allNamesAndNumbers]);
  const handleAgeChange = (event: ChangeEvent<any>) => {
    if (event.target.value.toString().length > 0) {
      dispatch(setDisplayNumberDrop("block"));
    } else {
      dispatch(setDisplayNumberDrop("none"));
    }
    dispatch(setAge(event.target.value));
  };

  const handleSearchResultsgeneration = () => {
    if(name.length > 0 || age.length > 0){
    //setNameAndAge({name:name,age:age})
    dispatch(setDisplayNumberDrop("none"));
    dispatch(setDisplayNameDrop("none"));
    if(name.length > 0){
      setDoYouWantToAddBtnVisibility("block")
    }else{
      setDoYouWantToAddBtnVisibility("none")
    }
    
    setLoad(true);
    
    console.log(age)
    fetch(`${baseURL}/get-patient`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({name: name, age: age}),
    })
      .then(res => {
        if(res.status==200){
          return res.json();
        }
        else if(res.status==404 || res.status==400){
          setResults([]);
        }
        else {
          setResults([]);
          alert(`${res.statusText}`);
        }
        })
      .then(response => {
        console.log(response);
        if (response.length > 0) {
          console.log(response)
          setResults(response);
          //console.log(response.body);
          setLoad(false);
        } else {
          setLoad(false);
        }
      });
    }else{
      setDoYouWantToAddBtnVisibility("none")
    }
   
  };

  const handleClearingEvent = () => {
    setDoYouWantToAddBtnVisibility("none")
    dispatch(setDisplayNameDrop("none"));
    dispatch(setDisplayNumberDrop("none"));
    setResults([]);
    dispatch(setAge(""));
    dispatch(setName(""))
  };

  const handleDrugRegister = () => {
    dispatch(setCrntDrug(""))
    dispatch(setDrugShow(true))
    //setShow(true);
    //fetch drug list from the doc and loads
    fetch(`${baseURL}/get-all-drugs`).then(res=>{
      if(res.status==200){
        return res.json();
      }
    }).then(respose=>{
      let sortedResponse = respose.sort((a:any,b:any)=>a.d_id - b.d_id)
      dispatch(setDrugList(sortedResponse))
      dispatch(setDrugListStatic(sortedResponse));
    })
    
  };
  
  useEffect(()=>{ let element = document.getElementById("drugsearch")
    element?.focus()  },[drugShow])
  const handleClose = () => {
    dispatch(setDrugShow(false))
   // setShow(false);
   dispatch(setDrugFieldClass("form-control"))
   dispatch(setCrntDrug(""))
  };

  useEffect(() => {
    //handleDrugRegister();
    fetch(`${baseURL}/get-all-drugs`).then(res=>{
      if(res.status==200){
        return res.json();
      }
    }).then(respose=>{
      let sortedResponse = respose.sort((a:any,b:any)=>a.d_id - b.d_id)
      console.log(sortedResponse)
     dispatch(setDrugList(sortedResponse));
      dispatch(setDrugListStatic(sortedResponse));
      
    })
  }, [drugAdded]);

  useEffect(()=>{
    fetch(`${baseURL}/get-all-drugs`).then(res=>{
      if(res.status==200){
        return res.json();
      }
    }).then(respose=>{
      let sortedResponse = respose.sort((a:any,b:any)=>a.d_id - b.d_id)
      console.log(sortedResponse)
      dispatch(setDrugList(sortedResponse))
      dispatch(setDrugListStatic(sortedResponse));
     
    })
   
  },[drugStatusUpdated])

  useEffect(()=>{
    dispatch(setDrugList(drugListStatic.filter(value=>value['drug_name'].toLowerCase().startsWith(crntDrug.toLowerCase()))))
  },[drugListStatic])

  const handleAddingADrug = () => {
    let isDrugAvailable = drugList.findIndex(value=>crntDrug?.toLowerCase() === value['drug_name'].toLowerCase())
    if(crntDrug.length > 0 && isDrugAvailable == -1){
    fetch(`${baseURL}/add-drug`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({drug_name: crntDrug}),
    }).then(res => {
      if (res.status == 201) {
        dispatch(setDrugAdded());
        dispatch(setCrntDrug(""))
      }
    }); }else{
      dispatch(setDrugFieldClass("form-control is-invalid"))
    }
    //crntDrug
    //make the post call only if the crntDrug.length > 0
    //fetch
    //setDrugList((prev)=>[...prev,{drugId:"05",drugName:"Nipun"}])
  };

  const handleCrntInputChange = (event: ChangeEvent<any>) => {
    if(event.target.value.length > 0){
      dispatch(setDrugFieldClass("form-control"))
    }
    dispatch(setCrntDrug(event.target.value));
    dispatch(setDrugList(drugListStatic.filter(value=>value['drug_name'].toLowerCase().startsWith(event.target.value.toLowerCase()))))
  };

  // const handleDrugEdit = (drugId: string) => {
  //   let spreadDrugList = [...drugList];
  //   let theIndex = spreadDrugList.findIndex(value => value["drugId"] == drugId);

  //   setEditingIndex(theIndex.toString());
  //   setEditingValue(spreadDrugList[theIndex]["drugName"]);
  //   setEditDrugStaticName(spreadDrugList[theIndex]["drugName"]);
  // };

  // const handleCancelEdit = () => {
  //   setEditingIndex("");
  // };

  // const handleSaveEditedDrug = (drugId: string) => {
  //   //drugId
  //   //editingValue
  //   //make the patch call to updte the database with new dugname
  // };

  // const handleDrugNameChange = (event: ChangeEvent<any>) => {
  //   setEditingValue(event.target.value);
  // };

  // useEffect(() => {
  //   if (editDrugStaticName == editingValue) {
  //     setSaveBtnAnable(true);
  //   } else {
  //     setSaveBtnAnable(false);
  //   }
  // }, [editingValue]);

  const handlePatientSearchClick = () => {
    dispatch(setDisplayNameDrop("none"));
    dispatch(setDisplayNumberDrop("none"));
  };

  /* useEffect(()=>{
    setAllNamesAndNumbers([
      {id: "01", name: "Nipun Eranga", phoneNumber: "0779443896"},
      {id: "02", name: "Nimasha Eranga", phoneNumber: "0789443886"},
      {id: "03", name: "Hiran Munasinghe", phoneNumber: "0769443886"},
      {id: "04", name: "Ashan Eranga", phoneNumber: "0789443887"},
      {id: "05", name: "Binara Kulawardane", phoneNumber: "0749443886"},
      {id: "06", name: "Sewwandi Wathsala", phoneNumber: "0729443886"},
    ]);
  },[])*/

  const handleAgeSearchClick = () => {
    setDisplayNameDrop("none");
    setDisplayNumberDrop("none");
  };

  // const handleNameSelect = (value: string) => {
  //   setDisplayNameDrop("none");
  //   setName(value);
  // };

  // const handleNumberSelect = (value: string) => {
  //   setDisplayNumberDrop("none");
  //   setAge(value);
  // };

  const handlePatientRegistrtion = () => {
    navigate("/Patientregistration");
  };

  const handleDrugStatusChange = (drugId:string, status:number) => {
    console.log(drugId)
    console.log(status)
    fetch(`${baseURL}/update-drugs-status`,{
     method:'POST',
     headers:{
       'Content-Type':'application/json'
     },
     body:JSON.stringify({id:drugId,is_active:status})
    }).then(res=>{
     if(res.status == 200){
       dispatch(setDrugStatusUpdate())
       
       
     }
    })
 }
const  handleDrugnameEdit = async(drugId:any,drugname:any) => {
  dispatch(setCurrentEditingDrugStaticName(drugname))
  dispatch(setCrntEditingDrugName(drugname))
  dispatch(setCrntEditingDrugId(drugId))
  console.log(`drug${drugId}`)

}

useEffect(()=>{
  let drug = document.getElementById(`drug${crntEditingDrugId}`)
  drug?.focus() 
},[crntEditingDrugId])

const handleDrugNameChange = (event:ChangeEvent<any>) => {
  dispatch(setcrntEditingDrugClassName("form-control"))
  dispatch(setCrntEditingDrugName(event.target.value))
  if(currentEditingDrugStaticName !== event.target.value){
    if(event.target.value.length == 0){
      dispatch(setDrugNameChanged(false))
    }else{
    dispatch(setDrugNameChanged(true))
    }
  }else{
    
    dispatch(setDrugNameChanged(false))
  }
}

const handleEditCancel = () => {
 // setcrntEditingDrugClassName("form-control")
 dispatch(setcrntEditingDrugClassName("form-control"))
  dispatch(setDrugNameChanged(false))
}

const vanishSave = () => {
  dispatch(setDrugNameChanged(false))
}

const handleChangeSave = () => {
  let isDrugAvailable = drugList.findIndex(value=>crntEditingDrugName?.toLowerCase() === value['drug_name'].toLowerCase())
  if(isDrugAvailable == -1){

  dispatch(setCrntEditingDrugId(0))
  dispatch(setcrntEditingDrugClassName("form-control"))
  //fetch to save crntEditingDrugId,crntEditingDrugName
//remove the editing row id from that above useState
fetch(`${baseURL}/update-drugs-name`,{
  method:'POST',
  headers:{
    'Content-Type':'application/json'
  },
  body:JSON.stringify({id:crntEditingDrugId,drug_name:crntEditingDrugName})
 }).then(res=>{
  if(res.status == 200){
    dispatch(setDrugStatusUpdate())
  }
 })
}else{
  dispatch(setcrntEditingDrugClassName("form-control is-invalid"))
}
}
  return (
    <div className="col-12">
      <div className="card card-body shadow-only-card ">
        <div className="row" style={{height: "100%"}}>
          <div className="col-6 searchArea">
            <h4>Search Patient : </h4>
            <div className="form-floating">
              <input
                type="text"
                className="form-control"
                id="floatingInputSearchPatient"
                placeholder=""
                value={name}
                onClick={handlePatientSearchClick}
                onChange={handleNameChange}
                onKeyDown={event => {
                  if (event.key == "Enter") {
                    handleSearchResultsgeneration();
                  }
                }}
              />
              <label htmlFor="floatingInputSearchPatient">Full Name :</label>
              {/*<div
                className="card card-body p-0 drop"
                style={{display: `${displayNameDrop}`, maxHeight: "100px"}}
              >
                {filteredNamesAndNumbers.length > 0 ? (
                  filteredNamesAndNumbers.map(value => {
                    return (
                      <div
                        className="drugItem"
                        style={{paddingLeft: "10px", padding: "5px"}}
                        onClick={() => {
                          handleNameSelect(value["name"]);
                        }}
                      >
                        {value["name"]}
                      </div>
                    );
                  })
                ) : (
                  <div style={{paddingLeft: "10px", padding: "20px"}}>
                    <b>No Matching Name</b>
                  </div>
                )}
              </div>*/}
            </div>
            <div className="form-floating">
              <input
                type="text"
                className="form-control"
                id="floatingPhoneAge"
                placeholder=""
                value={age}
                onClick={handleAgeSearchClick}
                onChange={(e)=>{handleAgeChange(e)}}
                onKeyDown={event => {
                  if (event.key == "Enter") {
                    handleSearchResultsgeneration();
                  }
                }}
              />
              <label htmlFor="floatingPhoneAge">Age : </label>
              {/*<div
                className="card card-body p-0 drop"
                style={{display: `${displayNumberDrop}`, maxHeight: "100px"}}
              >
                {filteredNamesAndNumbers.length > 0 ? (
                  filteredNamesAndNumbers.map(value => {
                    return (
                      <div
                        className="drugItem"
                        style={{paddingLeft: "10px", padding: "5px"}}
                        onClick={() => {
                          handleNumberSelect(value["phoneNumber"]);
                        }}
                      >
                        {value["phoneNumber"]}
                      </div>
                    );
                  })
                ) : (
                  <div style={{paddingLeft: "10px", padding: "20px"}}>
                    <b>No Matching Name</b>
                  </div>
                )}
              </div>*/}
            </div>
            <div className="row">
              <div className="col-12">
                <div
                  className="card card-body p-0"
                  style={{
                    border: "0",
                    backgroundColor: "rgba(255, 255, 255, 0)"
                  }}
                >
                  <button
                    className="btn btn-lg btn-success mb-2"
                    onClick={handleSearchResultsgeneration}
                  >
                    Search{" "}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="25"
                      height="25"
                      viewBox="0 1 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      className="feather feather-search"
                    >
                      <circle cx="11" cy="11" r="8" />
                      <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                  </button>
                  <button
                    className="btn btn-lg btn-primary"
                    onClick={handleClearingEvent}
                  >
                    Clear
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="col-6">
            <div className="row" style={{height: "100%"}}>
              <div className="col-6" style={{height: "100%"}}>
                <div
                  className="card card-body homePageCradBtns"
                  style={{height: "100%"}}
                  onClick={handlePatientRegistrtion}
                >
                  <h1 className="mt-4">+</h1>
                  <h4>Patient Registration</h4>
                  <small>click here to register a new patient</small>
                </div>
              </div>
              <div className="col-6" style={{height: "100%"}}>
                <div
                  className="card card-body homePageCradBtns"
                  style={{height: "100%"}}
                  onClick={handleDrugRegister}
                >
                  <h1 className="mt-4">+</h1>
                  <h4>Drug Registration</h4>
                  <small>click here to register a new drug</small>
                </div>
                <Modal show={drugShow} onHide={handleClose} size="lg" style={{ backgroundColor: "rgba(255, 255, 255, 0)"}}>
                  <Modal.Header closeButton>
                    <Modal.Title>Drugs</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <div className="row g-0">
                      <div className="col-12">
                        <div className="row g-0">
                          <div className="col-10">
                            <div className="form-floating mb-3">
                              <input
                                type="email"
                                className={drugFieldClass}
                                id="drugsearch"
                                placeholder="name@example.com"
                                value={crntDrug}
                                onKeyDown={(e)=>e.key == 'Enter'&& handleAddingADrug()}
                                onChange={handleCrntInputChange}
                              />
                              <div id="drugsearch" className="invalid-feedback">
                                Enter a correct drug name
                              </div>
                              <label htmlFor="drugsearch">Drug Name</label>
                            </div>
                          </div>
                          <div className="col-2">
                            <button
                              className="btn btn-success ms-1"
                              style={{height: "79%", width: "100%"}}
                              onClick={handleAddingADrug}
                            >
                              Add
                            </button>
                          </div>
                        </div>
                      </div>
                      <div
                        className="col-12"
                        style={{height: "55vh", overflowY: "auto"}}
                      >
                        <table className="table table-striped table-hover">
                          <thead>
                            <tr>
                              <th style={{width: "20%"}}>Drug Id</th>
                              <th style={{width: "50%"}}>Drug Name</th>
                              <th style={{width: "10%"}}>Status</th>
                              <th style={{width: "20%"}}>*</th>
                            </tr>
                          </thead>
                          <tbody>
                            {drugList.length > 0 &&
                              drugList.map(value => {
                                return (
                                  <tr>
                                    {Object.entries(value).map(val => {
                                      return val[0] == "is_active" ? (
                                        <td>
                                          <div className="form-check form-switch">
                                            <input
                                              className="form-check-input"
                                              type="checkbox"
                                              id="flexSwitchCheckCheckedDisabled"
                                              onClick={()=>{handleDrugStatusChange(value['d_id'],val[1])}}
                                              checked={val[1]==1?true:false}
                                              
                                            />
                                          </div>
                                        </td>
                                      ) : (
                                        val[0] == "drug_name" && crntEditingDrugId == value['d_id']
                                        ?<div className="form-floating">
                                          <input type="text" id={`drug${value['d_id']}`} 
                                           value={crntEditingDrugName} className={crntEditingDrugClassName} 
                                           style={{width:"100%",marginTop:"3px"}} onChange={handleDrugNameChange}/>
                                          <div  className="invalid-feedback">
                                          this drug is already available on the list
                                          </div>
                                        </div>
                                        :<td>{val[1]}</td>
                                      );
                                    })}
                                    <td>
                                      {crntEditingDrugId == value['d_id']?
                                      drugNameChanged ? 
                                      <>
                                      <button className="btn btn-sm btn-success me-1" onClick={()=>{handleChangeSave(),vanishSave()}}>save</button> 
                                      <button className="btn btn-sm btn-secondary" onClick={()=>{dispatch(setCrntEditingDrugId(0)), handleEditCancel()}}>Cancel</button>
                                      </>
                                      :
                                      <button className="btn btn-sm btn-secondary" onClick={()=>{dispatch(setCrntEditingDrugId(0)), handleEditCancel()}}>Cancel</button>
                                      :<button className="btn btn-sm btn-primary" onClick={()=>{handleDrugnameEdit(value['d_id'],value['drug_name'])}}>Edit</button>}
                                      
                      
                                     
                                    </td>
                                  </tr>
                                );
                              })}
                            {/*drugList &&
                              drugList.map((value, index) => {
                                return (
                                  <tr>
                                    {editingIndex == index.toString() ? (
                                      <>
                                        <td>{value["drugId"]}</td>
                                        <td>
                                          <input
                                            type="text"
                                            className="form-control form control-sm"
                                            value={editingValue}
                                            onChange={handleDrugNameChange}
                                          />
                                        </td>
                                        <td>
                                          <div className="btn-group">
                                            <button
                                              className="btn btn-sm btn-success"
                                              onClick={() => {
                                                handleSaveEditedDrug(
                                                  value["drugId"]
                                                );
                                              }}
                                              disabled={saveBtnAnable}
                                            >
                                              <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="20"
                                                height="20"
                                                viewBox="0 1 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                stroke-width="2"
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                className="feather feather-save"
                                              >
                                                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                                                <polyline points="17 21 17 13 7 13 7 21" />
                                                <polyline points="7 3 7 8 15 8" />
                                              </svg>
                                            </button>
                                            <button
                                              className="btn btn-sm btn-danger"
                                              onClick={handleCancelEdit}
                                            >
                                              <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="20"
                                                height="20"
                                                viewBox="0 1 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                stroke-width="2"
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                className="feather feather-x-square"
                                              >
                                                <rect
                                                  x="3"
                                                  y="3"
                                                  width="18"
                                                  height="18"
                                                  rx="2"
                                                  ry="2"
                                                />
                                                <line
                                                  x1="9"
                                                  y1="9"
                                                  x2="15"
                                                  y2="15"
                                                />
                                                <line
                                                  x1="15"
                                                  y1="9"
                                                  x2="9"
                                                  y2="15"
                                                />
                                              </svg>
                                            </button>
                                          </div>
                                        </td>{" "}
                                      </>
                                    ) : (
                                      <>
                                        {" "}
                                        <td>{value["drugId"]}</td>
                                        <td>{value["drugName"]}</td>
                                        <td>
                                          <div className="btn-group">
                                            <button
                                              className="btn btn-sm btn-primary"
                                              onClick={() => {
                                                handleDrugEdit(value["drugId"]);
                                              }}
                                            >
                                              <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="20"
                                                height="20"
                                                viewBox="0 1 24 24"
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
                                          </div>
                                        </td>
                                      </>
                                    )}
                                  </tr>
                                );
                              })*/}
                          </tbody>
                        </table>
                        {drugList.length == 0 && (
                          <div
                            className="card card-body"
                            style={{
                              padding: "20px",
                              textAlign: "center",
                              justifyContent: "center",
                              border:"0",
                            }}
                          >
                            NO SUCH DRUG
                          </div>
                        )}
                      </div>
                    </div>
                  </Modal.Body>
                  <Modal.Footer></Modal.Footer>
                </Modal>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchCard;