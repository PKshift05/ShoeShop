import React from "react";
import "./index.scss"; //tailwindcss
import "./App.css"; //reset css
import { Auth } from "./components";
import Header from "./components/header/Header.jsx";
import Footer from "./components/footer/Footer.jsx";
import {
  Home,
  Adidas,
  Page404,
  ProductDetail,
  Cart,
  CheckOut,
  CheckoutSuccess,
  MyOrder,
  SearchResult,
} from "./pages";
import Nike from "./pages/Nikle/nikePage.jsx";
import MLB from "./pages/MLB/MLBPage.jsx";
import IntroPage from "./pages/introPage/IntroPage.jsx";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import InfoAccount from "./pages/infoAccount/InfoAccount";
import OverlayProduct from "./pages/productDetail/OverlayProduct";
import OrderDetail from "./pages/myOrder/OrderDetail";
import { useSelector } from "react-redux";
import { selectIsLoggedIn } from "./redux-toolkit/slice/authSlice";

//LƯU Ý: đang set height cho body là 300vh để xuất hiện thanh scroll
const App = () => {
  const isLoggedIn = useSelector(selectIsLoggedIn);

  return (
    <>
      <BrowserRouter>
        <ToastContainer
          style={{
            zIndex: 999999,
          }}
        />
        <Header />

        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route
            path="/dang-nhap"
            element={isLoggedIn ? <Navigate to="/" /> : <Auth />}
          />
          <Route
            path="/tai-khoan"
            element={isLoggedIn ? <InfoAccount /> : <Navigate to="/dang-nhap" />}
          />
          <Route path="/gioi-thieu" element={<IntroPage></IntroPage>}></Route>
          <Route path="/Adidas" element={<Adidas></Adidas>}></Route>
          <Route path="/Nike" element={<Nike></Nike>}></Route>
          <Route path="/MLB" element={<MLB></MLB>}></Route>
          <Route path="/tin-tuc" element={<h2>TIN TỨC</h2>}></Route>
          <Route path="/lien-he" element={<h2>LIÊN HỆ</h2>}></Route>
          <Route
            path="/san-pham/:id"
            element={<ProductDetail></ProductDetail>}
          ></Route>
          <Route
            path="/gio-hang"
            element={isLoggedIn ? <Cart /> : <Navigate to="/dang-nhap" />}
          />
          <Route
            path="/thanh-toan/:id"
            element={isLoggedIn ? <CheckOut /> : <Navigate to="/dang-nhap" />}
          />
          <Route
            path="/don-hang"
            element={isLoggedIn ? <MyOrder /> : <Navigate to="/dang-nhap" />}
          />
          <Route
            path="/chi-tiet/:id"
            element={isLoggedIn ? <OrderDetail /> : <Navigate to="/dang-nhap" />}
          />
          <Route
            path="/tim-kiem/:queryValue"
            element={<SearchResult></SearchResult>}
          ></Route>
          <Route path="/*" element={<Page404></Page404>}></Route>
        </Routes>

        <Footer />
      </BrowserRouter>
    </>
  );
};

export default App;
