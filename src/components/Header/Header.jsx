
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { icons } from "../../assets/icons/icons";
import "./Header.css";
import Hambermenuoptions from "../Hambermenuoptions/Hambermenuoptions";
import { useTableNum } from "../context/TableNumContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Header({ onSearchChange, isMenu, isAddpage }) {
  const { tableNum } = useTableNum();
  const navigate = useNavigate();
  const [option, setOption] = useState(false);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [reservation, setReservation] = useState({
    name: "",
    phone: "",
    date: "",
    time: "",
    persons: "",
    email: "",
  });

  const handleMenuoption = () => {
    setOption(true);
  };

  const toggleFormVisibility = () => {
    setIsFormVisible(!isFormVisible);
  };

  const handleReservationChange = (e) => {
    const { name, value } = e.target;
    setReservation((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const isFormComplete = Object.values(reservation).every((value) => value.trim() !== "");

  const sendReservationData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("https://royalbangla-server.gofastapi.com/reserveTable", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reservation),
      });

      if (response.ok) {
        const result = await response.json();
        toast.success("Réservation réussie !", { position: "top-right" });
        setReservation({ name: "", phone: "", date: "", time: "", persons: "", email: "" });
        setIsFormVisible(false);
      } else {
        toast.error("Échec de la réservation. Veuillez réessayer.", { position: "top-right" });
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi de la réservation:", error);
      toast.error("Une erreur est survenue. Veuillez réessayer plus tard.", { position: "top-right" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReservationSubmit = () => {
    if (!isFormComplete) {
      toast.error("Veuillez remplir tous les détails avant de soumettre.", { position: "top-right" });
      return;
    }
    sendReservationData();
  };

  return (
    <>
      {option && <Hambermenuoptions setopt={setOption} />}

      <div className="header">
        <img
          src={icons.menuicon}
          alt="Menu"
          onClick={handleMenuoption}
          className="menu-icon"
          style={{ opacity: option ? 0 : 1 }}
        />

        {!isMenu && (
          <div className="welcome">
            <h2>Royal Bangla</h2>
          </div>
        )}

        {isMenu && (
          <div className="welcome">
            <h2>Royal Bangla</h2>
          </div>
        )}

        {isAddpage ? (
          <img
            src={icons.home_icon}
            onClick={() => navigate("/")}
            alt="Accueil"
            className="home-icon"
          />
        ) : (
          <img
            src={icons.pallet_icon}
            onClick={() => navigate("/added-items")}
            alt="Palette"
            className="pallet-icon"
          />
        )}
      </div>

      {!isAddpage && !isMenu && tableNum === 0 && (
        <>
          <button
            onClick={toggleFormVisibility}
            className="toggle-form-btn"
            disabled={isLoading}
          >
            {isFormVisible ? "FERMER LE FORMULAIRE DE RÉSERVATION" : "APPUYEZ POUR RÉSERVER UNE TABLE"}
          </button>

          {isFormVisible && (
            <div className="reservation-form">
              {/* Avis sur les horaires de réservation */}
              <p className="reservation-timing-notice">
                Réservez entre <br /> 10h30 et 14h00 et entre 18h30 et 22h00
              </p>
              <form className="reservation-row">
                <div className="reservation-input">
                  <input
                    type="text"
                    name="name"
                    value={reservation.name}
                    onChange={handleReservationChange}
                    required
                    placeholder="Nom"
                    className="reservation-name"
                    disabled={isLoading}
                  />
                </div>

                <div className="reservation-input">
                  <input
                    type="tel"
                    name="phone"
                    value={reservation.phone}
                    onChange={handleReservationChange}
                    required
                    placeholder="Téléphone"
                    className="reservation-phone"
                    disabled={isLoading}
                  />
                </div>

                <div className="reservation-input">
                  <input
                    type="date"
                    name="date"
                    value={reservation.date}
                    onChange={handleReservationChange}
                    required
                    className="reservation-date"
                    disabled={isLoading}
                  />
                </div>

                <div className="reservation-input">
                  <input
                    type="time"
                    name="time"
                    value={reservation.time}
                    onChange={handleReservationChange}
                    required
                    className="reservation-time"
                    disabled={isLoading}
                  />
                </div>

                <div className="reservation-input">
                  <select
                    name="persons"
                    value={reservation.persons}
                    onChange={handleReservationChange}
                    required
                    className="reservation-persons"
                    disabled={isLoading}
                  >
                    <option value="" disabled>
                      Personnes
                    </option>
                    {[...Array(50).keys()].map((num) => (
                      <option key={num + 1} value={num + 1}>
                        {num + 1}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="reservation-input">
                  <input
                    type="email"
                    name="email"
                    value={reservation.email}
                    onChange={handleReservationChange}
                    required
                    placeholder="Email"
                    className="reservation-email"
                    disabled={isLoading}
                  />
                </div>

                <button
                  type="button"
                  onClick={handleReservationSubmit}
                  className="reservation-btn"
                  disabled={!isFormComplete || isLoading}
                >
                  {isLoading ? "Traitement en cours..." : "Réserver"}
                </button>
              </form>
            </div>
          )}
        </>
      )}

      {!isAddpage && !isMenu && tableNum === 0 && (
        <>
          <h3 className="order-heading">cliquez et récupérez</h3>
        </>
      )}

      {!isAddpage && !isMenu && (
        <>
          <div className="wrap-input-17">
            <div className="search-box">
              <button className="btn-search">🔍</button>
              <input
                onChange={onSearchChange}
                type="text"
                className="input-search"
                placeholder="Rechercher..."
              />
            </div>
          </div>
        </>
      )}

      <ToastContainer />
    </>
  );
}

export default Header;