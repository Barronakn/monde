import { useQuery } from "react-query";
import { NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import "simple-reveal/index.css";
import ArrowTop from "../assets/arrow-top.svg";
import ArrowDown from "../assets/down-arrow.svg";

const Query = () => {
  const [handleClick, setHandleClick] = useState(false);

  //ToogleContinent
  const [toogle, setToogle] = useState(false);

  //ToogleLangue
  const [toogleLang, setToogleLang] = useState(false);

  //Recherche par Langue
  const [searchLangue, setSearchLangue] = useState("");

  //Filtre par continent
  const [searchContinent, setSearchContinent] = useState("");
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
  const maxPopulation = 1425893465;
  const [populations, setPopulations] = useState(1425893465);

  //Filtre par superficie
  const minSuperficie = 0;
  const maxSuperficie = 17098300;
  const [superficie, setSuperficie] = useState(17098300);

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
  const perPage = 30;
  const [page, setPage] = useState(1);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleScroll = () => {
    if (window.innerHeight + window.scrollY >= document.body.scrollHeight) {
      setPage((page) => page + 1);
    }
  };

  // Remonte en haut de la page au clic sur le bouton
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
    });
  };

  const [visible, setVisible] = useState(false);
  window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  });

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
      <h1 className="text-center bg-white w-full fixed font-bold p-10 text-4xl animate z-50">
        Liste des pays du monde
      </h1>
      <div className="flex justify-center items-center">
        <button
          onClick={() => setHandleClick(!handleClick)}
          className="btnFilter z-50"
        >
          {handleClick
            ? "Cliquez ici pour fermer le filtre"
            : "Cliquez ici pour afficher le filtre"}
        </button>
      </div>
      <div className="cadre flex relative">
        {handleClick && (
          <section className="filter py-4 left-3 top-32 w-72 fixed z-30">
            <div className="col-1">
              <div className="row-1 mx-6 my-2">
                <li className="flex flex-col">
                  <label htmlFor="superficie">Superficies</label>
                  <p className="flex text-sm justify-between">
                    <span>{minSuperficie}</span>
                    <span>{maxSuperficie}</span>
                  </p>
                  <input
                    className="cursor-pointer"
                    type="range"
                    defaultValue={superficie}
                    onChange={(e) => setSuperficie(e.target.value)}
                    min="0"
                    max="17098300"
                    step="100"
                  />
                </li>
                <p className="text-center text-sm">{superficie}</p>
              </div>
              <div className="row-2 mx-6 my-2">
                <li className="flex flex-col">
                  <label htmlFor="population">Populations</label>
                  <p className="flex text-sm justify-between">
                    <span>{minPopulation}</span>
                    <span>{maxPopulation}</span>
                  </p>
                  <input
                    className="cursor-pointer"
                    type="range"
                    defaultValue={populations}
                    onChange={(e) => setPopulations(e.target.value)}
                    min="0"
                    max="1425893465"
                    step="100"
                  />
                </li>
                <p className="text-center text-sm">{populations}</p>
              </div>
              <div className="row-3 text-center my-4">
                <input
                  className="rounded-2xl py-2 pl-4 border-input"
                  type="search"
                  placeholder="Trouver un pays"
                  value={sorted}
                  onChange={(e) => setSorted(e.target.value)}
                />
              </div>
            </div>
            <div className="col-2 flex flex-col gap-5">
              <div className="row-4 mb-20 select text-center w-56">
                <div
                  onClick={() => setToogle(!toogle)}
                  className="select-btn bg-gray-300 rounded-xl p-2 flex justify-between cursor-pointer"
                >
                  <span>Continents</span>
                  <img
                    className="arrowdown w-4 h-8 -mt-2"
                    src={ArrowDown}
                    alt="arrowDown"
                  />
                </div>
                {toogle && (
                  <div className="option mt-1 bg-gray-300 rounded-lg">
                    <div>
                      <input
                        type="search"
                        value={searchContinent}
                        onChange={(e) => setSearchContinent(e.target.value)}
                        placeholder="Trouver un continent"
                        className="bg-gray-300 mt-4 w-52 h-7 p-2 text-black rounded-lg border-input"
                      />
                    </div>
                    <div className="flex flex-col mt-2 max-h-24 overflow-y-auto">
                      {continents
                        .filter((continent) =>
                          continent
                            .toLowerCase()
                            .includes(searchContinent.toLowerCase())
                        )
                        .map((continent) => (
                          <div
                            className="option text-start pl-4 cursor-pointer"
                            key={continent}
                          >
                            <li
                              id={continent}
                              onClick={(e) => setFilter(e.target.id)}
                              className="p-1"
                            >
                              {continent}
                            </li>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="row-5 select text-center w-56">
                <div
                  onClick={() => {
                    setToogleLang(!toogleLang);
                  }}
                  className="select-btn bg-gray-300 rounded-xl p-2 flex justify-between cursor-pointer"
                >
                  <span>Langues</span>
                  <img
                    className="arrowdown w-4 h-8 -mt-2"
                    src={ArrowDown}
                    alt="arrowDown"
                  />
                </div>
                {toogleLang && (
                  <div className="option mt-1 bg-gray-300 rounded-lg">
                    <div>
                      <input
                        type="search"
                        value={searchLangue}
                        onChange={(e) => setSearchLangue(e.target.value)}
                        placeholder="Trouver une langue"
                        className="bg-gray-300 mt-4 w-52 h-7 p-2 text-black rounded-lg border-input"
                      />
                    </div>
                    <div className="flex flex-col mt-2 max-h-32 overflow-y-auto">
                      {languages
                        .filter((language) =>
                          language
                            .toLowerCase()
                            .includes(searchLangue.toLowerCase())
                        )
                        .map((language) => (
                          <div
                            className="option text-start pl-4 cursor-pointer"
                            key={language}
                          >
                            <li
                              id={language}
                              onClick={(e) => setLanguage(e.target.id)}
                              className="p-1"
                            >
                              {language}
                            </li>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}
        <section className="filter none py-4 left-3 top-32 w-72 fixed z-30">
          <div className="col-1">
            <div className="row-1 mx-6 my-2">
              <li className="flex flex-col">
                <label htmlFor="superficie">Superficies</label>
                <p className="flex text-sm justify-between">
                  <span>{minSuperficie}</span>
                  <span>{maxSuperficie}</span>
                </p>
                <input
                  className="cursor-pointer"
                  type="range"
                  defaultValue={superficie}
                  onChange={(e) => setSuperficie(e.target.value)}
                  min="0"
                  max="17098300"
                  step="100"
                />
              </li>
              <p className="text-center text-sm">{superficie}</p>
            </div>
            <div className="row-2 mx-6 my-2">
              <li className="flex flex-col">
                <label htmlFor="population">Populations</label>
                <p className="flex text-sm justify-between">
                  <span>{minPopulation}</span>
                  <span>{maxPopulation}</span>
                </p>
                <input
                  className="cursor-pointer"
                  type="range"
                  defaultValue={populations}
                  onChange={(e) => setPopulations(e.target.value)}
                  min="0"
                  max="1425893465"
                  step="100"
                />
              </li>
              <p className="text-center text-sm">{populations}</p>
            </div>
            <div className="row-3 text-center my-4">
              <input
                className="rounded-2xl py-2 pl-4 border-input"
                type="search"
                placeholder="Trouver un pays"
                value={sorted}
                onChange={(e) => setSorted(e.target.value)}
              />
            </div>
          </div>
          <div className="col-2 flex flex-col gap-5">
            <div className="row-4 mb-20 select text-center w-56">
              <div
                onClick={() => setToogle(!toogle)}
                className="select-btn bg-gray-300 rounded-xl p-2 flex justify-between cursor-pointer"
              >
                <span>Continents</span>
                <img
                  className="arrowdown w-4 h-8 -mt-2"
                  src={ArrowDown}
                  alt="arrowDown"
                />
              </div>
              {toogle && (
                <div className="option mt-1 bg-gray-300 rounded-lg">
                  <div>
                    <input
                      type="search"
                      value={searchContinent}
                      onChange={(e) => setSearchContinent(e.target.value)}
                      placeholder="Trouver un continent"
                      className="bg-gray-300 mt-4 w-52 h-7 p-2 text-black rounded-lg border-input"
                    />
                  </div>
                  <div className="flex flex-col mt-2 max-h-24 overflow-y-auto">
                    {continents
                      .filter((continent) =>
                        continent
                          .toLowerCase()
                          .includes(searchContinent.toLowerCase())
                      )
                      .map((continent) => (
                        <div
                          className="option text-start pl-4 cursor-pointer"
                          key={continent}
                        >
                          <li
                            id={continent}
                            onClick={(e) => setFilter(e.target.id)}
                            className="p-1"
                          >
                            {continent}
                          </li>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
            <div className="row-5 select text-center w-56">
              <div
                onClick={() => {
                  setToogleLang(!toogleLang);
                }}
                className="select-btn bg-gray-300 rounded-xl p-2 flex justify-between cursor-pointer"
              >
                <span>Langues</span>
                <img
                  className="arrowdown w-4 h-8 -mt-2"
                  src={ArrowDown}
                  alt="arrowDown"
                />
              </div>
              {toogleLang && (
                <div className="option mt-1 bg-gray-300 rounded-lg">
                  <div>
                    <input
                      type="search"
                      value={searchLangue}
                      onChange={(e) => setSearchLangue(e.target.value)}
                      placeholder="Trouver une langue"
                      className="bg-gray-300 mt-4 w-52 h-7 p-2 text-black rounded-lg border-input"
                    />
                  </div>
                  <div className="flex flex-col mt-2 max-h-32 overflow-y-auto">
                    {languages
                      .filter((language) =>
                        language
                          .toLowerCase()
                          .includes(searchLangue.toLowerCase())
                      )
                      .map((language) => (
                        <div
                          className="option text-start pl-4 cursor-pointer"
                          key={language}
                        >
                          <li
                            id={language}
                            onClick={(e) => setLanguage(e.target.id)}
                            className="p-1"
                          >
                            {language}
                          </li>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
        <ul className="pays px-10 color absolute left-72 top-32 z-0">
          {filteredCountries
            .filter((country) =>
              country.name.common.toLowerCase().includes(sorted.toLowerCase())
            )
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
              <li
                id="liste"
                className="relative cadre p-6"
                key={country.name.common}
              >
                <NavLink className="drapeau" to={`/${country.cca3}`}>
                  <img
                    className="w-28 h-20"
                    loading="lazy"
                    src={country.flags.png}
                    alt={"Drapeau du " + country.name.common}
                  />
                  <p className="drop w-28 h-20 absolute top-6 text-white text-sm font-bold flex flex-col gap-4 justify-center items-center">
                    <span>{country.name.common}</span>
                    <span>{country.capital}</span>
                  </p>
                </NavLink>
                <NavLink className="code" to={`/${country.cca3}`}>
                  {country.cca3}
                </NavLink>
              </li>
            ))}
        </ul>
      </div>
      {visible && (
        <img
          className="arrow w-10 h-10 px-2 cursor-pointer z-50 fixed bottom-20 right-0"
          src={ArrowTop}
          onClick={scrollToTop}
          alt="arrow_top"
        />
      )}
    </div>
  );
};

export default Query;
