import React, { useEffect, useState } from "react"
import Sidebar from "../components/Sidebar"
import ShareInfo from "../components/ShareInfo"
import LongCard from "../components/LongCard"
import * as globalFunctions from "../global/functions"

function Dashboard(props) {
  const [dashboardMain, setDashboardMain] = useState()

  useEffect(async () => {
    let nearPrice = await globalFunctions.getNearPrice()

    window.contract.getShares({ user: window.accountId }).then((shareArr) => {
      const tempArr = []
      for (let i = 0; i < shareArr.length; i++) {
        const share = shareArr[i]
        tempArr.push(
          <div
            className="w-100 flex flex-row mt-2"
            key={globalFunctions.makeid(10)}
          >
            <LongCard
              symbol={share.symbol}
              amount={share.amount}
              seller={share.seller}
            />
            <ShareInfo
              boughtAt={share.boughtAt}
              symbol={share.symbol}
              status={share.selling}
              nearPrice={nearPrice}
            />
          </div>
        )
      }
      setDashboardMain(tempArr)
    })
  }, [])

  return (
    <div className="font-sans w-100 flex flex-row h-100 items-center justify-start">
      {/* <Sidebar /> */}
      <div className="ml-0 lg:ml-60 w-100 h-100 bg-gray-100 bg-light px-2 transition-all overflow-y-auto overflow-x-hidden flex-wrap">
        <div className="flex flex-row items-baseline justify-start pt-2">
          <div className="text-4xl fontStyleTitle text-indigo-800">Shall</div>
          <div className="ml-4 font-sans text-xl text-gray-500">Dashboard</div>
        </div>
        {dashboardMain}
      </div>
    </div>
  )
}

export default Dashboard
