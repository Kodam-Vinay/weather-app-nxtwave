import { useState } from "react";
import { API_STATUS_LIST, IMAGES_LIST } from "./constants";

const MainBody = () => {
  const [apiStatus, setApiStatus] = useState(API_STATUS_LIST.initial);
  const [weatherReport, setWeatherReport] = useState({});
  const [searchInput, setSearchInput] = useState("");

  const getData = async () => {
    setApiStatus(API_STATUS_LIST.loading);
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${searchInput}&appid=a3547addf902f2a1e709f062a2e801dd`;
    try {
      const res = await fetch(apiUrl);
      const data = await res.json();
      if (res.ok) {
        if (data?.cod === 200) {
          setWeatherReport(data);
          setApiStatus(API_STATUS_LIST.success);
        } else {
          setApiStatus(API_STATUS_LIST.nodata);
        }
      }
    } catch (error) {
      setApiStatus(API_STATUS_LIST.failure);
    }
  };

  const handleOnSearch = (e) => {
    e.preventDefault();
    if (!searchInput) {
      window.alert("Please Enter At Least 3 Characters");
      return;
    }
    getData();
  };

  const renderLoader = () => {
    return <p>Loading.....</p>;
  };

  const renderWeatherData = () => {
    return (
      <div>
        <h4>
          Date:
          {new Date().getDay() +
            "/" +
            new Date().getMonth() +
            "/" +
            new Date().getFullYear()}
        </h4>
        <img
          className="weather_image"
          src={
            weatherReport?.weather[0]?.description === "sunny"
              ? IMAGES_LIST.SUN_IMAGE
              : weatherReport?.weather[0]?.description === "haze"
              ? IMAGES_LIST.HAZE_IMAGE
              : IMAGES_LIST.RAINY_IMAGE
          }
        />
        <h3>City: {weatherReport?.name}</h3>
        <h3>
          Temperature: {weatherReport?.main?.temp}
          <sup>o</sup>C
        </h3>
        <h3>Humidity: {weatherReport?.weather[0]?.description}</h3>
        <h3>Wind Speed: {weatherReport?.wind?.speed}</h3>
      </div>
    );
  };

  const renderError = () => {
    return <h1>Oops! Something went wrong</h1>;
  };

  const renderNoData = () => {
    return <h1>No Data Found With Entered Text {searchInput}</h1>;
  };

  const renderData = () => {
    switch (apiStatus) {
      case API_STATUS_LIST.loading:
        return renderLoader();
      case API_STATUS_LIST.success:
        return renderWeatherData();
      case API_STATUS_LIST.failure:
        return renderError();
      case API_STATUS_LIST.nodata:
        return renderNoData();
      case API_STATUS_LIST.initial:
        return null;
    }
  };

  return (
    <div className="main-container">
      <form onSubmit={(e) => handleOnSearch(e)}>
        <input
          type="search"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>
      {renderData()}
    </div>
  );
};
export default MainBody;
