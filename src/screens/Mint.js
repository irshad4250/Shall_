import React, { useEffect, useState } from "react"
import Sidebar from "../components/Sidebar"
import * as globalFunctions from "../global/functions"

function Mint(props) {
  const [autocompleteBox, setAutocompleteBox] = useState()
  const [chosenSymbol, setChosenSymbol] = useState("")
  const [searchBoxDisabled, setSearchBoxDisabled] = useState(false)
  const [modalComponent, setModalComponent] = useState()

  useEffect(() => {
    window.contract
      .checkAccountPrivilege({ name: window.accountId })
      .then((account) => {
        if (account.type != "company") {
          window.location.replace("/")
        }
      })
  }, [])

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
            onClick={() => {
              setSymbolFunction(result.symbol)
              setAutocompleteBox()
            }}
            className="bg-gray-50 hover:bg-gray-100 cursor-pointer pl-2 h-7 w-full transition-all flex flex-row overflow-hidden"
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

  function setSymbolFunction(symbol) {
    document.getElementById("searchBox").value = symbol
    setChosenSymbol(symbol)
    setSearchBoxDisabled(true)
  }

  function mintButtonClicked() {
    if (!chosenSymbol || !document.getElementById("amountBox").value) return
    setModalComponent(
      <Modal amount={parseInt(document.getElementById("amountBox").value)} />
    )
  }

  function removeModal() {
    setModalComponent()
  }

  async function addShares(amount) {
    await window.contract.addShares({
      amount: amount,
      seller: window.accountId,
      symbol: chosenSymbol,
      boughtAt: "null",
    })

    window.location.replace("/")
  }

  function Modal(props) {
    const [cancelDisabled, setCancelDisabled] = useState(false)
    const [titleText, setTitleText] = useState("Confirmation")

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
                Are you sure you want to Mint {props.amount} of {chosenSymbol}{" "}
                shares?
              </p>
            </div>

            <div className="flex items-center justify-center p-3 space-x-2 rounded-b">
              <button
                data-modal-toggle="defaultModal"
                type="button"
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                onClick={() => {
                  setCancelDisabled(true)
                  setTitleText(
                    <div className="flex flex-col justify-center items-center w-100">
                      <div>Minting Shares...</div>
                      <div
                        className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full mt-1 text-indigo-600"
                        role="status"
                      >
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    </div>
                  )
                  addShares(props.amount)
                }}
              >
                Yes
              </button>
              <button
                data-modal-toggle="defaultModal"
                type="button"
                className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:ring-gray-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600"
                onClick={removeModal}
                disabled={cancelDisabled}
              >
                No
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="font-sans w-100 flex flex-row h-100 items-center justify-start">
      {/* <Sidebar /> */}
      <div className="ml-0 lg:ml-60 w-100 h-100 bg-gray-100 bg-light px-4 transition-all overflow-hidden flex-wrap">
        <div className="h-screen flex justify-center items-center">
          <div className="w-full max-w-xs bg-white flex flex-col py-4 px-8 rounded-lg shadow-lg">
            <div className="font-bold text-2xl w-full text-center">
              Mint Share
            </div>
            <label className="text-gray-700 font-bold py-2">Symbol</label>
            <div className="flex flex-col items-center justify-start">
              <input
                className="text-gray-700 w-full shadow-sm border rounded border-gray-300 focus:outline-none focus:shadow-outline py-1 px-3 mb-0"
                type="text"
                placeholder="Symbol"
                id="searchBox"
                onChange={handleInputBoxChange}
                disabled={searchBoxDisabled}
              />
              <ul className="w-full z-30 m-0 p-0 mt-1 rounded-md overflow-hidden bg-white">
                {autocompleteBox}
              </ul>
            </div>
            <label className="text-gray-700 font-bold py-2">Amount</label>
            <input
              className="text-gray-700 shadow-sm border rounded border-gray-300 mb-3 py-1 px-3 focus:outline-none focus:shadow-outline"
              type="number"
              placeholder="Amount"
              min="0"
              id="amountBox"
            />
            <div className="flex justify-center items-center my-4 w-100">
              <button
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded py-2 px-4"
                onClick={mintButtonClicked}
              >
                Mint Now
              </button>
            </div>
          </div>
        </div>
        {modalComponent}
      </div>
    </div>
  )
}

export default Mint

// autocomplete <li className="bg-gray-200 hover:bg-gray-100 cursor-pointer pl-2 h-7 w-full transition-all flex flex-row">
// <div className="font-bold">AAPL</div>
// <div className="ml-2 text-gray-500 text-md">APLE</div>
// </li>
