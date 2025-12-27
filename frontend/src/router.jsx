import { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Loading from "./components/Loading";

const Home = lazy(() => import("./pages/Home"));
const Access = lazy(() => import("./pages/Access"));
const Text = lazy(() => import("./pages/Text"));

export default function Router() {
  return (
    <BrowserRouter>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/access" element={<Access />} />
          <Route path="/text/:code" element={<Text />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
