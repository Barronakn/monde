import { useParams } from "react-router-dom";
import { useQuery } from "react-query";
import { useState, useEffect } from "react";

const DetailsList = () => {
  const { countryCode } = useParams(); // Récupérez l'identifiant du pays depuis l'URL
  const { isLoading, isError, error, data } = useQuery(
    ["country", countryCode],
    async () => {
      const response = await fetch(
        `https://restcountries.com/v3.1/alpha/${countryCode}`
      );
      if (!response.ok) {
        throw new Error(
          "Une erreur s'est produite lors de la récupération des données."
        );
      }
      const data = await response.json();
      return data;
    }
  );

  if (isLoading) {
    return <p className="load">En cours de chargement...</p>;
  }

  if (isError) {
    return <p>{error.message}</p>;
  }

  //Monnaie utilisée
  const getCurrencies = (country) => {
    const currencyArray = Object.keys(country.currencies);
    const currencies = currencyArray.map((currency) => {
      return country.currencies[currency].name;
    });
    return currencies.join(", ");
  };

  //Code pays
  // function getCountryCallingCode(country) {
  //   return country?.callingCodes[0];
  // }

  return (
    <div className="content text-center h-full">
      <h1 className="text-center text-4xl p-10 animate">
        Voici quelques détails de ce pays :{" "}
      </h1>
      {data.map((country, index) => (
        <div key={index} className="font-bold details">
          <p className="flex justify-center p-4">
            <span>Pays</span> {": " + country.name.common}{" "}
            <img
              className="w-10 h-6"
              src={country.flags.png}
              alt={"Drapeau du " + country.name.common}
              loading="lazy"
            />
          </p>
          <p className="p-4">
            <span>Nom officiel</span>
            {": " + country.name.official}
          </p>
          <p className="p-4">
            <span>Code pays</span>
            {": " + country.idd.root + country.idd.suffixes}
          </p>

          <p className="flex justify-center p-4 flex-col items-center">
            <span>Drapeau de l'amoirie{": "}</span>
            <img
              className="w-20 h-20"
              loading="lazy"
              src={country.coatOfArms.png}
              alt={"Drapeau de l'amoirie :" + country.name.common}
            />
          </p>
          <p className="p-4">
            <span>Capital</span>
            {": " + country.capital}
          </p>
          <p className="p-4">
            <span>Continent</span>
            {": " + country.continents}
          </p>
          <p className="p-4">
            <span>Sous-région</span>
            {": " + country.subregion}
          </p>
          <p className="p-4">
            <span>Fuseaux horaires</span>
            {": " + country.timezones}
          </p>
          <p className="p-4">
            <span>Code alpha2Code</span>
            {": " + country.cca2}
          </p>
          <p className="p-4">
            <span>code alpha3Code</span>
            {": " + country.cca2}
          </p>
          <p className="p-4">
            <span>Independent</span>
            {": " + country.independent}
          </p>
          <p className="p-4">
            <span>Status</span>
            {": " + country.status}
          </p>
          <p className="p-4">
            <span>Population</span>
            {": " + country.population + " habitants"}
          </p>
          <p className="p-4">
            <span>Superficie</span>
            {": " + country.area} km²
          </p>
          <p className="p-4">
            <span>Monnaie utilisée</span>
            {": " + getCurrencies(country)}
          </p>
          <p className="p-4">
            <span>Langues officielles</span>
            {": " + Object.values(country.languages).join(", ")}
          </p>
          <p className="p-4">
            <span>Début de semaine</span>
            {": " + country.startOfWeek}
          </p>
        </div>
      ))}
    </div>
  );
};

export default DetailsList;
