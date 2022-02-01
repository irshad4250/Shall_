import { Context, logging, storage, ContractPromiseBatch, PersistentUnorderedMap,math, MapEntry, u128 } from 'near-sdk-as'
const sharesMap = new PersistentUnorderedMap<i32,Shares>("shares")
const accountMap = new PersistentUnorderedMap<string,Account>("accounts")
const transactionMap = new PersistentUnorderedMap<string,Transaction>("transactions")
const temporaryShare = new PersistentUnorderedMap<i32,Tempshare>("willTransactions")
const NotificationsMap = new PersistentUnorderedMap<i32,Notification>("notifications")

//Shares 
@nearBindgen
class Shares{

  symbol:string
  amount:i32
  seller:string
  id:i32
  selling:boolean
  boughtAt:string

  constructor(symbol:string,amount:i32,seller:string,boughtAt:string) {
    this.id = math.hash32<string>(seller+symbol)
    this.amount = amount
    this.seller = seller
    this.symbol = symbol
    this.selling = false
    this.boughtAt = boughtAt
  }
}

export function addShares(symbol:string,amount:i32,seller:string,boughtAt:string):void{
  let shareToInsert = new Shares(symbol,amount,seller,boughtAt)
  logging.log(shareToInsert)
  sharesMap.set(shareToInsert.id,shareToInsert)

  let notifInfo =  amount.toString() + " " + symbol + " shares have been added to your account." 
  setNotification(notifInfo,"Shall","seller","null")
}

export function getShares(user:string):Shares[]{
  let shares = sharesMap.values(0,1000)

  let toReturn:Shares[] = []

  for (let i = 0; i < shares.length; i++) {
    const share = shares[i];

    if(share.seller == user && share.amount > 0) {
      toReturn.push(share)
    }
    
  }
  return toReturn

}

export function verifyIfUserAlreadyHasShare(seller:string,symbol:string):i32{

  let shares = sharesMap.values(0,1000)

  for(let i = 0; i < shares.length; i++){
    let share = shares[i]

    if(share.seller == seller && share.symbol == symbol){
      return share.id
    }

  }
  return 0
}

export function getLastShares(): MapEntry<i32,Shares>[]{
  return sharesMap.last(3)
}

export function searchForShare(symbol:string):Shares[]{

  let shares = sharesMap.values(0,1000)
  let toReturn : Shares[] = []

  for(let i = 0; i < shares.length; i++){
    let share = shares[i]

    if(share.symbol == symbol && share.amount > 0 &&share.selling == true){
      toReturn.push(share)
    }

  }

  return toReturn

}

export function checkIfAmountIfEligible(shareId:i32,amount:i32):boolean{
  let share = sharesMap.getSome(shareId)
  if(share.amount < amount){
    return false
  }else{
    return true
  }
}

export function transferShares(seller:string,buyer:string,symbol:string,amount:i32,transactionId:i32,transactionHash:string,boughtAt:string,timestamp:string):void{

  addTransaction(buyer,seller,transactionHash,transactionId)
  
  injectTransactionHash(transactionId,transactionHash)

  let shareId = verifyIfUserAlreadyHasShare(buyer,symbol)
  let sellerShareId = verifyIfUserAlreadyHasShare(seller,symbol)

  if(shareId != 0){

    let share = sharesMap.getSome(shareId)
    share.amount =  share.amount + amount
    if(!share.boughtAt){
      share.boughtAt = boughtAt
    }
    sharesMap.set(shareId,share)
  

  }else{

    addShares(symbol,amount,buyer,boughtAt)

  }

  let sellerShare = sharesMap.getSome(sellerShareId)
  sellerShare.amount = sellerShare.amount - amount 
  sharesMap.set(sellerShareId,sellerShare)

  let notifInfo = buyer + " bought " + amount.toString() +  " " + symbol + " shares."
  setNotification(notifInfo,buyer,seller,timestamp)

  let notifInfoToBuyer = amount.toString() + " " + symbol + " shares have been added to your account!"
  setNotification(notifInfoToBuyer,seller,buyer,timestamp)

  updateTransaction(transactionHash)
  updateTempshare(transactionId)

}

export function getAllShares():Shares[]{
  return sharesMap.values(0,1000)
}

export function getTotalShares():i32{
  let allShare = sharesMap.values(0,1000)

  let total:i32 = 0

  for (let i = 0; i < allShare.length; i++) {
    const share = allShare[i];
    
    total = total + share.amount

  }

  return total

}

export function updateShareSelling(shareId:i32,timestamp:string):void{

  let share = sharesMap.getSome(shareId)
  share.selling = true
  sharesMap.set(shareId,share)

  let info = share.amount.toString() + " "  + share.symbol + " shares have been listed for sale." 
  setNotification(info,"Shall",Context.sender,timestamp)

}

export function getMostShare():Shares{

  let allShare = sharesMap.values(0,1000)
  let most = 0
  let mostObject: Shares[] = []


  for (let i = 0; i < allShare.length; i++) {
    const share = allShare[i];
    
    if(share.amount > most ){

      most = share.amount
      mostObject[0] = share

    }

  }

  return mostObject[0]

}

//Account
@nearBindgen
class Account{

  name:string
  type:string

  constructor(name:string,type:string){
    this.name = name
    this.type = type
  }

}

export function addAccount(name:string,type:string):void{

  let acc = new Account(name,type)
  accountMap.set(name,acc)

}

export function checkAccountPrivilege(name:string): Account|null{

  if(accountMap.contains(name)){
    let account = accountMap.getSome(name)
    return account
  }else{
    return null
  }

}

export function getAllAccs(): Account[]{

  return accountMap.values(0,1000)

}

export function getNoOfUser(): number{
  return accountMap.values(0,1000).length
}

export function getNoOfCompanies():number{

  let allAccs = accountMap.values(0,1000)

  let toReturn:Account[] = []

  for (let i = 0; i < allAccs.length; i++) {
    const acc = allAccs[i];
    if(acc.type == 'company'){
      toReturn.push(acc)
    }
  }

  return toReturn.length

}



//Transactions
@nearBindgen
class Transaction{

  sender:string
  receiver:string
  id:string
  done:boolean
  tempShareId:i32

  constructor(sender:string,receiver:string,id:string,tempShareId:i32){
    this.sender = sender
    this.receiver = receiver
    this.id = id
    this.done = false
    this.tempShareId = tempShareId
  }

}

export function addTransaction(sender:string,receiver:string,id:string,tempShareId:i32):void{

  let transaction = new Transaction(sender,receiver,id,tempShareId)
  transactionMap.set(transaction.id,transaction)

}

export function getTransactionStatus(id:string):boolean{

  if(!transactionMap.contains(id)) return false
  let transaction = transactionMap.getSome(id)
  return transaction.done

}

export function updateTransaction(id:string):void{

  let transaction = transactionMap.getSome(id)
  transaction.done = true
  transactionMap.set(id,transaction)

}

export function getAllTransactions():Transaction[]{
  return transactionMap.values(0,1000)
}

//Temp
@nearBindgen
class Tempshare{

  id:i32
  amount:i32
  buyer:string
  seller:string
  shareId:i32
  symbol:string
  processed:boolean
  boughtAt:string
  transactionHash: string

  constructor(shareId:i32,amount:i32,buyer:string,seller:string,symbol:string,boughtAt:string){

    this.shareId = shareId
    this.id = math.hash32<string>(buyer + shareId.toString()) 
    this.amount = amount
    this.buyer = buyer
    this.seller = seller
    this.symbol = symbol
    this.processed = false
    this.transactionHash = ""
    this.boughtAt = boughtAt
  }


}

export function addTempshare(shareId:i32,amount:i32,buyer:string,seller:string,symbol:string,boughtAt:string):void{

  let tempshare = new Tempshare(shareId,amount,buyer,seller,symbol,boughtAt)
  temporaryShare.set(tempshare.id,tempshare)

}

export function removeTempshare(id:i32):void{

  temporaryShare.delete(id)

}

export function getTempshares(buyer:string):Tempshare|null{

  let values = temporaryShare.values(0,1000)

  for (let i = 0; i < values.length; i++) {
    const element = values[i];
    if(element.buyer == buyer){
      return element
    }
  }

  return null

}

export function getAllTempTransactions():Tempshare[]{
  return temporaryShare.values(0,1000)
}

export function updateTempshare(id:i32):void{
  let tempShare = temporaryShare.getSome(id);
  tempShare.processed = true
  temporaryShare.set(id,tempShare)
}

export function getUserTempshares(user:string):Tempshare[]{

  let allTemp = temporaryShare.values(0,1000)
  let toReturn:Tempshare[] = []
  for (let i = 0; i < allTemp.length; i++) {
    const share = allTemp[i];
    if(share.buyer == user && share.processed == false){
      toReturn.push(share)
    }
  }

  return toReturn

}

export function getTempshareById(id:i32):Tempshare{
  return temporaryShare.getSome(id)
}

export function injectTransactionHash(id:i32,transactionHash:string):void{
  let tempShare = temporaryShare.getSome(id)
  tempShare.transactionHash = transactionHash
  temporaryShare.set(id,tempShare)
}

//Notifications
@nearBindgen
class Notification{
  
  info:string;
  sentBy:string;
  sentTo:string;
  id:i32
  timestamp:string
  read:boolean

  constructor(info:string,sentBy:string,sentTo:string,timestamp:string){
    this.info = info
    this.sentBy = sentBy
    this.sentTo = sentTo
    this.id = math.hash32<string>(sentBy+info+sentTo);
    this.timestamp = timestamp
    this.read = false
  }

}

export function setNotification(info:string,sentBy:string,sentTo:string,timestamp:string):void{
  let notification = new Notification(info,sentBy,sentTo,timestamp)
  NotificationsMap.set(notification.id,notification)
}

export function getNotification(user:string):Notification[]{

  let allNotif = NotificationsMap.values(0,1000)
  let toReturn:Notification[] = []


  for (let i = 0; i < allNotif.length; i++) {
    const notif = allNotif[i];
    
    if(notif.sentTo == user){
      toReturn.push(notif)
    }

  }

  return toReturn

}