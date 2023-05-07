import { useParams, NavLink } from "react-router-dom";
import { useQuery } from "react-query";

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
  // const getCurrencies = (country) => {
  //   const currencyArray = Object.keys(country.currencies);
  //   const currencies = currencyArray.map((currency) => {
  //     return country.currencies[currency].name;
  //   });
  //   return currencies.join(", ");
  // };

  return (
    <div className="content text-center h-full my-10">
      {data.map((country, index) => (
        <div key={index} className="font-bold details">
          <div className="flex p-5">
            <img
              className="w-20 h-16"
              loading="lazy"
              src={country.flags.png}
              alt={"Drapeau du " + country.name.common}
            />
            <h1 className="text-center text-4xl animate">
              {country.name.common}
            </h1>
            <img
              className="w-20 h-20"
              loading="lazy"
              src={country.coatOfArms.png}
              alt={"Drapeau de l'amoirie :" + country.name.common}
            />
          </div>
          <NavLink className="back" to="/">
            Home
          </NavLink>
          <table className="mt-6">
            <thead>
              <tr>
                <th colSpan="2">Voici quelques détails de ce pays</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Nom officiel</td>
                <td>{country.name.official}</td>
              </tr>
              <tr>
                <td>Code pays</td>
                <td>{country.idd.root + country.idd.suffixes}</td>
              </tr>
              <tr>
                <td>Capital</td>
                <td>{country.capital}</td>
              </tr>
              <tr>
                <td>Continent</td>
                <td>{country.continents}</td>
              </tr>
              <tr>
                <td>Sous-région</td>
                <td>{country.subregion}</td>
              </tr>
              <tr>
                <td>Fuseaux horaires</td>
                <td>{country.timezones}</td>
              </tr>
              <tr>
                <td>Code alpha2Code</td>
                <td>{country.cca2}</td>
              </tr>
              <tr>
                <td>Code alpha3Code</td>
                <td>{country.cca3}</td>
              </tr>
              <tr>
                <td>Independent</td>
                <td>{"" + country.independent}</td>
              </tr>
              <tr>
                <td>Status</td>
                <td>{country.status}</td>
              </tr>
              <tr>
                <td>Population</td>
                <td>{country.population + " habitants"}</td>
              </tr>
              <tr>
                <td>Superficie</td>
                <td>{country.area + " km²"}</td>
              </tr>
              {/* <tr>
                <td>Monnaie utilisée</td>
                <td>{getCurrencies(country)}</td>
              </tr> */}
              <tr>
                <td>Langues officielles</td>
                <td>{Object.values(country.languages).join(", ")}</td>
              </tr>
              <tr>
                <td>Début de semaine</td>
                <td>{country.startOfWeek}</td>
              </tr>
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
};

export default DetailsList;
