import { BrowserRouter, Routes, Route } from "react-router-dom";
import Pays from "./pages/Pays";
import Details from "./pages/Details";

const App = () => {
  return (
    <div className="container">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Pays />} />
          <Route path="/countries/:countryCode" element={<Details />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
