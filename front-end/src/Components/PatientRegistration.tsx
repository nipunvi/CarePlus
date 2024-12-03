import {ChangeEvent, SetStateAction, useEffect, useState} from "react";
import PageLayout from "./PageLayout";
import {baseURL} from "./Global";
import {useNavigate} from "react-router-dom";
import medilogo from '../assets/carepluslogo.png'
import * as XLSX from 'xlsx';
import { Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../Store/store";
import { setPatientThatNeedToBeAddedToNormal } from "../features/SearchCardSlice";


const PatientRegistration = () => {
  const dispatch = useDispatch()
  const {patientThatNeedsToBeAdded} = useSelector((state:RootState)=>state.searchCardSlice)
  const [patientRegisterHeaders, setPatientRegisterHeader] = useState<string[]>(
    []
  );
  const [viewDisplay,setViewDisplay] = useState<string>('none')
  const [recordsCount,setRecordsCount] = useState<number>()
  const [excelEditShow,setexcelEditShow] = useState<boolean>(false)
  const [dataReading,setDataReading] = useState<boolean>(false)
  const [uploading,setUploading] = useState<boolean>(false)
  const [excelData,setexcelData] = useState<any>()
  const [excelData2,setexcelData2] = useState<any>()
  const [importFileptah,setImportFilePath] = useState<string>()
  const [patientCount,setPatientCount] = useState<number[]>([])
  const [crntPageNumber,setCrntPageNumber] = useState<number>(0)
  const [ageCobination,setAgeCombination] = useState<{[key:string]:string}>({Years:"",Months:"",Weeks:"",Days:""})
  const [ageArray,setAgeArray] = useState<string[]>(["Years","Months","Weeks","Days"])
  const [patientData, setPatientData] = useState<{[key: string]: string}[]>([]);
  const [newPatientDetils, setNewPatientDetails] = useState<{
    [key: string]: string;
  }>({
    "Full Name": "",
    Age: "",
    "Telephone Number":"",
    Gender: "",
  });
  const [nameAgeValidity, setNameAgeValidity] = useState<{
    [key: string]: string;
  }>({
    "Full Name": "form-control",
    Age: "form-control",
    Gender: "form-select",
    "Telephone Number": "form-control",
  });
  const [patientSesrch,setPatientSearch] = useState<string>("")
  const [newPatientAdded, setNewPatientAdded] = useState<boolean>(false);
  const navigate = useNavigate();
  
  useEffect(()=>{
    console.log(ageCobination)
    
    setNewPatientDetails(prev=>{
      let obj = {...prev}
      obj["Age"] = `${ageCobination['Years']&&ageCobination['Years']+"y"}${ageCobination['Months']&&(ageCobination['Years']?"-":"")+ageCobination['Months']+"m"}${ageCobination['Weeks']&&(ageCobination['Months']||ageCobination['Years']?"-":"")+ageCobination['Weeks']+"w"}${ageCobination['Days']&&(ageCobination['Months']||ageCobination['Years']||ageCobination['Weeks']?"-":"")+ageCobination['Days']+"d"}`
      return obj
    })
  },[ageCobination])

  useEffect(()=>{
    if(excelData && excelData.length > 0){
      setRecordsCount(excelData.length)
      setViewDisplay('block')
    }else{
      setViewDisplay('none')
    }
  },[excelData])
  useEffect(() => {
    setPatientRegisterHeader(["Id", "Full Name", "Age", "Gender","Telephone Number"]);
    fetch(`${baseURL}/get-all-patient-count`)
      .then(res => {
        if(res.status==200){
          return res.json();
        }
        else if(res.status==404){
          setPatientCount([])
        }
        else {
          alert(`${res.statusText}`);
        }
      })
      .then(response => {
        console.log(response)
         let thearr = []
        for(let i = 1;i<= Math.ceil(response.size/100);i++){
          thearr.push(i)
        }
        setPatientCount(thearr)
        
      });
      fetch(`${baseURL}/get-rangeof-patients`,{
        method:"POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({from:0,to:100}),
      }).then(res=>{
        if(res.status == 200){
          return res.json()
        }else{
          return []
        }
      }).then((response)=>{
          setPatientData(response)   
      })
    // fetch(`${baseURL}/get-all-patient`)
    //   .then(res => {
    //     if(res.status==200){
    //       return res.json();
    //     }
    //     else if(res.status==404){
    //       setPatientData([]);
    //     }
    //     else {
    //       alert(`${res.statusText}`);
    //     }
    //   })
    //   .then(response => {
    //     setPatientData(response);
        
    //   });
    
  }, [newPatientAdded]);

  useEffect(()=>{
    if(patientThatNeedsToBeAdded['name']?.length > 0 || patientThatNeedsToBeAdded['age'].length > 0){
      console.log("yes it has a value")
      setNewPatientDetails(prev=>{
        let obj = {...prev}; 
          obj['Full Name'] = patientThatNeedsToBeAdded['name'];
          obj['Age'] = patientThatNeedsToBeAdded['age']
        return obj;
      })
    }
  },[patientThatNeedsToBeAdded])
 
  useEffect(() => {
    let ele = document.getElementById("Full Name");
    ele?.focus();
  }, [patientRegisterHeaders]);

  const handleNewPatientSubmit = () => {
    console.log(newPatientDetils)
    //newPatientDetils  send to back end
    dispatch(setPatientThatNeedToBeAddedToNormal({name:"",age:""}))
    let patientDetailsNew = {...newPatientDetils};
    if (patientDetailsNew["Full Name"] == "") {
      setNameAgeValidity(prev => {
        let newObj = {...prev};
        newObj["Full Name"] = "form-control is-invalid";
        return newObj;
      });
    } else {
      setNameAgeValidity(prev => {
        let newObj = {...prev};
        newObj["Full Name"] = "form-control";
        return newObj;
      });
    }

    if (patientDetailsNew["Age"] == "") {
      setNameAgeValidity(prev => {
        let newObj = {...prev};
        newObj["Age"] = "form-control is-invalid";
        return newObj;
      });
    } else {
      setNameAgeValidity(prev => {
        let newObj = {...prev};
        newObj["Age"] = "form-control";
        return newObj;
      });
    }

    if(ageCobination['Years'].length == 0 && ageCobination['Months'].length == 0 && ageCobination['Weeks'].length == 0 && ageCobination['Days'].length == 0){
      setNameAgeValidity(prev=>{
        let obj = {...prev}
        obj['Age'] = "form-control is-invalid"
        return obj
      })
    }else{
      setNameAgeValidity(prev=>{
        let obj = {...prev}
        obj['Age'] = "form-control"
        return obj
      })
    }
    if (
      patientDetailsNew["Full Name"] != "" &&
      patientDetailsNew["Age"] != ""
    ) {
    fetch(`${baseURL}/add-patient`, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(newPatientDetils),
    }).then(res => {
        if(res.status==201){
          setNewPatientAdded(prev => !prev);
          setNewPatientDetails({
            "Full Name": "",
            Age: "",
            "Telephone Number":"",
            Gender: "",
          });
          return res.json()
        }
      }).then(response=>{
        navigate(`/patientDetails/${response.id}`)
      })
    }
  };

  const handleNewPtientSubmitCancel = () => {
    setAgeCombination({Years:"",Months:"",Weeks:"",Days:""})
    setNewPatientDetails({
      "Full Name": "",
      Age: "",
      "Telephone Number":"",
      Gender: "",
    });

    dispatch(setPatientThatNeedToBeAddedToNormal({name:"",age:0}))
    setNameAgeValidity(prev=>{
      let obj = {...prev}
      obj['Full Name'] = "form-control"
      obj['Age'] = "form-control"
      return obj
    })
  };

  const handleNewPatientFormChange = (key: string, event: ChangeEvent<any>) => {
    if (key == "Full Name" || key == "Age") {
      
      setNameAgeValidity(prev => {
        let newObj = {...prev};
       
        if (event.target.value.length > 0) {
          newObj[key] = "form-control";
        } else {
          newObj[key] = "form-control is-invalid";
        }

        return newObj;
      });
    }
    setNewPatientDetails(prev => {
      let patientCrntDetails = {...prev};
      patientCrntDetails[key] = event.target.value;

      return patientCrntDetails;
    });
  };


  const handleGoingBack = () => {
    navigate("/Home");
  };

  const typeSelector = (value: string) => {
    if (value == "Age" || value == "Telephone Number") {
      return "number";
    } else {
      return "text";
    }
  };
  const yearGenerator = () => {
    const date = new Date()
    return date.getFullYear()
  }
  const handlePatientTableRowClick = (id:any) => {
    navigate(`/patientDetails/${id}`)
 }

 const handleAgeChanges = (value:string,event:ChangeEvent<any>) => {
  
  setAgeCombination(prev=>{
    let obj = {...prev}
    obj[value] = String(event.target.value)
    return obj
  })
 }

 const handlePaginationClick = (clickedIndex:number) => {
  setCrntPageNumber(clickedIndex)
    fetch(`${baseURL}/get-rangeof-patients`,{
      method:"POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({from:clickedIndex*100,to:100}),
    }).then(res=>{
      if(res.status == 200){
      return res.json()
      }else{
        return []
      }
    }).then((response)=>{
      setPatientSearch("")
      setPatientData(response)
    })
 }

 const handlePatientSearchChange = (event:ChangeEvent<any>) => {
  setPatientSearch(event.target.value)
 }

 const handleSearchaPatient = () => {
  fetch(`${baseURL}/Search-Patient-from-table`,{
    method:"POST",
    headers:{"Content-Type": "application/json"},
    body:JSON.stringify({name:patientSesrch})
  }).then(res=>{
    if(res.status == 200){
      return res.json();
    }else{
      setPatientData([])
    }
  }).then((response)=>{
  
    setPatientData(response)
  })

 
 }
 const handleFilePickerLaunch = () => {
    
    document.getElementById("fileuploader")?.click()
   // document.location.reload()
 }

 const handleFileselect = (e:ChangeEvent<any>) => {
  setImportFilePath(e.target.value)
  const file = e.target.files?.[0]
  if(file){
    const reader = new FileReader()
    reader.onload = (e:any) => {
      setDataReading(true)
       const arrayBuffer = e.target.result
       
       const workbook = XLSX.read(new Uint8Array(arrayBuffer),{type:'array'})

       const sheetName = workbook.SheetNames[0];
       const sheet = workbook.Sheets[sheetName];
       const data = XLSX.utils.sheet_to_json(sheet)
       

       console.log(data)
       setexcelData(data)
       setDataReading(false)
       
       
    }

    reader.readAsArrayBuffer(file)
  }
 }

 const theDeciderfunc = (keyArray:string[]) => {
  if(keyArray.length == 2){
    return true
  }else{
    if(keyArray.length > 4){
      return false
    }else if(keyArray[2] == 'Gender' && keyArray[3] == 'Telephone Number'){
       return true
    }else{
       return false
    }
  }
 }
 
 const handleImport = async() => {
  setViewDisplay('none')
  setUploading(true)
  setImportFilePath('')
  if(!excelData){
    setUploading(false)
    alert('No file has selected')
  }
  
  if(Object.keys(excelData[0]).length >= 2 && Object.keys(excelData[0])[0] == 'Full Name' && Object.keys(excelData[0])[1] == 'Age' && theDeciderfunc(Object.keys(excelData[0]))) 
   { 
 
      let counter = 0
      let errorLines = []
      excelData.forEach((value:any,index:number)=>{
        console.log(value)
        if(value['Full Name']&& value['Age']){
           counter ++
        }else{
          errorLines.push(index+2)
        }
      })
    
     let names:string[] = []
     excelData.forEach((value:{[key:string]:string})=>{
      names.push(value['Full Name'])
     })
     let unique = Array.from(new Set(names))
  
      if(excelData.length == counter){
         if(unique.length == excelData.length){
          fetch(`${baseURL}/bulk-patients`,{
            method:"POST",
            headers:{
              "Content-Type":"application/json"
            },
            body:JSON.stringify(excelData)
          }).then((res)=>{
            if(res.status == 200){
              setexcelData([])
              setUploading(false)
               return res.json()
            }
           }).then((response)=>{
            if(response){
             document.location.reload()
            }
          })
         }else{
          setexcelData(undefined)
          setUploading(false)
          alert('Names are duplicated in this sheet')
          document.location.reload()
         }
        
      }else{
        setexcelData(undefined)
        setUploading(false)
        
        alert('Mandatory fields need to be filled')
        document.location.reload()
      }
  }else{
    setexcelData(undefined)
    setUploading(false)
    alert('Wrong Template')
  }
  
 }
 const handleCellChange = (e:ChangeEvent<any>,key:any,index:number) => {
       setexcelData2((prev: any)=>{
            let array = [...prev];
            array[index][key] = e.target.value;
            return array
       })
 }

 const removePatientFromExcel = (index:number) => {
      setexcelData2((prev:any)=>{
        let arr = [...prev]
        if(arr.length > 1){
          arr.splice(index,1);
          return arr
        }else{
          return arr
        }
          
        
      })
 }
 const handleAddingARow = () => {
  setexcelData2((prev:any)=>{
    let theObj:{[key:string]:string} = {}
    let crntObj = [...prev][0]
    Object.keys(crntObj).forEach((value:string)=>{
      theObj[value] = ''
    })
    return [...prev,theObj]
  })
 }
  return (
    <PageLayout>
      <div className="row g-0 p-2" style={{height: "100%"}}>
        <div className="col-5" style={{height: "100%"}}>
          <div className="card card-body me-1 shadow" style={{height: "100%"}}>
            <h4>
              <span onClick={handleGoingBack} style={{cursor: "pointer"}}>
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
                </svg>{" "}
              </span>{" "}
              Patient Registration
            </h4>{" "}
            <br />
            {patientRegisterHeaders &&
              patientRegisterHeaders.map(value => {
                if (value == "Id") {
                  return <></>;
                }else if(value == "Age"){
                  return ( 
                  <div className="row">
                    {ageArray.map((val,index)=>{
                      if(val == "Months"){
                        return (<div className="col-3"><div className="form-floating"  >
                          <select className={nameAgeValidity[value]} id="floatingSelect" value={Object.values(ageCobination)[index]} onChange={(e)=>{handleAgeChanges(val,e)}}>
                            <option value=""></option>
                            <option value="1">One</option>
                            <option value="2">Two</option>
                            <option value="3">Three</option>
                            <option value="4">Four</option>
                            <option value="5">Five</option>
                            <option value="6">Six</option>
                            <option value="7">Seven</option>
                            <option value="8">Eight</option>
                            <option value="9">Nine</option>
                            <option value="10">Ten</option>
                            <option value="11">Eleven</option>
                          </select>
                          <div id={val} className="invalid-feedback">
                            cant be empty
                          </div>
                          <label htmlFor="floatingSelect">{val} :</label>
                        </div>
                      </div>)
                      }else if(val == "Weeks"){
                        return (<div className="col-3"><div className="form-floating"  >
                          <select className={nameAgeValidity[value]} id="floatingSelect" onChange={(e)=>{handleAgeChanges(val,e)}} value={Object.values(ageCobination)[index]} >
                            <option value=""></option>
                            <option value="1">One</option>
                            <option value="2">Two</option>
                            <option value="3">Three</option>
                            
                          </select>
                          <div id={val} className="invalid-feedback">
                            cant be empty
                          </div>
                          <label htmlFor="floatingSelect">{val} :</label>
                        </div>
                      </div>)
                      }
                      return(<div className="col-3">
                        <div className="form-floating mb-3">
                        <input
                            type={typeSelector(value)}
                            className={nameAgeValidity[value]}
                            min={0}
                            id={val}
                            placeholder="name@example.com"
                            value={Object.values(ageCobination)[index]}
                            onChange={(e)=>{handleAgeChanges(val,e)}}
                          />
                          <div id={val} className="invalid-feedback">
                            cant be empty
                          </div>
                          <label htmlFor={val}>{val} :</label>
                        </div>
                      </div>)
                    })}
                    
                </div>)
                } else if (value != "Gender") {
                  return (
                    <div className="form-floating mb-3">
                      <input
                        type={typeSelector(value)}
                        className={nameAgeValidity[value]}
                        min={0}
                        id={value}
                        placeholder="name@example.com"
                        value={newPatientDetils[value]}
                        onChange={event => {
                          handleNewPatientFormChange(value, event);
                        }}
                      />
                      <div id={value} className="invalid-feedback">
                        {`${value} cannot be empty ${value == "Age"? 'or zero':""}`}
                      </div>
                      <label htmlFor={value}>{value} :</label>
                    </div>
                  );
                }else{
                  return (
                    <div className="form-floating mb-3">
                      <select
                         className={nameAgeValidity[value]}
                        id="floatingSelect"
                        aria-label="Floating label select example"
                        value={newPatientDetils[value]}
                        onChange={event => {
                          handleNewPatientFormChange(value, event);
                        }}
                      >
                        <option selected></option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                      <label htmlFor="floatingSelect">{value} :</label>
                    </div>
                  );
                }
              })}
            <div
              className="card card-body p-0 border-0 mt-0"
              style={{ justifyContent: "center", backgroundColor: "rgba(255, 255, 255, 0)"}}
            >
              <button
                className="btn btn-success mt-3"
                onClick={handleNewPatientSubmit}
              >
                Submit
              </button>
              <button
                className="btn btn-danger mt-1"
                onClick={handleNewPtientSubmitCancel}
              >
                Cancel
              </button>
              <hr />
              
              {/* {<small style={{display:`block`,cursor:"pointer",color:"blue",textDecoration:"underline"}}>View & Edit</small>} */}
             {/*<div className="mt-3" id="upload">
              <div className="card card-body mb-1 p-1" style={{border:"0"}}>
                
              <div className="row mt-1 g-1">
                <div className="row p-0">
                  <div className="col-5 ps-3"><small className="text-dark" >Upload patients bulk</small></div>
                  <div className="col-7 p-0" style={{justifyContent:"end",textAlign:"end"}}><small style={{display:`${viewDisplay}`,cursor:"pointer",color:"blue",textDecoration:"underline"}} onClick={()=>{setexcelEditShow(true),setexcelData2(excelData)}}>View {recordsCount} Records </small>  </div>
                </div>
             
             <div className="col-9 mt-2">
               <input type="file" id="fileuploader" accept=".xlsx, .xls" onChange={handleFileselect}  style={{display:"none"}} />
               <input type="text" readOnly value={importFileptah} placeholder="Click here to Select a file" className="form-control form-control-sm" onClick={handleFilePickerLaunch}/>
             </div>
             <div className="col-2 mt-2">
               <button className="btn btn-primary btn-sm" style={{width:"100%"}} onClick={handleImport}>Upload</button></div>
               <div className="col-1 mt-2">
               <button className="btn btn-secondary btn-sm" style={{width:"100%"}} onClick={()=>{setViewDisplay('none'), setImportFilePath(''),setexcelData(undefined)}}><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="1 1 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="feather feather-refresh-ccw"><polyline points="1 4 1 10 7 10"/><polyline points="23 20 23 14 17 14"/><path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"/></svg></button></div>
             
             </div>
            
              </div>
              </div>*/}
              
          
              
              
              <div className="mt-auto card-footer"
        style={{
          backgroundColor:"rgba(255, 255, 255, 0)",
          height:"30px",
          textAlign:"center",
          color:"grey",
          
        }}>
          
          <small className="footer" style={{textAlign:"center",justifyContent:"center",}}>
          
          &copy; {yearGenerator()} NEX7 IT Services & Consulting  | 
          <span>
          <img className="ms-1"
            src={medilogo}  
            
          /> {' '} v1.0 
          </span>
        </small>
        </div>
        
            </div>
          </div>{" "}
        </div>
        <div className="col-7" style={{height: "100%"}}>
        <div className="card" style={{ height: "100%", display: "flex", flexDirection: "column" }}>
        <div className="card-body" style={{ flex: "1 1 auto", overflowY: "auto" }}>
      
          <div className="row">
            <div className="col-8">
              <div className="row g-1">
                
                <div className="col-6">
                <input type="text" value={patientSesrch} onChange={(e)=>handlePatientSearchChange(e)} className="form-control form-control-sm" placeholder="Search patient name"/>
                </div>
                <div className="col-6">
                <button className="btn btn-sm btn-primary" onClick={handleSearchaPatient}>Search</button>
                <button className="btn btn-sm btn-secondary ms-1" onClick={()=>{handlePaginationClick(0)}}><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 1 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="feather feather-refresh-ccw"><polyline points="1 4 1 10 7 10"/><polyline points="23 20 23 14 17 14"/><path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"/></svg></button>
                </div>
              </div>
            </div>
            </div>
            <br />
            <table className="table table-striped table-hover">
              <thead>
                <tr>
                  {patientRegisterHeaders &&
                    patientRegisterHeaders.map((value: string) => {
                      return <th>{value}</th>;
                    })}
                </tr>
              </thead>
              <tbody>
                {patientData && patientData.map(value => {
                  return (
                    <tr onClick={()=>{handlePatientTableRowClick(value['p_id'])}} style={{cursor:"pointer"}} className="scalup">
                      
                      {Object.values(value).map(value => {
                        return <td>{value}</td>;
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          
             
          </div>
          <div className="card-footer" style={{padding:"10px",justifyContent:"center",textAlign:"center"}}>{patientCount && patientCount.map((value,index)=>{
            return (<><button className={`btn btn-sm ${crntPageNumber == index?'btn-primary':'btn-outline-primary'} me-1`}  onClick={()=>{handlePaginationClick(index)}}><b>{value}</b></button></>)
          })}</div>
          </div>
        </div>
        <Modal show={dataReading} >
        <Modal.Header>
          <Modal.Title></Modal.Title>
        </Modal.Header>
        <Modal.Body>Scanning the file</Modal.Body>
        <Modal.Footer>
          
        </Modal.Footer>
      </Modal>
      <Modal show={uploading} >
        <Modal.Header>
          <Modal.Title>Upload Status</Modal.Title>
        </Modal.Header>
        <Modal.Body>Uploading... </Modal.Body>
        <Modal.Footer>
          
        </Modal.Footer>
      </Modal>
      <Modal
        size="lg"
        show={excelEditShow}
        onHide={()=>{setexcelEditShow(false)}}
        aria-labelledby="example-modal-sizes-title-lg"
        dialogClassName="modal-90w"
      >
        <Modal.Header closeButton>
          <Modal.Title id="example-modal-sizes-title-lg">
            Uploaded Excel
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{overflow:"auto",maxHeight:"470px"}}>
          <table className="table-bordered">
            <thead>
              <tr>{excelData2  && Object.keys(excelData2[0]).map((value:string)=>{
                 return (<th style={{justifyContent:"center",textAlign:"center",maxWidth:"185px"}}>{value}</th>)
              })}<th></th></tr>
            </thead>
            <tbody>{excelData2 && excelData2.map((value:any,index:number)=>{
              return (<tr>{Object.keys(excelData2[0]).map((val:any)=>{
                return <td style={{padding:"0",maxWidth:"185px"}}><input type="text" value={value[val]?value[val]:""} onChange={(e)=>{handleCellChange(e,val,index)}} /></td>
              })}<td style={{padding:"0"}}><button className="btn btn-sm btn-danger" onClick={()=>{removePatientFromExcel(index)}}>x</button></td></tr>)
            })}</tbody>
          </table>
          <button className="btn btn-sm btn-outline-primary mt-1" onClick={handleAddingARow}> <b>+ add row</b></button>
        </Modal.Body>
        <Modal.Footer>
          <button className="btn btn-success" onClick={()=>{setexcelData(excelData2),setexcelEditShow(false)}}>save</button>
        </Modal.Footer>
      </Modal>
      </div>
    </PageLayout>
  );
};
export default PatientRegistration;