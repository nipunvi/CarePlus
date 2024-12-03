import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import PageLayout from "./PageLayout";
import PatientDetailsBar from "./PatientDetailsBar";
import PrescripAndHistoryArea from "./PrescripAndHistoryArea";
import {baseURL} from "./Global";
const PatientDetails = () => {
  const {id} = useParams();
  const [profileEditsSaved,setProfileEditsSaved] = useState<boolean>(false)
  const [patientDetails, setPatientDetils] = useState<{
    [key: string]: any;
  }>();

  useEffect(() => {
    //remove this
    /*const data = [
      {
        id: "01",
        "Full Name": "Nimasha Wijesinghe",
        Age: "29",
        Gender: "Male",
        "Telephone Numner": "0779443886",
      },
    ];*/
    //remove
    //setPatientDetils(data.filter(value => value["id"] == id)[0]);
    
    fetch(`${baseURL}/get-patient-byid`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({id: id}),
    })
      .then(res => {
        if (res.status == 200) {
          return res.json();
        }
      })
      .then(response => {
        console.log(response[0]["phone_no"])
        let myObj = {
          Id: id,
          "Full Name": response[0]["full_name"],
          Age: response[0]["age"],
          Gender: response[0]["gender"],
          "Telephone Number": response[0]["phone_no"],
        };
        setPatientDetils(myObj);
      });
  }, [id,profileEditsSaved]);

  return (
    <PageLayout>
      <div className="row g-0 p-2">
        {patientDetails ? (
          <PatientDetailsBar patientDetails={patientDetails} setProfileEditsSaved={setProfileEditsSaved} />
        ) : (
          <div className="col-12" style={{height: "15vh"}}>
            <div
              className="card card-body shadow"
              style={{
                height: "100%",
                textAlign: "center",
                justifyContent: "center",
                overflowY: "auto",
                color: "grey",
              }}
            >
              <h4>Loading..</h4>
            </div>
          </div>
        )}
        <PrescripAndHistoryArea patientId={id} />
      </div>
    </PageLayout>
  );
};

export default PatientDetails;