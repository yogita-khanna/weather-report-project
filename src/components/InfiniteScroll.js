import React, { useState, useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { Link } from "react-router-dom";

const style = {
  border: "1px solid green",
  margin: 12,
  padding: 8,
};

function App() {
  const [dataSource, setDataSource] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    fetch(
      `https://public.opendatasoft.com/api/records/1.0/search/?dataset=geonames-all-cities-with-a-population-1000&rows=20&page=${page}&sort=name`
    )
      .then((response) => response.json())
      .then((data) => {
        const newCities = data.records.map((record) => {
          const city = {
            name: record.fields.name,
            country: record.fields.cou_name_en,
            timezone: record.fields.timezone,
          };
          return city;
        });
        setDataSource((prevData) => [...prevData, ...newCities]);
        setHasMore(data.records.length > 0);
        setPage((prevPage) => prevPage + 1);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setHasMore(false);
      });
  };

  const handleSearch = (event) => {
    const value = event.target.value;
    setSearchTerm(value);

    const filteredSuggestions = dataSource.filter(
      (city) =>
        city.name.toLowerCase().includes(value.toLowerCase()) ||
        city.country.toLowerCase().includes(value.toLowerCase())
    );

    setSuggestions(filteredSuggestions);
  };

  const handleSuggestionClick = (suggestion, event) => {
    setSearchTerm(suggestion.name);
    setSuggestions([]);

    if (event && event.button === 2) {
      event.preventDefault();
      window.open(
        `/weatherPage?city=${encodeURIComponent(suggestion.name)}`,
        "_blank"
      );
    }
  };

  return (
<div className="bg-green-300 min-h-screen flex flex-col justify-center items-center">
  <input
    type="search"
    placeholder="Search with Country or City Name..."
    className="w-full lg:w-[97%] p-4 m-5 border border-green-400 rounded border-2 cursor-pointer hover:border-blue-500 focus:outline-none focus:border-blue-500 transition-all duration-300 m-4"
    value={searchTerm}
    onChange={handleSearch}
  />

  {suggestions.length > 0 && (
    <ul className="ml-4 mr-4 border border-yellow-400 w-[50%] text-sm">
      {suggestions.map((suggestion, index) => (
        <li
          key={index}
          className="p-1 m-2 border border-blue-200 cursor-pointer flex items-center justify-between hover:bg-gray-100 bg-orange-100 rounded transition-colors duration-300 text-sm"
          onClick={(event) => handleSuggestionClick(suggestion, event)}
          onContextMenu={(event) => handleSuggestionClick(suggestion, event)}
        >
          <div>
            <p className="text-sm font-semibold">{suggestion.name}</p>
            <p className="text-sm text-gray-500">{suggestion.country}</p>
          </div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-gray-400 hover:text-pink-500 cursor-pointer"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16m-7 6h7"
            />
          </svg>
        </li>
      ))}
    </ul>
  )}

  <InfiniteScroll
    dataLength={dataSource.length}
    next={fetchData}
    hasMore={hasMore}
    loader={<h4>Loading...</h4>}
    endMessage={<p>No more data to load</p>}
    className="w-full"
  >
    {dataSource
      .filter(
        (city) =>
          city.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          city.country.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .map((city, index) => (
        <div
          key={`${city.name}-${index}`} // Ensure unique key
          className="p-4 m-2 bg-yellow-200 border border-blue-200 cursor-pointer flex items-center justify-between hover:bg-gray-100 rounded transition-colors duration-300"
        >
          <p className="text-lg font-semibold">
            Country: {city.country}
            <Link to={`/weatherPage?city=${city.country}`}>
              {city.name}
            </Link>
          </p>
          <p className="text-base">City: {city.name}</p>
          <p className="text-base">Timezone: {city.timezone}</p>
        </div>
      ))}
  </InfiniteScroll>
</div>

  );
}

export default App;
