import React, { useEffect, useState } from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  LineChart,
  Tooltip,
  Line,
  ResponsiveContainer,
} from "recharts"
import * as globalFunctions from "../global/functions"

function LongCard(props) {
  const [chartData, setChartData] = useState(<LoadingSpinner />)
  const [symbol, setSymbol] = useState()
  const [amountNear, setAmountNear] = useState()
  const [available, setAvailable] = useState()

  const [priceInDollar, setPriceInDollar] = useState(
    <div className="animate-pulse bg-gray-300 w-100 h-5 rounded-md mb-1"></div>
  )
  const [seller, setSeller] = useState(
    <div className="animate-pulse bg-gray-300 w-100 h-32 rounded-md mb-1"></div>
  )
  const [low, setLow] = useState(
    <div className="animate-pulse bg-gray-300 w-100 h-5 rounded-md mb-1"></div>
  )
  const [high, setHigh] = useState(
    <div className="animate-pulse bg-gray-300 w-100 h-5 rounded-md mb-1"></div>
  )
  const [change, setChange] = useState(
    <div className="animate-pulse bg-gray-300 w-100 h-5 rounded-md mb-1"></div>
  )

  function LoadingSpinner() {
    return (
      <div className="w-100 h-100 flex items-center justify-center bg-gray-100 rounded-xl">
        <div className="spinner-border text-indigo-600" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    )
  }

  useEffect(() => {
    const chartInterval = setInterval(getChartData, 1100)
    const dataInterval = setInterval(getData, 1100)

    function getChartData() {
      globalFunctions.getLongChartData(props.symbol).then((datas) => {
        clearInterval(chartInterval)
        const tempArr = []

        let largestPrice = 0
        let smallestPrice = 99999999999

        for (let i = 0; i < datas.x.length; i++) {
          let timeStamp = new Date(datas.x[i] * 1000)

          let hours = timeStamp.getHours()
          let minutes = timeStamp.getMinutes().toString()

          let date = hours + ":" + minutes

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
            priceHigh: datas.yHigh[i].toFixed(2),
            priceLow: datas.yLow[i].toFixed(2),
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
              />
              <Line
                dataKey="priceHigh"
                stroke="#5cb85c"
                dot={false}
                nameKey="date"
              />
              <Line
                dataKey="priceLow"
                stroke="#d9534f"
                dot={false}
                nameKey="date"
              />
            </LineChart>
          </ResponsiveContainer>
        )
      })
    }

    function getData() {
      globalFunctions.getData(props.symbol).then((result) => {
        clearInterval(dataInterval)
        let response = result.quoteResponse.result[0]
        setSeller("Owner: " + props.seller)
        setAvailable("Amount: " + props.amount)
        globalFunctions.getNearPrice().then((price) => {
          let realPrice = parseInt(price)
          let toPrice = response.regularMarketPrice / realPrice
          setAmountNear(toPrice.toFixed(2) + " Near")
        })

        setPriceInDollar("Price: $" + response.regularMarketPrice.toFixed(2))

        setSymbol(response.symbol)
        setHigh("HIGH: $" + response.regularMarketDayHigh.toFixed(2))
        setLow("LOW: $" + response.regularMarketDayLow.toFixed(2))
        setChange(
          "Change: " + response.regularMarketChangePercent.toFixed(2) + "%"
        )
      })
    }
  }, [])

  return (
    <div className="w-100 flex-row flex h-40 shadow-sm bg-white rounded-xl border border-indigo-700">
      <div className="w-2/12 h-100 flex-row flex justify-start items-center pl-3">
        <div className="w-1 bg-indigo-600 h-75 rounded-sm"></div>
        <div className="w-100 h-75 flex-col flex justify-evenly items-start pl-5">
          <div className="text-2xl font-bold w-100">{symbol}</div>
          <div className="text-lg font-bold w-100">{amountNear}</div>
          <div className="text-xs w-100">{seller}</div>
          <div className="text-xs w-100">{available}</div>
        </div>
      </div>
      <div className="w-3/12 h-100 flex-col flex justify-center gap-y-2 items-start pl-8">
        <div className="flex flex-row items-center justify-start gap-x-2 w-100">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="22"
            height="22"
            fill="currentColor"
            className="bi bi-graph-up-arrow"
            viewBox="0 0 16 16"
          >
            <path
              fillRule="evenodd"
              d="M0 0h1v15h15v1H0V0Zm10 3.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-1 0V4.9l-3.613 4.417a.5.5 0 0 1-.74.037L7.06 6.767l-3.656 5.027a.5.5 0 0 1-.808-.588l4-5.5a.5.5 0 0 1 .758-.06l2.609 2.61L13.445 4H10.5a.5.5 0 0 1-.5-.5Z"
            />
          </svg>
          <div className="text-success text-lg w-full">{high}</div>
        </div>
        <div className="flex flex-row items-center justify-start gap-x-2 w-100">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="22"
            height="22"
            fill="currentColor"
            className="bi bi-graph-down-arrow"
            viewBox="0 0 16 16"
          >
            <path
              fillRule="evenodd"
              d="M0 0h1v15h15v1H0V0Zm10 11.5a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5v-4a.5.5 0 0 0-1 0v2.6l-3.613-4.417a.5.5 0 0 0-.74-.037L7.06 8.233 3.404 3.206a.5.5 0 0 0-.808.588l4 5.5a.5.5 0 0 0 .758.06l2.609-2.61L13.445 11H10.5a.5.5 0 0 0-.5.5Z"
            />
          </svg>
          <div className="text-danger text-lg w-full">{low}</div>
        </div>
        <div style={{ width: "100%" }}>{priceInDollar}</div>
        <div style={{ width: "100%" }}>{change}</div>
      </div>
      <div className="w-8/12 h-100 p-2">{chartData}</div>
    </div>
  )
}

export default LongCard
