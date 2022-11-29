import axios from "axios";

const url = "https://travel-advisor.p.rapidapi.com/restaurants/list-by-latlng";

const options = {
  params: {
    latitude: "46.5158954",
    longitude: "-0.3509244",
    limit: "20",
    distance: "15",
    open_now: "false",
    lunit: "km",
    lang: "fr_FR",
  },
  headers: {
    "X-RapidAPI-Key": process.env.RAPID_API_KEY,
    "X-RapidAPI-Host": "travel-advisor.p.rapidapi.com",
  },
};

// maps
// const url = `maps.googleapis.com/maps/api/place/textsearch/json?API_KEY=&query=restaurants-deux-sèvres`;

export const getPlacesData = async () => {
  try {
    const {
      data: { data },
    } = await axios.get(url, options);
    return data;
  } catch (error) {
    console.log("error: ", error);
  }
};
