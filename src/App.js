import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import FirstPage from "./pages/FirstPage";
import Secondpage from "./pages/Secondpage";
import RenderingPage from "./pages/RenderingPage";
import Form from "./pages/Form";
import NavigationConfigPage from "./pages/NavigationConfigPage";

function App() {
  return (
    <Router>
      <div class="w-full min-h-screen h-full">
        <Routes>
          <Route path="/" element={<FirstPage />} />
          <Route path="/create" element={<Secondpage />} />
          <Route path="/create/pages/:wizardId" element={<RenderingPage />} />
          <Route path="/edit/pages/:wizardId" element={<RenderingPage />} />
          <Route path="/edit/:templateId" element={<Secondpage />} />
          <Route
            path="/edit/:templateId/:wizardId"
            element={<RenderingPage />}
          />
          <Route
            path="/preview/:templateId/:wizardId"
            element={<RenderingPage />}
          />
          <Route path="/form/:templateId/:wizardId" element={<Form />} />
          <Route path="/create/navConfig" element={<NavigationConfigPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
