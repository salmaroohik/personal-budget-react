import axios from "axios";

// Get Chart Data
export const getChartData = () => {
  return axios({
    method: "get",
    url: "/budget",
  });
};