import { useParams } from "react-router-dom";
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

  return (
    <div className="content text-center h-full">
      <h1 className="text-center text-4xl p-10">
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
            <span>Continent</span>
            {": " + country.continents}
          </p>
          <p className="p-4">
            <span>Capital</span>
            {": " + country.capital}
          </p>
          <p className="p-4">
            <span>Fuseaux horaires</span>
            {": " + country.timezones}
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
            <span>Langues officielles</span>
            {": " + Object.values(country.languages).join(", ")}
          </p>
        </div>
      ))}
    </div>
  );
};

export default DetailsList;
