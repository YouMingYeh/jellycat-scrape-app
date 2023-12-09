"use client";
import React, { useState, useEffect } from "react";
import {
  updateRate,
  getJellycat,
  getSelfridge,
  getCampusgifts,
  getAll,
  scrape,
  scrapeSpecific,
  getPrice,
  comparePrices,
  compare_prices_with_names,
} from "./APIs"; // replace './api' with the actual path to your API functions

import Calculator from "./components/calculator";
import Costs from "./components/Costs";
import Prices from "./components/Price";
import ComparePrices from "./components/ComparePrices";
import RatesTable from "./components/Rates";
export default function Home() {
  const [rates, setRates] = useState(null);
  const [jellycat, setJellycat] = useState(null);
  const [selfridge, setSelfridge] = useState(null);
  const [campusgifts, setCampusgifts] = useState(null);
  const [prices, setPrices] = useState(null);

  // Do the same for the other APIs

  useEffect(() => {
    updateRate()
      .then((data) => setRates(data))
      .catch((error) => console.error("Error:", error));
    getJellycat()
      .then((data) => setJellycat(data))
      .catch((error) => console.error("Error:", error));
    getSelfridge()
      .then((data) => setSelfridge(data))
      .catch((error) => console.error("Error:", error));
    getCampusgifts()
      .then((data) => setCampusgifts(data))
      .catch((error) => console.error("Error:", error));
    getPrice()
      .then((data) => setPrices(data))
      .catch((error) => console.error("Error:", error));

    // Do the same for the other APIs
  }, []);

  const handleRatesClick = () => {
    updateRate()
      .then((data) => setRates(data))
      .catch((error) => console.error("Error:", error));
  };

  const handleJellycatClick = () => {
    getJellycat()
      .then((data) => setJellycat(data))
      .catch((error) => console.error("Error:", error));
  };

  const handleSelfridgeClick = () => {
    getSelfridge()
      .then((data) => setSelfridge(data))
      .catch((error) => console.error("Error:", error));
  };

  const handleCampusgiftsClick = () => {
    getCampusgifts()
      .then((data) => setCampusgifts(data))
      .catch((error) => console.error("Error:", error));
  };

  const handlePricesClick = () => {
    getPrice()
      .then((data) => setPrices(data))
      .catch((error) => console.error("Error:", error));
  };

  return (
    <main className="flex min-h-screen items-start justify-center p-16 space-x-8 space-y-8 flex-wrap overflow-scroll">
      <Calculator />

      <RatesTable rates={rates} handleRatesClick={handleRatesClick} />

      <div className="flex w-screen p-16 space-x-8 items-center justify-center">
        <ComparePrices />
      </div>

      <Costs
        data={jellycat}
        handleDataClick={handleJellycatClick}
        title="Jellycat"
      />
      <Costs
        data={selfridge}
        handleDataClick={handleSelfridgeClick}
        title="Selfridge"
      />
      <Costs
        data={campusgifts}
        handleDataClick={handleCampusgiftsClick}
        title="Campusgifts"
      />

      {prices && (
        <Prices
          data={prices["jellycat"]}
          handleDataClick={handlePricesClick}
          title="報價"
        ></Prices>
      )}

      <div className="fixed bottom-4 left-4">
        <button
          onClick={() => {
            scrape()
              .then((data) => console.log(data))
              .catch((error) => console.error("Error:", error))
              .then(() => {
                alert("Please reload the page to see the updated data");
              });
          }}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Scrape Data Again
        </button>
      </div>

      {/* Do the same for the other APIs */}
    </main>
  );
}
