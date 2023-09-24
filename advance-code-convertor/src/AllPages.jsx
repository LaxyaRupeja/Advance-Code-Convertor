import { Route, Routes } from "react-router-dom"
import HomePage from "./Pages/HomePage"
import CodeConvertor from "./Pages/CodeConvertor"

const AllPages = () => {
  return (
    <Routes>
        <Route path="/" element={<HomePage/>}/>
        <Route path="/code" element={<CodeConvertor/>}/>
    </Routes>
  )
}

export default AllPages