import React, { useEffect, useRef, useState } from "react"
import MyNavbar from "../components/Navbar"
import Card from "../components/Card"
import Sidebar from "../components/Sidebar"
import LongCard from "../components/LongCard"
import News from "../components/News"
import { Button } from "react-bootstrap"
import * as globalFunctions from "../global/functions"
import { Contract } from "near-api-js"

function Home(props) {
  const [newsSection, setNewsSection] = useState()
  const [latestSharesSection, setLatestSharesSection] = useState()

  const [totalShare, setTotalShare] = useState()
  const [mostShare, setMostShare] = useState()
  const [totalCompanies, setTotalCompanies] = useState()
  const [totalUsers, setTotalUsers] = useState()

  useEffect(() => {
    window.contract
      .getNoOfCompanies()
      .then((result) => setTotalCompanies(result))
    window.contract.getNoOfUser().then((result) => setTotalUsers(result))
    window.contract.getTotalShares().then((result) => setTotalShare(result))

    window.contract.getMostShare().then((object) => {
      setMostShare(object.symbol + ": " + object.amount)
    })

    if (!window.accountId) {
      window.location.replace("/login")
      return
    }

    window.contract
      .checkAccountPrivilege({ name: window.accountId })
      .then((acc) => {
        if (!acc) {
          window.contract.addAccount({ name: window.accountId, type: "user" })
        }
      })

    globalFunctions.retrieveNews().then((stream) => {
      const tempArr = []
      stream.forEach((newsArr) => {
        let imageUrl = newsArr.content.thumbnail.resolutions[2].url
        let newsText = newsArr.content.title

        let viewUrl
        try {
          viewUrl = newsArr.content.clickThroughUrl.url
        } catch {
          viewUrl = null
        }

        tempArr.push(
          <News
            imageUrl={imageUrl}
            text={newsText}
            key={globalFunctions.makeid(8)}
          />
        )
      })

      setNewsSection(tempArr)
    })

    window.contract.getLastShares().then((shareArr) => {
      const tempArr = []

      for (let i = 0; i < shareArr.length; i++) {
        const share = shareArr[i].value

        tempArr.push(
          <LongCard
            symbol={share.symbol}
            amount={share.amount}
            seller={share.seller}
            key={globalFunctions.makeid(10)}
          />
        )
      }
      setLatestSharesSection(tempArr)
    })
  }, [])

  return (
    <>
      <div className="font-sans w-100 flex flex-row items-center justify-start bg-gray-100">
        {/* <Sidebar /> */}
        <div className="ml-0 lg:ml-60 w-100 h-100 bg-gray-100 bg-light px-2 transition-all overflow-y-auto">
          <div className="flex flex-row items-baseline justify-start pt-2">
            <div className="text-4xl fontStyleTitle text-indigo-800">Shall</div>
            <div className="ml-4 font-sans text-xl text-gray-500">Home</div>
          </div>
          <div className="w-100 h-32 flex-row flex shadow-md bg-white rounded-xl border border-indigo-700">
            <div className="flex flex-row items-center justify-start w-25 h-100 pl-2 lg:pl-4">
              <div className="w-1 bg-indigo-600 h-75 rounded-sm"></div>
              <div className="w-75 h-100 pl-2 lg:pl-4 flex flex-col items-start justify-center">
                <div className="lg:text-xl">Total Shares</div>
                <div className="font-bold text-lg lg:text-2xl mt-3">
                  {totalShare}
                </div>
              </div>
            </div>
            <div className="flex flex-row items-center justify-start w-25 h-100 pl-2 lg:pl-3">
              <div className="w-1 bg-indigo-600 h-75 rounded-sm"></div>
              <div className="w-75 h-100 pl-2 lg:pl-4 flex flex-col items-start justify-center">
                <div className="lg:text-xl">Most Share</div>
                <div className="font-bold text-lg lg:text-2xl mt-3">
                  {mostShare}
                </div>
              </div>
            </div>
            <div className="flex flex-row items-center justify-start w-25 h-100 pl-2 lg:pl-3">
              <div className="w-1 bg-indigo-600 h-75 rounded-sm"></div>
              <div className="w-75 h-100 pl-2 lg:pl-4 flex flex-col items-start justify-center">
                <div className="lg:text-xl">Total companies</div>
                <div className="font-bold text-lg lg:text-2xl mt-3">
                  {totalCompanies}
                </div>
              </div>
            </div>
            <div className="flex flex-row items-center justify-start w-25 h-100 pl-2 lg:pl-3">
              <div className="w-1 bg-indigo-600 h-75 rounded-sm"></div>
              <div className="w-75 h-100 pl-2 lg:pl-4 flex flex-col items-start justify-center">
                <div className="llg:text-xl">Total users</div>
                <div className="font-bold text-lg lg:text-2xl mt-3">
                  {totalUsers}
                </div>
              </div>
            </div>
          </div>
          <div
            // style={{ height: "fit-content" }}
            className="w-100 py-3 block lg:flex lg:flex-row flex-col items-start justify-between gap-x-3 toPixel overflow-visible"
          >
            <div className="lg:w-4/6 w-full h-full flex flex-col gap-2 mb-2">
              {latestSharesSection}
            </div>
            <div
              style={{ height: 495 }}
              className="lg:w-2/6 mb-2 h-full w-full bg-white rounded-xl shadow-sm border border-indigo-700 flex flex-col px-2 gap-2 overflow-y-auto"
            >
              <div className="text-center w-100 text-xl">News</div>
              {newsSection}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Home

{
  /* <div className="w-100 h-64 flex items-center justify-start mt-4 overflow-y-auto p-2 pl-2 gap-x-2">
          <Card symbol={"AAPL"} />
          <Card symbol={"TSLA"} />
          <Card symbol={"FB"} />
        </div> */
}
