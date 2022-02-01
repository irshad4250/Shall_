import React from "react"
import * as globalFunctions from "../global/functions"

function Notification(props) {
  return (
    <div className="p-3 mt-2 bg-white rounded-2xl shadow-md flex w-full">
      <div className="rounded-full w-16 h-16 border-indigo-600 flex border items-center justify-center">
        <div className="text-xl fontStyleTitle text-indigo-800">Shall</div>
      </div>
      <div className="pl-4 flex flex-col items-start justify-between h-full">
        <div className="text-sm leading-none font-bold">{props.info}</div>
        <div className="text-xs leading-3 text-gray-500">
          {globalFunctions.calculateAmountOfTimeFromTimeStamp(props.timestamp)}
        </div>
      </div>
    </div>
  )
}

export default Notification
