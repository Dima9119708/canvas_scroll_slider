import React, { useEffect, useRef, useState } from "react";
import "./index.css";
import CustomChart from "./logic/CustomChart";

const data = [
  { date: "12-09-2022", result: 7000 },
  { date: "14-09-2022", result: 6800 },
  { date: "15-09-2022", result: 6000 },
  { date: "15-09-2022", result: 10 },
  { date: "15-09-2022", result: 6000 },
  { date: "15-09-2022", result: 50000 },
  { date: "15-09-2022", result: 6800 },
  { date: "15-09-2022", result: 6500 },
  { date: "15-09-2022", result: 70000 },
  { date: "15-09-2022", result: 70000 },
  { date: "15-09-2022", result: 70000 },
  { date: "15-09-2022", result: 70000 },
  { date: "15-09-2022", result: 70000 },
  { date: "15-09-2022", result: 70000 },
  { date: "16-09-2022", result: 40000 },
  { date: "16-09-2022", result: 40000 },
  { date: "16-09-2022", result: 40000 },
  { date: "16-09-2022", result: 40000 },
  { date: "16-09-2022", result: 40000 },
  { date: "16-09-2022", result: 40000 },
  { date: "16-09-2022", result: 40000 },
  { date: "16-09-2022", result: 40000 },
  { date: "16-09-2022", result: 70000 },
];

const Chart = () => {
  const chartRef = useRef();
  const [distance, setDistance] = useState(0);

  useEffect(() => {
    const instance = new CustomChart({
      dpi: 1,
      data,
      height: 265,
      padding: { left: 56, right: 56, top: 5, bottom: 5 },
      domElement: chartRef.current,
      viewElements: 13,
      keyX: "date",
      keyY: "result",
      getDistance: (distance) => setDistance(distance),
    });

    window.addEventListener("resize", () => {
      instance.reInit();
    });
  }, []);

  return (
    <div className="parent" ref={chartRef}>
      <div id="chart">
        <div className="axis_y">
          <div>60.00</div>
        </div>
        <div className="wrapper">
          <canvas />
          <div className="axis_x">
            <div style={{ flex: `0 0 ${distance}px` }}>10/01/2011</div>
            <div style={{ flex: `0 0 ${distance}px` }}>10/01/2011</div>
            <div style={{ flex: `0 0 ${distance}px` }}>10/01/2021</div>
            <div style={{ flex: `0 0 ${distance}px` }}>10/01/2021</div>
            <div style={{ flex: `0 0 ${distance}px` }}>10/01/2021</div>
            <div style={{ flex: `0 0 ${distance}px` }}>10/01/2021</div>
            <div style={{ flex: `0 0 ${distance}px` }}>10/01/2021</div>
            <div style={{ flex: `0 0 ${distance}px` }}>10/01/2021</div>
            <div style={{ flex: `0 0 ${distance}px` }}>10/01/2021</div>
            <div style={{ flex: `0 0 ${distance}px` }}>10/01/2021</div>
            <div style={{ flex: `0 0 ${distance}px` }}>10/01/2021</div>
            <div style={{ flex: `0 0 ${distance}px` }}>10/01/2021</div>
            <div style={{ flex: `0 0 ${distance}px` }}>10/01/2021</div>
            <div style={{ flex: `0 0 ${distance}px` }}>10/01/2021</div>
            <div style={{ flex: `0 0 ${distance}px` }}>10/01/2021</div>
            <div style={{ flex: `0 0 ${distance}px` }}>10/01/2021</div>
            <div style={{ flex: `0 0 ${distance}px` }}>10/01/2021</div>
            <div style={{ flex: `0 0 ${distance}px` }}>10/01/2021</div>
            <div style={{ flex: `0 0 ${distance}px` }}>10/01/2021</div>
            <div style={{ flex: `0 0 ${distance}px` }}>10/01/2021</div>
            <div style={{ flex: `0 0 ${distance}px` }}>10/01/2021</div>
            <div style={{ flex: `0 0 ${distance}px` }}>10/01/2021</div>
            <div style={{ flex: `0 0 ${distance}px` }}>10/01/2021</div>
            <div style={{ flex: `0 0 ${distance}px` }}>10/01/2021</div>
          </div>
        </div>
        <div className="arrow_left">{"<"}</div>
        <div className="arrow_right">></div>
      </div>
    </div>
  );
};

export default Chart;
