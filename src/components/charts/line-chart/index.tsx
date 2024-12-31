import * as React from "react";

import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

const options: Highcharts.Options = {
  title: {
    text: "",
  },
  credits: {
    enabled: false,
  },
  chart: {
    backgroundColor: "transparent",
  },
  xAxis: {
    categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  },
  yAxis: {
    min: 0,
    title: {
      text: "",
    },
  },
  tooltip: {
    pointFormat: "{point.y}",
  },
  series: [
    {
      type: "line",
      name: "LR2-A-Pool",
      dashStyle: "Dash",
      lineWidth: 1,
      data: [45303, 14043, 10052, 40541, 15624, 86565],
    },
    {
      type: "scatter",
      name: "HAFNIA LEO",
      data: [55303, 24043, 30052, 10541, 55624, 26565],
    },
  ],
  accessibility: {
    enabled: false,
  },
};

export const LineChart = () => {
  return <HighchartsReact highcharts={Highcharts} options={options} />;
};
