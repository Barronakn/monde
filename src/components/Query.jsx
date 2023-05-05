import { useQuery } from "react-query";
import { NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import "simple-reveal/index.css";

const Query = () => {
  //Filtre par continent
  const [filter, setFilter] = useState("");
  const continents = [
    "Africa",
    "Antarctic",
    "Americas",
    "Asia",
    "Europe",
    "Oceania",
  ];

  //Filtre par nom
  const [sorted, setSorted] = useState("");

  //Filtre par languages
  const [language, setLanguage] = useState("");

  //Filtre par population
  const minPopulation = 0;
  const [populations, setPopulations] = useState(1000000000);
  //Filtre par superficie
  const minSuperficie = 0;
  const [superficie, setSuperficie] = useState(10000000);

  //Gestion de l'Api
  const { data, isLoading, isError, error } = useQuery(
    "countries",
    async () => {
      const response = await fetch("https://restcountries.com/v3.1/all");
      if (!response.ok) {
        throw new Error(
          "Une erreur s'est produite lors de la récupération des données."
        );
      }
      const data = await response.json();
      return data;
    }
  );

  //Infinite scroll
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  const perPage = 30;
  const [page, setPage] = useState(1);

  const handleScroll = () => {
    if (window.innerHeight + window.scrollY >= document.body.scrollHeight) {
      setPage((page) => page + 1);
    }
  };

  if (isLoading) {
    return <p className="load">En cours de chargement...</p>;
  }

  if (isError) {
    return <p>{error.message}</p>;
  }

  const filteredCountries = data.filter((country) => {
    if (filter !== "") {
      if (country.region !== filter) {
        return false;
      }
    }

    if (language !== "") {
      if (!Object.values(country.languages || {}).includes(language)) {
        return false;
      }
    }
    return true;
  });

  const languages = [
    ...new Set(
      filteredCountries.flatMap((country) => {
        const countryLanguages = country.languages
          ? Object.values(country.languages)
          : [];

        return countryLanguages;
      })
    ),
  ];

  return (
    <div className="content">
      <h1 className="text-center p-10 text-4xl animate">
        Liste des pays du monde{" "}
      </h1>

      <div className="col flex justify-around">
        <div className="row-1 mx-6 my-2">
          <li className="flex flex-col">
            <label htmlFor="superficie">Tri par superficie</label>
            <input
              type="range"
              defaultValue={superficie}
              onChange={(e) => setSuperficie(e.target.value)}
              min="0"
              max="10000000"
            />
          </li>
        </div>
        <div className="row-2 mx-6 my-2">
          <input
            className="rounded-2xl p-1 w-72"
            type="search"
            placeholder="Trier par nom"
            value={sorted}
            onChange={(e) => setSorted(e.target.value)}
          />
        </div>
        <div className="row-3 mx-6 my-2">
          <li className="flex flex-col">
            <label htmlFor="population">Tri par nombre de population</label>
            <input
              type="range"
              defaultValue={populations}
              onChange={(e) => setPopulations(e.target.value)}
              min="0"
              max="1000000000"
            />
          </li>
        </div>
      </div>

      <div className="row-4 m-6 gap-2 flex justify-center">
        <label htmlFor="continent-filter">Tirer par continent:</label>
        <select onChange={(e) => setFilter(e.target.value)}>
          <option value="">Tous les continents</option>
          {continents.map((continent) => (
            <option
              className="cursor-pointer"
              value={continent}
              key={continent}
            >
              {continent}
            </option>
          ))}
        </select>
      </div>

      <div className="row-5 m-6 gap-2 flex justify-center">
        <label htmlFor="language-filter">Tirer par langue:</label>
        <select
          id="language"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        >
          <option value="">Toutes les langues</option>
          {languages.map((lang) => (
            <option key={lang} value={lang}>
              {lang}
            </option>
          ))}
        </select>
      </div>

      <ul className="px-10">
        {filteredCountries
          .filter((country) => country.name.common.includes(sorted))
          .filter((country) => country.region.includes(filter))
          .filter((country) => {
            const superficies = country.area;
            return superficies >= minSuperficie && superficies <= superficie;
          })
          .filter((country) => {
            const population = country.population;
            return population >= minPopulation && population <= populations;
          })
          .slice(0, perPage * page)
          .map((country) => (
            <li id="liste" className=" p-6" key={country.name.common}>
              <NavLink className="relative" to={`/countries/${country.cca3}`}>
                <img
                  className="w-40 h-20 hover:shadow-2xl"
                  src={country.flags.png}
                  alt={"Drapeau du " + country.name.common}
                  loading="lazy"
                />
                <span className="absolute top-0 flex font-bold">
                  {country.name.common}
                </span>
              </NavLink>
              <NavLink className="code" to={`/countries/${country.cca3}`}>
                {country.cca3}
              </NavLink>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default Query;
