import {ChangeEvent, ReactNode, useEffect, useState} from "react";
import userLogo from "../assets/user.png"
import searchLogo from "../assets/search.png"
import registerLogo from '../assets/Register.png'
import prescripLogo from '../assets/doctor.png'
import backLogo from '../assets/Back.png'
import drugsLogo from "../assets/drugs.png"
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setCrntDrug, setCrntEditingDrugId, setDrugAdded, setDrugFieldClass, setDrugList, setDrugShow, setshowNav } from "../features/DrugSlice";
import { Modal } from "react-bootstrap";
import { RootState } from "../Store/store";
import {baseURL} from "./Global";
import { setcrntEditingDrugClassName, setCrntEditingDrugName, setCurrentEditingDrugStaticName, setDrugListStatic, setDrugNameChanged, setDrugStatusUpdate } from "../features/DrugEditSlice";

interface Props {
  children: ReactNode;
}
const PageLayout = ({children}: Props) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  //const [showNav,setshowNav] = useState<boolean>(false)
  const {crntEditingDrugId,drugFieldClass,
    drugList,crntDrug,drugAdded,showNav} = useSelector((state:RootState)=>state.drugSlice)
  const show = useSelector((state:RootState)=>state.drugSlice.drugShow)
  const {drugStatusUpdated,drugListStatic,
    currentEditingDrugStaticName,drugNameChanged,
    crntEditingDrugName,crntEditingDrugClassName} = useSelector((state:RootState)=> state.drugEditSlice)
  const handleUserClick = () => {
    navigate('/user')
  }

  const handleSearchClick = () => {
    navigate('/Home')
  }

  const handlePatientClick = () => {
    navigate('/Patientregistration')
  }

  const handleDrugOpne = () => {
    //dispatch(setshowNav(true))
    navigate("/drugStore")
  }
  useEffect(()=>{
    console.log(drugList)
  },[])
  const handleClose = () => {
    dispatch(setshowNav(false))
    dispatch(setDrugFieldClass("form-control"))
    dispatch(setCrntDrug(""))
    dispatch(setDrugList(drugListStatic))
   // setShow(false);
  };
  useEffect(() => {
    //handleDrugRegister();
    fetch(`${baseURL}/get-all-drugs`).then(res=>{
      if(res.status==200){
        return res.json();
      }
    }).then(respose=>{
      let sortedResponse = respose.sort((a:any,b:any)=>a.d_id - b.d_id)
  
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

  const handleDrugStatusChange = (drugId:string, status:number) => {
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
const vanishSave = () => {
  dispatch(setDrugNameChanged(false))
}

const handleEditCancel = () => {
  // setcrntEditingDrugClassName("form-control")
  dispatch(setcrntEditingDrugClassName("form-control"))
   dispatch(setDrugNameChanged(false))
 }

 const  handleDrugnameEdit = async(drugId:any,drugname:any) => {
  dispatch(setCurrentEditingDrugStaticName(drugname))
  dispatch(setCrntEditingDrugName(drugname))
  dispatch(setCrntEditingDrugId(drugId))

}

  return (
    <div className="d-flex">
        <div className="small-col d-flex flex-column">
           <div className="item mt-4 " style={{textAlign:"center",justifyContent:"center",cursor:"pointer"}} onClick={handleUserClick}>  <img src={userLogo} className="navbarlogo" /><div style={{fontSize:"10px"}}>User</div></div>
           <div className="item mt-3" style={{textAlign:"center",justifyContent:"center",cursor:"pointer"}} onClick={handleSearchClick}><img src={searchLogo} className="navbarlogo"/><div style={{fontSize:"10px"}}>Search</div></div>
           <div className="item mt-3" style={{textAlign:"center",justifyContent:"center",cursor:"pointer"}} onClick={handlePatientClick}><img src={registerLogo} className="navbarlogo"/><div style={{fontSize:"10px"}}>Patients</div></div>
           {/* <div className="item mt-3" style={{textAlign:"center",justifyContent:"center",cursor:"pointer"}} ><img src={prescripLogo} className="navbarlogo"/><div style={{fontSize:"10px"}}>Treat</div></div> */}
            {/* <div className="item mt-3" style={{textAlign:"center",justifyContent:"center",cursor:"pointer"}} onClick={handleDrugOpne}><img src={drugsLogo} className="navbarlogo"/><div style={{fontSize:"10px"}}>Drugs</div></div>  */}
        </div> 
        <div className="flex-grow-1">
        <div className="container-fluid card card-body pageLayout">{children}</div>
        </div>
        <Modal show={showNav} onHide={handleClose} size="lg" style={{ backgroundColor: "rgba(255, 255, 255, 0)"}}>
                  <Modal.Header closeButton>
                    <Modal.Title> <img src={backLogo} alt="" onClick={handleClose} style={{width:"20px",height:"20px",marginRight:"30px",cursor:"pointer"}} /> Drugs</Modal.Title>
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
    
  );
};

export default PageLayout;