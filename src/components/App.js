import React from "react";
import "./App.css";
import Main from "./Main/Main";
import { Route, Routes, useNavigate, useLocation, } from "react-router-dom";
import Article from "./Article/Article";
import WebLog from "./WebLog/WebLog";
import blogCards from "../utils/blog-cards";
import { useEffect, useState } from "react";
import ErrorPage from "../components/ErrorPage/ErrorPage";
import Footer from "./Footer/Footer";
import Popup from "./Popup/Popup";
import PopupSubmit from "./Popup/PopupSubmit/PopupSubmit";
import MainApi from "../utils/Api.js";

function App() {
  const [isCurrentCard, setCurrentCard] = useState({
    blogUrl: "",
    blogTitle: "",
    blogText: "",
    dataDay: "",
    _id: "",
  });
  const [scrollY, setScrollY] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  const navigate = useNavigate();
  let location = useLocation();

  // Безопасный селектор элементов
  const safeQuerySelector = (selector) => {
    try {
      return document.querySelector(selector);
    } catch (error) {
      console.warn(`Element not found: ${selector}`, error);
      return null;
    }
  };

  const safeQuerySelectorAll = (selector) => {
    try {
      return document.querySelectorAll(selector);
    } catch (error) {
      console.warn(`Elements not found: ${selector}`, error);
      return [];
    }
  };

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    const pageElement = safeQuerySelector(".page");
    if (pageElement) {
      pageElement.scrollIntoView({ block: "start" });
    }
  }, [isLoaded]);

  function sendCustomerData(data, isSource) {
    closePopup();
    openPopupsupmit();
    const date = new Date();
    
    function createDateAsUTC(date) {
      return new Date(
        Date.UTC(
          date.getFullYear(),
          date.getMonth(),
          date.getDate(),
          date.getHours(),
          date.getMinutes(),
          date.getSeconds()
        )
      );
    }
    
    let now = createDateAsUTC(date);
    data.dateTime = now;
    
    MainApi.sendNote(data)
      .then((res) => {
        clearUserData(isSource);
        openPopupsupmit();
      })
      .catch((err) => {
        console.error("Error sending data:", err);
      });
  }

  function handleSetCurrentCard(card) {
    setCurrentCard(card);
  }

  function clearUserData(isSource) {
    try {
      if (isSource === "popup") {
        const inputs = safeQuerySelectorAll(".popup-user-data");
        inputs.forEach((elem) => {
          if (elem) elem.value = "";
        });
        
        const textarea = safeQuerySelector(".popup-textarea");
        if (textarea) textarea.value = "";
      } else if (isSource === "form") {
        const inputs = safeQuerySelectorAll(".form-user-data");
        inputs.forEach((elem) => {
          if (elem) elem.value = "";
        });
        
        const phoneInput = safeQuerySelector(".PhoneInputInput");
        if (phoneInput) phoneInput.value = "";
        
        const formMessage = safeQuerySelector(".form-message");
        if (formMessage) formMessage.value = "";
      }
    } catch (error) {
      console.warn("Error clearing user data:", error);
    }
  }

  function escFunction(e) {
    if (e.key === "Escape" || e.target.classList.contains("popup-cover")) {
      closePopup();
    }
  }

  function openPopup() {
    try {
      const eventList = ["keydown", "click"];
      eventList.forEach((eventType) => {
        document.addEventListener(eventType, escFunction, false);
      });
      
      const popupCover = safeQuerySelector(".popup-cover");
      if (popupCover) {
        popupCover.classList.remove("popup-cover-disable");
      }
    } catch (error) {
      console.warn("Error opening popup:", error);
    }
  }

  function openPopupsupmit() {
    try {
      const popupSubmit = safeQuerySelector(".popup-submit");
      if (popupSubmit) {
        popupSubmit.classList.remove("popup-submit-disable");
      }
    } catch (error) {
      console.warn("Error opening submit popup:", error);
    }
  }

  function closePopup() {
    try {
      const eventList = ["keydown", "click"];
      eventList.forEach((eventType) => {
        document.removeEventListener(eventType, escFunction, false);
      });
      
      const popupCover = safeQuerySelector(".popup-cover");
      if (popupCover && !popupCover.classList.contains("popup-cover-disable")) {
        popupCover.classList.add("popup-cover-disable");
      }
      
      const popupSubmit = safeQuerySelector(".popup-submit");
      if (popupSubmit && !popupSubmit.classList.contains("popup-submit-disable")) {
        popupSubmit.classList.add("popup-submit-disable");
      }
    } catch (error) {
      console.warn("Error closing popup:", error);
    }
  }

  function handleMenuOpen(item) {
    try {
      if (item.classList.contains("menu-burger")) {
        const header = safeQuerySelector(".header");
        const menuBurger = safeQuerySelector(".menu-burger");
        
        if (header) header.style.display = "flex";
        if (menuBurger) menuBurger.style.display = "none";
      } else {
        const header = safeQuerySelector(".header");
        const menuBurger = safeQuerySelector(".menu-burger");
        
        if (header) header.style.display = "none";
        if (menuBurger) menuBurger.style.display = "flex";
      }
    } catch (error) {
      console.warn("Error handling menu:", error);
    }
  }

  useEffect(() => {
    function slideMenu() {
      try {
        const x = window.innerWidth;
        if (x > 1440) {
          const y = window.pageYOffset;
          setScrollY(y);
          
          if (location.pathname === "/") {
            const main = safeQuerySelector(".main");
            if (!main) return;
            
            const mainTitle = safeQuerySelector(".main-title");
            const mainSubtitle = safeQuerySelector(".main-subtitle");
            const subscribeBtn = safeQuerySelector(".main-subscribe-btn");
            const promoImage = safeQuerySelector(".promo-image");
            const pawContainer = safeQuerySelector(".paw-container");
            const pawImg = safeQuerySelector(".paw-img");
            
            if (scrollY < y && isLoaded) {
              if (!main.classList.contains("main-to-bottom")) {
                main.classList.add("main-to-bottom");
                if (mainTitle) mainTitle.classList.add("main-title-to-bottom");
                if (mainSubtitle) mainSubtitle.classList.add("main-subtitle-to-bottom");
                if (subscribeBtn) subscribeBtn.classList.add("main-subscribe-btn-to-bottom");
                if (promoImage) promoImage.classList.add("promo-image-to-bottom");
                if (pawContainer) pawContainer.style.display = "block";
                if (pawImg) pawImg.style.display = "block";
                
                window.removeEventListener("scroll", slideMenu);
                return;
              }
            } else {
              main.classList.remove("main-to-bottom");
              if (mainTitle) mainTitle.classList.remove("main-title-to-bottom");
              if (mainSubtitle) mainSubtitle.classList.remove("main-subtitle-to-bottom");
              if (subscribeBtn) subscribeBtn.classList.remove("main-subscribe-btn-to-bottom");
              if (promoImage) promoImage.classList.remove("promo-image-to-bottom");
              if (pawContainer) pawContainer.style.display = "none";
              if (pawImg) pawImg.style.display = "none";
              
              window.removeEventListener("scroll", slideMenu);
              return;
            }
          }
        }
      } catch (error) {
        console.warn("Error in slideMenu:", error);
      }
    }
    
    window.addEventListener("scroll", slideMenu);
    return () => window.removeEventListener("scroll", slideMenu);
  }, [scrollY, isLoaded, location.pathname]);

  return (
    <div className="page">
      <Routes>
        <Route
          path="*"
          element={<ErrorPage onMenu={handleMenuOpen} navigate={navigate} />}
        />
        <Route
          path="/"
          element={
            <Main
              onMenu={handleMenuOpen}
              openPopup={openPopup}
              onCard={handleSetCurrentCard}
              onSend={sendCustomerData}
              isLocation={location.pathname}
            />
          }
        />
        <Route
          path="/blog"
          element={<WebLog onMenu={handleMenuOpen} openPopup={openPopup} />}
        />
        <Route
          path="/article"
          element={
            <Article
              isCard={isCurrentCard}
              cards={blogCards}
              openPopup={openPopup}
              onMenu={handleMenuOpen}
            />
          }
        />
      </Routes>
      <Footer openPopup={openPopup} />
      <Popup onSend={sendCustomerData} onClosePopup={closePopup} />
      <PopupSubmit onClosePopup={closePopup} />
    </div>
  );
}

export default App;
