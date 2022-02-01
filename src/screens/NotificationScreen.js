import React, { useState, useEffect } from "react"
import Sidebar from "../components/Sidebar"
import Notification from "../components/Notification"

function NotificationScreen(props) {
  const [notificationBox, setNotificationBox] = useState(
    <div className="h-full w-full flex items-center justify-center">
      <div
        className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full mt-1 text-indigo-600"
        role="status"
      >
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  )

  useEffect(() => {
    window.contract
      .getNotification({ user: window.accountId })
      .then((notifArr) => {
        const tempArr = []
        for (let i = notifArr.length - 1; i >= 0; i--) {
          const notification = notifArr[i]

          tempArr.push(
            <Notification
              info={notification.info}
              timestamp={notification.timestamp}
            />
          )
        }
        if (tempArr.length == 0) {
          setNotificationBox(
            <div className="w-full text-left font-bold pt-2 text-xl">
              No Notifications
            </div>
          )
          return
        }
        setNotificationBox(tempArr)
      })
  }, [])

  return (
    <div className="font-sans w-100 flex flex-row h-100 items-center justify-start">
      {/* <Sidebar /> */}
      <div className="ml-0 lg:ml-60 w-100 h-100 bg-light px-2 transition-all overflow-y-auto overflow-x-hidden flex-wrap flex flex-col justify-center items-center">
        <div className="flex flex-col items-center justify-start w-1/2 h-full">
          <div className="flex flex-row items-baseline justify-start pt-2 w-full">
            <div className="text-4xl fontStyleTitle text-indigo-800">Shall</div>
            <div className="ml-4 font-sans text-xl text-gray-500">
              Notifications
            </div>
          </div>
          {notificationBox}
        </div>
      </div>
    </div>
  )
}

export default NotificationScreen
