import React, { useEffect, useState } from "react"
import Sidebar from "../components/Sidebar"
import Card from "../components/Card"
import Carousel, { consts } from "react-elastic-carousel"
import { Button } from "react-bootstrap"
import * as globalFunctions from "../global/functions"
import { useSearchParams } from "react-router-dom"

const breakPoint = [
  { width: 1, itemsToShow: 1 },
  { width: 256, itemsToShow: 2 },
  { width: 512, itemsToShow: 3 },
  { width: 768, itemsToShow: 4 },
]

function Search() {
  const [autocompleteBox, setAutocompleteBox] = useState()
  const [searchResults, setSearchResults] = useState(
    <div className="w-full h-full flex  items-center justify-center text-xl text-gray-500">
      Search Now!
    </div>
  )

  const [searchParams, setSearchParams] = useSearchParams()
  const [modalComponent, setModalComponent] = useState()

  const [alertMessage, setAlertMessage] = useState("")

  useEffect(() => {
    let transactionHash = searchParams.get("transactionHashes")
    let error = searchParams.get("errorCode")

    if (!error && transactionHash) {
      globalFunctions
        .useReturnsHomeAfterPayment(transactionHash, window.accountId)
        .then((res) => {
          if (res == true) {
            doSuccessAlert()
          }
        })
    } else {
      globalFunctions.getTempsharesNotProceededAndRemove(window.accountId)
    }

    searchParams.delete("transactionHashes")
    searchParams.delete("errorCode")
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

  function handleBuyButtonOnCard(id, seller, symbol, amount) {
    setModalComponent(
      <Modal id={id} seller={seller} symbol={symbol} amount={amount} />
    )
  }

  async function buyOnModal(id, seller, symbol) {
    let amount = document.getElementById("modalAmount").value
    let price = await getTotalPrice(amount, symbol)
    let intAmount = parseInt(amount)

    let nearPrice = await globalFunctions.getNearPrice()
    let priceToPut = price / nearPrice
    priceToPut = priceToPut.toFixed(2)

    globalFunctions.processTransaction(
      intAmount,
      window.accountId,
      seller,
      id,
      priceToPut,
      symbol
    )
  }

  async function getTotalPrice(amount, symbol) {
    return new Promise(async (resolve, reject) => {
      let priceOfSymbol = await globalFunctions.getPrice(symbol)
      priceOfSymbol = parseInt(priceOfSymbol)

      let totalPrice = priceOfSymbol * amount
      resolve(totalPrice)
    })
  }

  function removeModal() {
    setModalComponent()
    setPriceInNear()
  }

  function doSearchAtBackend(symbol) {
    let inputBox = document.getElementById("searchBox")
    inputBox.value = symbol
    setAutocompleteBox()
    window.contract.searchForShare({ symbol: symbol }).then((array) => {
      let tempArr = []

      for (let i = 0; i < array.length; i++) {
        const share = array[i]
        let disabled = false

        if (share.seller == window.accountId) {
          disabled = true
        }

        tempArr.push(
          <Card
            key={globalFunctions.makeid(10)}
            symbol={share.symbol}
            seller={share.seller}
            available={share.amount}
            label={"Buy"}
            onClick={() => {
              handleBuyButtonOnCard(
                share.id,
                share.seller,
                share.symbol,
                share.amount
              )
            }}
            disabled={disabled}
          />
        )
      }

      setSearchResults(tempArr)
      if (tempArr.length == 0) {
        setSearchResults(<div className="text-xl">No Results</div>)
      }
    })
  }

  function handleInputBoxChange() {
    let tempArr = []
    let inputBox = document.getElementById("searchBox")
    let text = inputBox.value
    globalFunctions.getAutocomplete(text).then((quotes) => {
      for (let i = 0; i < quotes.length; i++) {
        const result = quotes[i]
        if (i >= 5) {
          break
        }
        tempArr.push(
          <li
            key={globalFunctions.makeid(8)}
            onClick={() => doSearchAtBackend(result.symbol)}
            className="bg-gray-50 hover:bg-gray-100 cursor-pointer pl-2 h-7 w-full transition-all flex flex-row"
          >
            <div className="font-bold">{result.symbol}</div>
            <div className="ml-2 text-gray-500 text-md">{result.shortname}</div>
          </li>
        )
      }
      console.log(tempArr)
      setAutocompleteBox(tempArr)
    })
  }

  function doSuccessAlert() {
    let alertBox = document.getElementById("successAlert")
    alertBox.classList.toggle("right-0")
    alertBox.classList.toggle("-right-96")
    setTimeout(() => {
      alertBox.classList.toggle("right-0")
      alertBox.classList.toggle("-right-96")
    }, 4500)
  }

  function doAlert(message) {
    setAlertMessage(message)
    let alertBox = document.getElementById("alertAtSell")
    alertBox.classList.toggle("right-0")
    alertBox.classList.toggle("-right-96")
    setTimeout(() => {
      alertBox.classList.toggle("right-0")
      alertBox.classList.toggle("-right-96")
    }, 4500)
  }

  function Modal(props) {
    const [priceInNear, setPriceInNear] = useState()
    const [cancelDisabled, setCancelDisabled] = useState(false)
    const [titleText, setTitleText] = useState("Confirmation")

    async function inputChange() {
      let amount = document.getElementById("modalAmount").value
      amount = parseInt(amount)

      let price = await getTotalPrice(amount, props.symbol)
      let nearPrice = await globalFunctions.getNearPrice()

      let priceToPut = price / nearPrice
      priceToPut = priceToPut.toFixed(2)

      setPriceInNear(priceToPut)
    }

    return (
      <div
        id="defaultModal"
        aria-hidden="true"
        style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        className="flex overflow-y-auto overflow-x-hidden fixed right-0 left-0 top-4 z-50 justify-center items-center h-modal md:h-full md:inset-0 h-full w-full"
      >
        <div className="relative px-4 w-full max-w-2xl h-full md:h-auto">
          <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
            <div className="items-start p-3 rounded-t justify-center text-center">
              <h3 className="text-xl font-semibold text-gray-900 lg:text-2xl dark:text-white m-0 p-0">
                {titleText}
              </h3>
            </div>

            <div className="p-6 space-y-6 flex flex-col justify-center items-center text-center">
              <p className="text-base leading-relaxed text-black dark:text-gray-400">
                How many shares do you want to buy?
              </p>
              <input
                type="number"
                min="1"
                className="form-control block w-50 px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-800 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-indigo-800 focus:outline-none"
                placeholder="Amount"
                id="modalAmount"
                onChange={inputChange}
              />
              <p>Total: {priceInNear} NEAR</p>
            </div>

            <div className="flex items-center justify-center p-3 space-x-2 rounded-b">
              <button
                data-modal-toggle="defaultModal"
                type="button"
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                onClick={() => {
                  if (
                    parseInt(document.getElementById("modalAmount").value) >
                    props.amount
                  ) {
                    doAlert("Entered amount not available")
                    return
                  }

                  setCancelDisabled(true)
                  setTitleText(
                    <div className="flex flex-col justify-center items-center w-100">
                      <div>Processing Transaction...</div>
                      <div
                        className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full mt-1 text-indigo-600"
                        role="status"
                      >
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    </div>
                  )
                  buyOnModal(props.id, props.seller, props.symbol)
                }}
              >
                Buy
              </button>
              <button
                data-modal-toggle="defaultModal"
                type="button"
                className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:ring-gray-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600"
                onClick={removeModal}
                disabled={cancelDisabled}
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
      {/* <Sidebar /> */}
      <div className="ml-0 lg:ml-60 w-100 h-100 bg-gray-100 flex-col px-4 transition-all overflow-y-auto overflow-x-hidden flex-nowrap flex items-center justify-start">
        {modalComponent}
        <div className="flex justify-center mt-5 h-48 z-20">
          <div className="mb-3 xl:w-96">
            <input
              type="search"
              className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-indigo-600 focus:outline-none"
              id="searchBox"
              placeholder="Type Symbol"
              onChange={handleInputBoxChange}
            />
            <ul className="w-full z-30 m-0 p-0 border-2 mt-1 border-indigo-600 rounded-md overflow-hidden bg-white">
              {autocompleteBox}
            </ul>
          </div>
        </div>
        <h1 className="-mt-12 z-10">Buy</h1>
        <div className="mt-6 w-100 h-80 flex flex-col items-center justify-center flex-wrap">
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
            {searchResults}
          </Carousel>
        </div>
        <div
          id="successAlert"
          className="bg-green-100 border-l-4 border-green-500 text-black p-3 absolute top-6 z-50 transition-all -right-96 duration-500"
          role="alert"
        >
          <p className="font-bold text-green-700 mt-0">Success</p>
          <p className="mb-0">Shares has been bought view in dashboard</p>
        </div>
        <div
          id="alertAtSell"
          className="bg-red-100 border-l-4 border-red-500 text-black p-3 absolute top-6 z-50 transition-all -right-96 duration-500"
          role="alert"
        >
          <p className="font-bold text-red-700 mt-0">Error</p>
          <p className="mb-0">{alertMessage}</p>
        </div>
      </div>
    </div>
  )
}

export default Search
