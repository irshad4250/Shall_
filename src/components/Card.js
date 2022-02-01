import React, { useEffect, useState } from "react"
import * as globalFunctions from "../global/functions"
import { LineChart, Line, Tooltip, YAxis, ResponsiveContainer } from "recharts"
import { Button } from "react-bootstrap"

function Card(props) {
  const [longName, setLongName] = useState(
    <div className="animate-pulse bg-gray-300 w-20 h-7 rounded-md mb-1"></div>
  )
  const [symbol, setSymbol] = useState(props.symbol)
  const [amountNear, setAmountNear] = useState(
    <div className="animate-pulse bg-gray-300 w-56 h-4 rounded-md mb-1"></div>
  )
  const [priceInDollar, setPriceInDollar] = useState(
    <div className="animate-pulse bg-gray-300 w-12 h-7 rounded-md mb-1"></div>
  )
  const [seller, setSeller] = useState(
    <div className="animate-pulse bg-gray-300 w-56 h-4 rounded-md mb-1"></div>
  )
  const [available, setAvailable] = useState()
  const [chartData, setChartData] = useState(
    <div className="h-full w-100 p-2 animate-pulse">
      <div className="h-full w-full animate-pulse bg-gray-300 rounded-xl"></div>
    </div>
  )

  const [styleComponent, setStyleComponent] = useState()

  useEffect(() => {
    if (props.label == "Selling") {
      setStyleComponent({ backgroundColor: "grey" })
    }

    const firstInterval = setInterval(data, 1100)
    const secondInterval = setInterval(chartDataFunction, 1100)

    function data() {
      globalFunctions.getData(props.symbol).then((result) => {
        clearInterval(firstInterval)
        let response = result.quoteResponse.result[0]

        globalFunctions.getNearPrice().then((price) => {
          let realPrice = parseInt(price)
          let toPrice = response.regularMarketPrice / realPrice
          setAmountNear(toPrice.toFixed(2) + " Near")
        })

        setLongName(response.longName.slice(0, 12))
        setPriceInDollar("$" + response.regularMarketPrice.toFixed(2))
        setSeller("Owner: " + props.seller)
        setAvailable("Available: " + props.available)
      })
    }

    function chartDataFunction() {
      globalFunctions.getChartData(props.symbol).then((datas) => {
        clearInterval(secondInterval)
        const tempArr = []

        let largestPrice = 0
        let smallestPrice = 99999999999

        for (let i = 0; i < datas.x.length; i++) {
          let timeStamp = new Date(datas.x[i] * 1000)
          let month = timeStamp.getMonth() + 1
          let date = timeStamp.getDate() + "/" + month

          let price = datas.y[i]
          if (price > largestPrice) {
            largestPrice = Math.floor(price)
          }
          if (price < smallestPrice) {
            smallestPrice = Math.floor(price)
          }

          tempArr.push({
            name: date,
            date: date,
            price: price.toFixed(2),
          })
        }
        setChartData(
          <ResponsiveContainer>
            <LineChart
              width={205}
              height={110}
              className="w-100 h-100"
              data={tempArr}
            >
              <YAxis
                type="number"
                hide
                domain={[smallestPrice, largestPrice]}
              />
              <Tooltip labelFormatter={(index) => tempArr[index].name} />
              <Line
                dataKey="price"
                stroke="#4f46e5"
                dot={false}
                nameKey="date"
                type="monotone"
              />
            </LineChart>
          </ResponsiveContainer>
        )
      })
    }
  }, [])

  return (
    <div
      href={props.href}
      style={{ height: 320 }}
      className="cursor-pointer w-64 shadow-sm rounded-2xl overflow-hidden pt-0 border bg-gray-50 hover:bg-gray-200 transition-all duration-300 no-underline text-black z-10"
    >
      <div className="flex flex-row justify-between h-25 p-1">
        <div className="w-4/6 h-100 flex flex-col justify-center items-start">
          <div className="flex flex-row align-flex-start items-center w-100">
            <div className="text-xl p-0 mr-2">{longName}</div>
            <div className="text-sm text-gray-500 mt-1">{symbol}</div>
          </div>
          <div className="text-xs p-0 text-gray-700 font-bold">to USD</div>
        </div>
        <div className="h-100 flex items-center justify-center font-bold">
          {priceInDollar}
        </div>
      </div>
      <div className="w-100 h-50 text-xs flex-1 align-center justify-center">
        {chartData}
      </div>
      <div className="w-100 h-25 flex flex-col items-center justify-flex-start">
        <div className="flex flex-row">{amountNear}</div>
        <div className="flex flex-row font-weight-light text-xs text-gray-600">
          {seller}
        </div>
        <div className="text-xs text-gray-600">{available}</div>
        <div className="flex flex-row items-center justify-center w-full">
          <button
            className="transition-all bg-indigo-600 hover:bg-indigo-500 text-white cursor-pointer h-5 w-1/4 p-0 text-xs rounded-md flex items-center justify-center"
            disabled={props.disabled}
            onClick={props.onClick}
            style={styleComponent}
          >
            {props.label}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Card
