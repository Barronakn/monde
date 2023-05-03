import { useQuery } from "react-query";
import { NavLink } from "react-router-dom";
import { useState } from "react";

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
  const [sorted, setSorted] = useState(false);
  const handleSort = () => {
    setSorted(!sorted);
  };

  //Filtre par languages
  const [language, setLanguage] = useState("");

  //Filtre par population
  const [populations, setPopulations] = useState(false);
  const handlePopulation = () => {
    setPopulations(!populations);
  };

  //Filtre par superficie
  const [superficie, setSuperficie] = useState(false);
  const handleSuperficie = () => {
    setSuperficie(!superficie);
  };

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

  if (isLoading) {
    return <p className="load">En cours de chargement...</p>;
  }

  if (isError) {
    return <p>{error.message}</p>;
  }

  const filteredCountries = data.filter((country) => {
    if (filter !== "") {
      if (country.region !== filter) {
        console.log(country.region);
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
      <h1 className="text-center p-10 text-4xl">Liste des pays du monde </h1>
      <div className="row-1 mx-6 flex justify-around">
        {continents.map((continent) => (
          <li key={continent[continent.length]}>
            <input
              className="cursor-pointer"
              type="radio"
              name="country"
              checked={continent === filter}
              id={continent}
              onChange={(e) => setFilter(e.target.id)}
            />
            <label htmlFor={continent}> {continent} </label>
          </li>
        ))}
      </div>
      <div className="row-2 mx-6 my-2 flex justify-around">
        <li>
          <input
            type="submit"
            value={sorted ? "Trier de A à Z" : "Trier de Z à A"}
            onClick={handleSort}
            className="bg-black text-white px-2 py-1 rounded-2xl cursor-pointer font-bold"
          />
        </li>
        <li>
          <input
            type="submit"
            value={populations ? "Plus peuplés" : "Moins peuplés"}
            onClick={handlePopulation}
            className="bg-black text-white px-2 py-1 rounded-2xl cursor-pointer font-bold"
          />
        </li>
        <li>
          <input
            type="submit"
            value={superficie ? "Plus vaste" : "Moins vaste"}
            onClick={handleSuperficie}
            className="bg-black text-white px-2 py-1 rounded-2xl cursor-pointer font-bold"
          />
        </li>
      </div>
      {filter && (
        <div className="flex items-center bg-yellow-500 mt-1 justify-center text-red-600">
          <input
            type="submit"
            value="Annuler le filtre"
            onClick={() => setFilter("")}
            className="cursor-pointer font-bold uppercase"
          />
        </div>
      )}

      <div className="row-3 m-6 gap-2 flex justify-center">
        <label htmlFor="language-filter">Tirer par langue:</label>
        {/* <select
          id="language-filter"
          value={languageFilter}
          onChange={(e) => setLanguageFilter(e.target.value)}
        >
          <option value="">Toutes les langues</option>
          {languages.map((lang) => (
            <option key={lang} value={lang}>
              {lang}
            </option>
          ))}
        </select> */}
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

      {language && (
        <div className="flex items-center bg-yellow-500 mt-1 justify-center text-red-600">
          <input
            type="submit"
            value="Annuler le filtre par langue"
            onClick={() => setLanguage("")}
            className="cursor-pointer font-bold uppercase"
          />
        </div>
      )}

      <ul className="mx-6">
        {filteredCountries
          .sort((a, b) => {
            if (a.name.common < b.name.common) {
              return sorted ? 1 : -1;
            }
            if (a.name.common > b.name.common) {
              return sorted ? -1 : 1;
            }
            return 0;
          })
          .sort((a, b) => {
            if (!populations) {
              return 0;
            }
            if (a.population < b.population) {
              return populations ? 1 : -1;
            }
            if (a.population > b.population) {
              return populations ? -1 : 1;
            }
            return 0;
          })
          .sort((a, b) => {
            if (!superficie) {
              return 0;
            }
            if (a.area < b.area) {
              return superficie ? 1 : -1;
            }
            if (a.area > b.area) {
              return superficie ? -1 : 1;
            }
            return 0;
          })
          .filter((country) => country.region.includes(filter))
          .map((country) => (
            <li className="p-4" key={country.name.common}>
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
