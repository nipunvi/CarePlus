
import SearchCard from "./SearchCard";

import PageLayout from "./PageLayout";
import ResultsCard from "./ResultsCard";
import { SetStateAction, useEffect, useState } from "react";
import NavBar from "./NavBar";

interface Props{
  setBtnClicked:React.Dispatch<SetStateAction<boolean>>
  btnClicked:boolean 
  
}

const Home = ({setBtnClicked,btnClicked}:Props) => {
  const [results,setResults] = useState<{[key:string]:string}[]>([])
  const [searchResultsLoad,setSearchResultsLoad] = useState<boolean>(false)
  const [doYouWantToAddBtnVisibility,setDoYouWantToAddBtnVisibility] = useState<string>("none")

  return (
    <>
    <PageLayout>
      
      <div className="row g-0 p-2">
        
      <SearchCard setResults={setResults} btnClicked={btnClicked}  setLoad={setSearchResultsLoad} setDoYouWantToAddBtnVisibility={setDoYouWantToAddBtnVisibility}/>
      <ResultsCard data={results} setBtnClicked={setBtnClicked} searchResultsLoad={searchResultsLoad} doYouWantToAddBtnVisibility={doYouWantToAddBtnVisibility}/>
      </div>
      
    </PageLayout></>
    
  );
};

export default Home;