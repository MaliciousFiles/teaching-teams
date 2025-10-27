"use client";

import {getScores} from "@/util/submit";
import {useEffect, useState} from "react";
import QRCode from 'react-qr-code'
import dynamic from "next/dynamic";
const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

const ORDER = ["Context", "Individuality", "Time Orientation", "Power Distance", "Communication Style"]

export default function Home() {
  const [data, setData] = useState<number[][]>([]);
    useEffect(() => {
        const i = setInterval(() => getScores().then(setData), 1000);

        return () => clearInterval(i);
    }, []);

    return (
      <div className="flex flex-col min-h-screen items-center justify-center bg-gray-100 font-sans">
          <p className="flex py-8 text-xl mt-5 text-black">The&nbsp;<b>Data</b>&nbsp;(live)</p>
          <main className="flex mb-20 flex-col w-full items-center gap-10">
              <div className="absolute left-20 top-10 flex-col w-fit flex rounded-2xl p-3 bg-white items-center text-center sm:items-start sm:text-left">
                  <QRCode size={100} value='https://google.com' />
              </div>
              <div className="flex-col rounded-2xl pt-3 pb-5 px-4 bg-white items-center gap-6 text-center sm:items-start sm:text-left">
                  <Plot data={ORDER.map((name, i) => {
                      return { name, x: data.map(scores => scores[i]+1), type: 'box' };}).reverse()}
                        layout={{
                            title: {
                                text: 'Cultural Dimensions Statistics',
                            },
                            margin: {
                                l: 130
                            },
                            autosize: true,
                            hovermode: false,
                            dragmode: false,
                            clickmode: 'none',
                            showlegend: false,
                        }}
                        config={{
                            displayModeBar: false,
                        }}
                  />
              </div>
              <div className="flex-col rounded-2xl pt-3 pb-5 px-4 bg-white items-center gap-6 text-center sm:items-start sm:text-left">
                  <Plot data={[{
                      x: data.map(scores => scores[ORDER.indexOf("Power Distance")]+1),
                      y: data.map(scores => scores[ORDER.indexOf("Individuality")]+1),
                      mode: 'markers',
                      type: 'scatter',
                      marker: {
                          color: 'black',
                          size: 10,
                      },
                  }]}
                        layout={{
                            title: { text: 'Power Distance vs. Individuality', },
                            xaxis: {
                                title: { text: 'Power Distance' },
                                range: [0.8, 5.2]
                            },
                            yaxis: {
                                title: { text: 'Individuality' },
                                range: [0.8, 5.2]
                            },
                            autosize: true,
                            hovermode: false,
                            dragmode: false,
                            clickmode: 'none',
                            showlegend: false,
                        }}
                        config={{
                            displayModeBar: false,
                        }}
                  />

              </div>
          </main>
      </div>
  );
}
