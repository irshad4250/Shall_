import React, { useEffect, useState } from "react"
import * as globalFunctions from "../global/functions"

function ShareInfo(props) {
  const [nowPrice, setNowPrice] = useState()
  const [difference, setDifference] = useState()

  useEffect(async () => {
    if (!props.boughtAt) return
    let nearPrice = parseFloat(props.nearPrice)
    let symbolPrice = await globalFunctions.getPrice(props.symbol)

    let now = parseFloat(symbolPrice) / nearPrice
    setNowPrice(now.toFixed(3))

    let differenceInNo = now - parseFloat(props.boughtAt)
    let percentage = (differenceInNo / parseFloat(props.boughtAt)) * 100
    setDifference(percentage.toFixed(1))
  }, [])

  return (
    <div className="shadow-sm rounded-xl h-40 w-52 pl-2 flex flex-col justify-evenly items-start bg-white border ml-2">
      <div className="text-center font-bold">
        Bought: {parseFloat(props.boughtAt).toFixed(3)} Near
      </div>
      <div className="text-center font-bold">Now: {nowPrice} Near</div>
      <div className="text-center font-bold">Difference: {difference}%</div>
      <div className="text-center font-bold">
        Status: {props.status === true ? "Selling" : "Not Selling"}
      </div>
      <div className="text-xs text-gray-500 px-2 text-center w-100">
        Percentage may differ
      </div>
    </div>
  )
}

export default ShareInfo
