var axios = require("axios").default
import { parseNearAmount } from "near-api-js/lib/utils/format"
const nearAPI = require("near-api-js")
const { connect, keyStores, WalletConnection } = nearAPI
require("dotenv").config()

const YahooApiKey = process.env.YAHOO_API_KEY
const alphavantageApiKey = process.env.APLHAVANTAGE_KEY
const contractId = process.env.CONTRACT_NAME

const config = {
  networkId: "testnet",
  keyStore: new keyStores.BrowserLocalStorageKeyStore(),
  nodeUrl: "https://rpc.testnet.near.org",
  walletUrl: "https://wallet.testnet.near.org",
  helperUrl: "https://helper.testnet.near.org",
  explorerUrl: "https://explorer.testnet.near.org",
}

export async function getData(tag) {
  return new Promise((resolve, reject) => {
    var options = {
      method: "GET",
      url: "https://yh-finance.p.rapidapi.com/market/v2/get-quotes",
      params: { region: "US", symbols: tag },
      headers: {
        "x-rapidapi-host": "yh-finance.p.rapidapi.com",
        "x-rapidapi-key": YahooApiKey,
      },
    }
    axios
      .request(options)
      .then(function (response) {
        resolve(response.data)
      })
      .catch(function (error) {
        reject(error)
      })
  })
}

export async function getPrice(symbol) {
  return new Promise((resolve, reject) => {
    axios
      .get(
        `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${alphavantageApiKey}`
      )
      .then((response) => {
        resolve(response.data["Global Quote"]["05. price"])
      })
  })
}

export async function getChartData(tag) {
  return new Promise((resolve, reject) => {
    var options = {
      method: "GET",
      url: "https://yh-finance.p.rapidapi.com/stock/v2/get-chart",
      params: { interval: "1d", symbol: tag, range: "5d", region: "US" },
      headers: {
        "x-rapidapi-host": "yh-finance.p.rapidapi.com",
        "x-rapidapi-key": YahooApiKey,
      },
    }

    axios
      .request(options)
      .then(function (response) {
        let x = response.data.chart.result[0].timestamp
        let y = response.data.chart.result[0].indicators.quote[0].open
        resolve({ x: x, y: y })
      })
      .catch(function (error) {
        reject(error)
      })
  })
}

export async function getLongChartData(tag) {
  return new Promise((resolve, reject) => {
    var options = {
      method: "GET",
      url: "https://yh-finance.p.rapidapi.com/stock/v2/get-chart",
      params: { interval: "60", symbol: tag, range: "1d", region: "US" },
      headers: {
        "x-rapidapi-host": "yh-finance.p.rapidapi.com",
        "x-rapidapi-key": YahooApiKey,
      },
    }

    axios
      .request(options)
      .then(function (response) {
        let x = response.data.chart.result[0].timestamp
        let y = response.data.chart.result[0].indicators.quote[0].open
        let yHigh = response.data.chart.result[0].indicators.quote[0].high
        let yLow = response.data.chart.result[0].indicators.quote[0].low

        resolve({ x: x, y: y, yHigh: yHigh, yLow: yLow })
      })
      .catch(function (error) {
        reject(error)
      })
  })
}

export async function retrieveNews() {
  return new Promise((resolve, reject) => {
    var options = {
      method: "POST",
      url: "https://yh-finance.p.rapidapi.com/news/v2/list",
      params: { region: "US", snippetCount: "10" },
      headers: {
        "content-type": "text/plain",
        "x-rapidapi-host": "yh-finance.p.rapidapi.com",
        "x-rapidapi-key": YahooApiKey,
      },
      data: '"Pass in the value of uuids field returned right in this endpoint to load the next page, or leave empty to load first page"',
    }

    axios
      .request(options)
      .then(function (response) {
        resolve(response.data.data.main.stream)
      })
      .catch(function (error) {
        reject(error)
      })
  })
}

export function makeid(length) {
  var result = ""
  var characters = "abcdefghijklmnopqrstuvwxyz0123456789"
  var charactersLength = characters.length
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}

export function getAutocomplete(text) {
  console.log(text)
  return new Promise((resolve, reject) => {
    var options = {
      method: "GET",
      url: "https://yh-finance.p.rapidapi.com/auto-complete",
      params: { q: text, region: "US" },
      headers: {
        "x-rapidapi-host": "yh-finance.p.rapidapi.com",
        "x-rapidapi-key": YahooApiKey,
      },
    }

    axios
      .request(options)
      .then(function (response) {
        resolve(response.data.quotes)
      })
      .catch(function (error) {
        reject(error)
      })
  })
}

export async function sendToken(receiver, amount) {
  const near = await connect(config)
  const wallet = new WalletConnection(near)
  await wallet.requestSignIn(window.accountId)
  const walletAccountObj = wallet.account()

  walletAccountObj.sendMoney(receiver, parseNearAmount(amount))
}

export function verifyIfTransactionExists(sender, blockHash) {
  return new Promise(async (resolve, reject) => {
    try {
      const near = await connect(config)
      const response = await near.connection.provider.txStatus(
        blockHash,
        sender
      )
      if (response.transaction.signer_id == sender) {
        resolve(true)
      } else {
        resolve(false)
      }
    } catch {
      resolve(false)
    }
  })
}

export async function getNearPrice() {
  return new Promise((resolve, reject) => {
    axios
      .get("https://api.binance.com/api/v3/ticker/price?symbol=NEARUSDT")
      .then((res) => {
        resolve(res.data.price)
      })
  })
}

export async function processTransaction(
  amount,
  buyer,
  seller,
  shareId,
  priceToTake,
  symbol
) {
  await window.contract.addTempshare({
    shareId: shareId,
    amount: amount,
    buyer: buyer,
    seller: seller,
    symbol: symbol,
    boughtAt: (priceToTake / amount).toString(),
  })

  await sendToken(seller, priceToTake)
}

export function useReturnsHomeAfterPayment(transactionHash, buyer) {
  return new Promise(async (resolve, reject) => {
    console.log(transactionHash)
    //Validating transaction hash
    let confirm = await verifyIfTransactionExists(buyer, transactionHash)
    if (!confirm) return

    //Checks if using a used transaction hash
    let isTransactionDone = await window.contract.getTransactionStatus({
      id: transactionHash,
    })
    if (isTransactionDone) return

    //Validation finished
    let transaction = await window.contract.getUserTempshares({ user: buyer })
    transaction = transaction[0]
    if (!transaction) return
    console.log(transaction)

    //TRANSFER SHARES
    console.log("calling function")
    await window.account.functionCall({
      contractId: contractId,
      methodName: "transferShares",
      args: {
        seller: transaction.seller,
        buyer: transaction.buyer,
        symbol: transaction.symbol,
        amount: transaction.amount,
        transactionHash: transactionHash,
        transactionId: transaction.id,
        boughtAt: transaction.boughtAt,
        timestamp: Date.now().toString(),
      },
      gas: "300000000000000",
    })

    console.log("finided")
    resolve(true)
  })
}

export async function getTempsharesNotProceededAndRemove(user) {
  //If a transaction has not gone through but payment has been done we do it here
  let temp = await window.contract.getUserTempshares({ user: user })

  if (!temp || temp.length === 0) return
  if (temp[0].processed == false) {
    handleTransactionNoProcessed(temp[0].id)
    return
  }
  if (!temp[0].transactionHash) {
    window.contract.removeTempshare({ id: temp[0].id })
    return
  }
}

//Basically the same as processing transaction
function handleTransactionNoProcessed(tempShareId) {
  return new Promise(async (resolve, reject) => {
    let transaction = await window.contract.getTempshareById({
      id: tempShareId,
    })

    if (!transaction.transactionHash) {
      await window.contract.removeTempshare({ id: tempShareId })
      return
    }

    await window.account.functionCall({
      contractId: contractId,
      methodName: "transferShares",
      args: {
        seller: transaction.seller,
        buyer: transaction.buyer,
        symbol: transaction.symbol,
        amount: transaction.amount,
        transactionHash: transactionHash,
        transactionId: transaction.id,
        boughtAt: transaction.boughtAt,
        timestamp: Date.now().toString(),
      },
      gas: "300000000000000",
    })
    resolve(true)
  })
}

export function calculateAmountOfTimeFromTimeStamp(timestamp) {
  if (timestamp == "null") return "Less than 1 minute"
  let dateHere = new Date(parseInt(timestamp))
  let dateNow = new Date()

  let dateDifference = dateNow - dateHere

  let dateDifferenceInMinutes = dateDifference / (1000 * 60)
  let dateDifferenceInHours = dateDifference / (1000 * 60 * 60)
  let dateDifferenceInDays = dateDifference / (1000 * 60 * 60 * 24)
  let dateDifferenceInWeeks = dateDifference / (1000 * 60 * 60 * 24 * 7)
  let dateDifferenceInMonths = dateDifference / (1000 * 60 * 60 * 24 * 30)
  let dateDifferenceInYears = dateDifference / (1000 * 60 * 60 * 24 * 365)

  dateDifferenceInHours = parseInt(dateDifferenceInHours)
  dateDifferenceInMinutes = parseInt(dateDifferenceInMinutes)
  dateDifferenceInDays = parseInt(dateDifferenceInDays)
  dateDifferenceInWeeks = parseInt(dateDifferenceInWeeks)
  dateDifferenceInMonths = parseInt(dateDifferenceInMonths)
  dateDifferenceInYears = parseInt(dateDifferenceInYears)

  if (dateDifferenceInYears > 0 && dateDifferenceInMonths > 11) {
    let tag = " Year"
    dateDifferenceInYears > 1 ? (tag = tag + "s") : (tag = tag)
    return dateDifferenceInYears + tag
  } else if (dateDifferenceInMonths > 0) {
    let tag = " Month"
    dateDifferenceInMonths > 1 ? (tag = tag + "s") : (tag = tag)
    return dateDifferenceInMonths + tag
  } else if (dateDifferenceInWeeks > 0) {
    let tag = " Week"
    dateDifferenceInWeeks > 1 ? (tag = tag + "s") : (tag = tag)
    return dateDifferenceInWeeks + tag
  } else if (dateDifferenceInDays > 0) {
    let tag = " Day"
    dateDifferenceInDays > 1 ? (tag = tag + "s") : (tag = tag)
    if (dateDifferenceInDays == 1) {
      tag = "Yesterday"
      return tag
    } else {
      return dateDifferenceInDays + tag
    }
  } else if (dateDifferenceInHours > 0) {
    let tag = " Hour"

    if (dateDifferenceInHours < 12) {
      let hours
      let minutes
      dateHere.getHours() < 10
        ? (hours = "0" + dateHere.getHours().toString())
        : (hours = dateHere.getHours().toString())
      dateHere.getMinutes() < 10
        ? (minutes = "0" + dateHere.getMinutes().toString())
        : (minutes = dateHere.getMinutes().toString())
      return hours + ":" + minutes
    } else {
      dateDifferenceInHours > 1 ? (tag = tag + "s") : (tag = tag)
      return dateDifferenceInHours.toString() + tag
    }
  } else if (dateDifferenceInMinutes > 0) {
    let tag = " Minute"
    dateDifferenceInMinutes > 1 ? (tag = tag + "s") : (tag = tag)
    return dateDifferenceInMinutes + tag
  } else {
    return "Less than 1 Minute"
  }
}
