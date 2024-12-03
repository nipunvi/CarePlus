
import PageLayout from "./PageLayout"



const User = () => {
   
    const handleBackupData = () => {

    }

    
return (<>
 <PageLayout>
    <div className="row p-2 g-0">
        <div className="col-3">
             <div className="card card-body shadow">
                <a href="../assets/UserGuide.pdf" download="UserGuide.pdf">
                  <button className="btn btn-primary"style={{width:"100%"}}>Download the user guide</button>
                </a>
                <button className="btn btn-success mt-2" onClick={handleBackupData}>Backup</button>
             </div>
        </div>
        
    </div>
 </PageLayout>
 </>)
}

export default User