import TableBody from "./TableBody";
import TableHeader from "./TableHeader";
import medilogo from '../assets/carepluslogo.png'
import { useNavigate } from "react-router-dom";
import { SetStateAction } from "react";
import { useDispatch } from "react-redux";
import { setPatientThatNeedToBeAdded } from "../features/SearchCardSlice";



interface Props {
  data: {[key: string]: string}[];
  searchResultsLoad: boolean;
  doYouWantToAddBtnVisibility:string
  setBtnClicked:React.Dispatch<SetStateAction<boolean>> 

}

const ResultsCard = ({data, searchResultsLoad,doYouWantToAddBtnVisibility,setBtnClicked}: Props) => {
  const navigate = useNavigate() 

  const dispatch = useDispatch()

  const yearGenerator = () => {
    console.log(searchResultsLoad);
    const date = new Date()
    return date.getFullYear()
  }

  const handleOnClickNonaddedPatientBtn = () => {
    setBtnClicked(prev=>!prev)
    dispatch(setPatientThatNeedToBeAdded())
    navigate("/Patientregistration")
  }
  return (
    <div className="col-12">
      <div className="card card-body ResultsCrad d-flex flex-column">
      <div style={{flex: "1 1 auto", overflowY: "auto"}}>
        <table className="table table-hover">
          <TableHeader />
          {data.length > 0 ? <TableBody bodyDaya={data} /> :<></>}
        </table>
        {data.length==0 && (
          <div
            className="card card-body"
            style={{
              width: "100%",
              height: "60%",
              textAlign: "center",
              justifyContent: "center",
              border: "0",
              backgroundColor: "rgba(255, 255, 255, 0)"
             
            }}
          >
            <h4 style={{color: "grey"}}>No Results</h4>
            <div style={{display:`${doYouWantToAddBtnVisibility}`}}><button className="btn btn-sm btn-primary" onClick={handleOnClickNonaddedPatientBtn}><b>+ Add this user as a patient</b></button></div>
          </div>
        )}
        </div>
        <div className="card-footer"
        style={{
          backgroundColor:"rgba(255, 255, 255, 0)",
          height:"30px",
          textAlign:"center",
          justifyContent:"center",
          color:"grey" 
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
    </div>
  );
};

export default ResultsCard;