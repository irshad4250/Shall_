import React, { useEffect, useRef, useState } from "react"
import Sidebar from "../components/Sidebar"
import Card from "../components/Card"
import Carousel, { consts } from "react-elastic-carousel"
import { Button } from "react-bootstrap"
import * as globalFunctions from "../global/functions"

const breakPoint = [
  { width: 1, itemsToShow: 1 },
  { width: 256, itemsToShow: 2 },
  { width: 512, itemsToShow: 3 },
  { width: 768, itemsToShow: 4 },
]

function Sell(props) {
  const [showings, setShowings] = useState()
  const [successText, setSuccessText] = useState()
  const [selectedSell, setSelectedSell] = useState()
  const [modalComponent, setModalComponent] = useState()

  async function setShareToSelling(shareId) {
    setSelectedSell(
      <div
        className="w-full h-full flex items-center justify-center absolute top-0 right-0 z-40 text-white flex-col "
        style={{ backgroundColor: "rgba(0,0,0,0.75)", zIndex: "100" }}
      >
        <h3>Please wait while we list the shares for sale</h3>
        <p>The page will reload once it's completed</p>
        <div
          class="spinner-border animate-spin inline-block w-12 h-12 border-4 rounded-full"
          role="status"
        >
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
    )
    await window.contract.updateShareSelling({
      shareId: shareId,
      timestamp: Date.now().toString(),
    })
    doSuccessAlert("Share has been set for sale!")
    setTimeout(() => {
      location.reload()
    }, 5000)
  }

  useEffect(async () => {
    let shares = await window.contract.getShares({ user: window.accountId })

    const tempArr = []
    for (let i = 0; i < shares.length; i++) {
      const share = shares[i]
      if (share.selling == false) {
        tempArr.push(
          <Card
            disabled={false}
            symbol={share.symbol}
            seller={share.seller}
            available={share.amount}
            label={"Sell"}
            key={globalFunctions.makeid(10)}
            onClick={() => {
              setModalComponent(
                <Modal
                  shareId={share.id}
                  onClick={() => {
                    modalYesClicked(share.id)
                  }}
                />
              )
            }}
          />
        )
      } else {
        tempArr.push(
          <Card
            disabled={true}
            symbol={share.symbol}
            seller={share.seller}
            available={share.amount}
            label={"Selling"}
            key={globalFunctions.makeid(10)}
            onClick={() => {
              console.log("disabled")
            }}
          />
        )
      }
    }
    setShowings(tempArr)
  }, [])

  function customArrow({ type, onClick, isEdge }) {
    function Left() {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          fill="currentColor"
          className="bi bi-arrow-left-circle-fill text-indigo-600 hover:text-indigo-400 transition-all duration-300 cursor-pointer z-10"
          viewBox="0 0 16 16"
        >
          <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0zm3.5 7.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5z" />
        </svg>
      )
    }

    function Right() {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          fill="currentColor"
          className="bi bi-arrow-right-circle-fill text-indigo-600 hover:text-indigo-400 transition-all duration-300 cursor-pointer z-10"
          viewBox="0 0 16 16"
        >
          <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0zM4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z" />
        </svg>
      )
    }

    const pointer = type === consts.PREV ? <Left /> : <Right />
    return (
      <button onClick={onClick} disabled={isEdge}>
        {pointer}
      </button>
    )
  }

  async function mintShareClicked() {
    let privilege = await window.contract.checkAccountPrivilege({
      name: window.accountId,
    })
    if (privilege.type != "company") {
      doAlert()
    } else {
      window.location.href = "/Mint"
    }
  }

  function doAlert() {
    let alertBox = document.getElementById("alertAtSell")
    alertBox.classList.toggle("right-0")
    alertBox.classList.toggle("-right-96")
    setTimeout(() => {
      alertBox.classList.toggle("right-0")
      alertBox.classList.toggle("-right-96")
    }, 4500)
  }

  function doSuccessAlert(text) {
    setSuccessText(text)
    let alertBox = document.getElementById("successAlert")
    alertBox.classList.toggle("right-0")
    alertBox.classList.toggle("-right-96")
    setTimeout(() => {
      alertBox.classList.toggle("right-0")
      alertBox.classList.toggle("-right-96")
    }, 4500)
  }

  function modalYesClicked(shareId) {
    setModalComponent()
    setShareToSelling(shareId)
  }

  function Modal(props) {
    return (
      <div
        id="defaultModal"
        aria-hidden="true"
        style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: "51" }}
        className="flex overflow-y-auto overflow-x-hidden fixed right-0 left-0 top-4 z-50 justify-center items-center h-modal md:h-full md:inset-0 h-full w-full"
      >
        <div className="relative px-4 w-full max-w-2xl h-full md:h-auto">
          <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
            <div className="items-start p-3 rounded-t justify-center text-center">
              <h3 className="text-xl font-semibold text-gray-900 lg:text-2xl dark:text-white m-0 p-0">
                Confirmation
              </h3>
            </div>

            <div className="p-6 space-y-6 flex flex-col justify-center items-center text-center">
              <p className="text-base leading-relaxed text-black dark:text-gray-400">
                Are you sure you want to sell the selected shares?
              </p>
            </div>

            <div className="flex items-center justify-center p-3 space-x-2 rounded-b">
              <button
                data-modal-toggle="defaultModal"
                type="button"
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                onClick={props.onClick}
              >
                Yes
              </button>
              <button
                data-modal-toggle="defaultModal"
                type="button"
                className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:ring-gray-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600"
                onClick={() => {
                  setModalComponent()
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="font-sans w-100 flex flex-row h-100 items-center justify-start overflow-x-hidden overflow-y-hidden">
      {selectedSell}
      {modalComponent}
      {/* <Sidebar /> */}
      <div className="ml-0 lg:ml-60 w-100 h-100 bg-gray-100 flex-col px-4 pb-7 transition-all overflow-y-auto overflow-x-hidden flex-nowrap flex items-center justify-start">
        <h1 className="mt-5 fw-bold">Select to sell</h1>
        <div className="mt-20 w-100 h-80 flex flex-col items-center justify-center flex-wrap">
          <Carousel
            breakPoints={breakPoint}
            pagination={false}
            style={{ width: "100%", height: "100%" }}
            showArrows={true}
            transitionMs={300}
            easing={"ease-in-out"}
            renderArrow={customArrow}
            enableMouseSwipe={false}
          >
            {showings}
          </Carousel>
        </div>
        <h3 className="mt-6 fw-bold">OR</h3>
        <Button
          variant={"primary"}
          className="text-white w-1/2 mt-2 rounded-sm"
          style={{ backgroundColor: "#4f46e5", borderRadius: 10 }}
          onClick={mintShareClicked}
        >
          Mint Share
        </Button>
        <div
          id="alertAtSell"
          className="bg-red-100 border-l-4 border-red-500 text-black p-3 absolute top-6 z-50 transition-all -right-96 duration-500"
          role="alert"
        >
          <p className="font-bold text-red-700 mt-0">Error</p>
          <p className="mb-0">You must be a company in order to mint shares</p>
        </div>
        <div
          id="successAlert"
          className="bg-green-100 border-l-4 border-green-500 text-black p-3 absolute top-6 z-50 transition-all -right-96 duration-500"
          role="alert"
          style={{ zIndex: "101" }}
        >
          <p className="font-bold text-green-700 mt-0">Success</p>
          <p className="mb-0">{successText}</p>
        </div>
      </div>
    </div>
  )
}

export default Sell
