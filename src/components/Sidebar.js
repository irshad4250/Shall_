import React, { useEffect, useState } from "react"
import { logout } from "../utils"

function Sidebar() {
  const [accountType, setAccountType] = useState()

  useEffect(() => {
    window.contract
      .checkAccountPrivilege({ name: window.accountId })
      .then((acc) => {
        if (!acc) {
          return
        }
        setAccountType(acc.type)
      })
  }, [])

  function handleMenuClick() {
    let bar = document.getElementById("sideBar")
    let menu = document.getElementById("menuBar")

    if (bar.style.left != "0px") {
      bar.style.left = "0px"
      menu.style.left = "248px"
    } else {
      bar.style.left = "-240px"
      menu.style.left = "8px"
    }
  }

  function Menu() {
    return (
      <div
        onClick={handleMenuClick}
        id="menuBar"
        className="aspect-square transition-all rounded-xl bg-indigo-700 hover:bg-indigo-500 absolute left-2 bottom-2 lg:left-0 lg:hidden items-center justify-center p-2 flex z-50"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="25"
          height="25"
          fill="currentColor"
          className="bi bi-list text-white"
          viewBox="0 0 16 16"
        >
          <path
            fillRule="evenodd"
            d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"
          />
        </svg>
      </div>
    )
  }

  return (
    <>
      <Menu />
      <div
        id="sideBar"
        className="h-100 p-3 space-y-2 w-60 bg-indigo-700 text-white transition-all fixed -left-60 lg:left-0 z-50 top-0"
      >
        <div className="flex items-center justify-center p-2 space-x-4 w-100 flex-col">
          <h2 className="text-lg font-semibold">{window.accountId}</h2>
          <h4 className="text-sm m-0">@{accountType}</h4>
        </div>
        <div className="divide-y divide-coolGray-700">
          <ul className="pt-2 pb-4 space-y-1 text-sm">
            <li>
              <a
                href="/"
                className="w-75 flex items-center p-2 space-x-3 rounded-md no-underline text-current hover:text-current hover:bg-indigo-600 transition-all duration-300"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                  className="w-5 h-5"
                >
                  <path
                    fill="#fff"
                    d="M469.666,216.45,271.078,33.749a34,34,0,0,0-47.062.98L41.373,217.373,32,226.745V496H208V328h96V496H480V225.958ZM248.038,56.771c.282,0,.108.061-.013.18C247.9,56.832,247.756,56.771,248.038,56.771ZM448,464H336V328a32,32,0,0,0-32-32H208a32,32,0,0,0-32,32V464H64V240L248.038,57.356c.013-.012.014-.023.024-.035L448,240Z"
                  ></path>
                </svg>
                <span>Home</span>
              </a>
            </li>
            <li className="dark:bg-coolGray-800 dark:text-coolGray-50">
              <a
                href="/Dashboard"
                className="w-75 flex items-center p-2 space-x-3 rounded-md no-underline text-current hover:text-current hover:bg-indigo-600 transition-all duration-300"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                  className="w-5 h-5 fill-white "
                >
                  <path
                    fill="#fff"
                    d="M68.983,382.642l171.35,98.928a32.082,32.082,0,0,0,32,0l171.352-98.929a32.093,32.093,0,0,0,16-27.713V157.071a32.092,32.092,0,0,0-16-27.713L272.334,30.429a32.086,32.086,0,0,0-32,0L68.983,129.358a32.09,32.09,0,0,0-16,27.713V354.929A32.09,32.09,0,0,0,68.983,382.642ZM272.333,67.38l155.351,89.691V334.449L272.333,246.642ZM256.282,274.327l157.155,88.828-157.1,90.7L99.179,363.125ZM84.983,157.071,240.333,67.38v179.2L84.983,334.39Z"
                  ></path>
                </svg>
                <span>Dashboard</span>
              </a>
            </li>
            <li className="dark:bg-coolGray-800 dark:text-coolGray-50">
              <a
                href="/Sell"
                className="w-75 flex items-center p-2 space-x-3 rounded-md no-underline text-current hover:text-current hover:bg-indigo-600 transition-all duration-300"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  fill="currentColor"
                  className="bi bi-cash-stack"
                  viewBox="0 0 16 16"
                >
                  <path d="M1 3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1H1zm7 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />
                  <path d="M0 5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1V5zm3 0a2 2 0 0 1-2 2v4a2 2 0 0 1 2 2h10a2 2 0 0 1 2-2V7a2 2 0 0 1-2-2H3z" />
                </svg>
                <span>Sell</span>
              </a>
            </li>
            <li>
              <a
                href="/Search"
                className="w-75 flex items-center p-2 space-x-3 rounded-md no-underline text-current hover:text-current hover:bg-indigo-600 transition-all duration-300"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                  className="w-5 h-5"
                >
                  <path
                    fill="#fff"
                    d="M479.6,399.716l-81.084-81.084-62.368-25.767A175.014,175.014,0,0,0,368,192c0-97.047-78.953-176-176-176S16,94.953,16,192,94.953,368,192,368a175.034,175.034,0,0,0,101.619-32.377l25.7,62.2L400.4,478.911a56,56,0,1,0,79.2-79.195ZM48,192c0-79.4,64.6-144,144-144s144,64.6,144,144S271.4,336,192,336,48,271.4,48,192ZM456.971,456.284a24.028,24.028,0,0,1-33.942,0l-76.572-76.572-23.894-57.835L380.4,345.771l76.573,76.572A24.028,24.028,0,0,1,456.971,456.284Z"
                  ></path>
                </svg>
                <span>Search</span>
              </a>
            </li>
          </ul>
          <ul className="pt-4 pb-2 space-y-1 text-sm">
            <li>
              <a
                href="/Notifications"
                className="w-75 flex items-center p-2 space-x-3 rounded-md no-underline text-current hover:text-current hover:bg-indigo-600 transition-all duration-300"
              >
                {/* <img className="w-5" src={require("../assets/notification.png")} /> */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  fill="currentColor"
                  className="bi bi-bell"
                  viewBox="0 0 16 16"
                >
                  <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2zM8 1.918l-.797.161A4.002 4.002 0 0 0 4 6c0 .628-.134 2.197-.459 3.742-.16.767-.376 1.566-.663 2.258h10.244c-.287-.692-.502-1.49-.663-2.258C12.134 8.197 12 6.628 12 6a4.002 4.002 0 0 0-3.203-3.92L8 1.917zM14.22 12c.223.447.481.801.78 1H1c.299-.199.557-.553.78-1C2.68 10.2 3 6.88 3 6c0-2.42 1.72-4.44 4.005-4.901a1 1 0 1 1 1.99 0A5.002 5.002 0 0 1 13 6c0 .88.32 4.2 1.22 6z" />
                </svg>
                <span>Notifications</span>
              </a>
            </li>
            <li>
              <a
                href="/AccountInfo"
                className="w-75 flex items-center p-2 space-x-3 rounded-md no-underline text-current hover:text-current hover:bg-indigo-600 transition-all duration-300"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="#fff"
                  className="bi bi-wallet2"
                  viewBox="0 0 16 16"
                >
                  <path d="M12.136.326A1.5 1.5 0 0 1 14 1.78V3h.5A1.5 1.5 0 0 1 16 4.5v9a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 13.5v-9a1.5 1.5 0 0 1 1.432-1.499L12.136.326zM5.562 3H13V1.78a.5.5 0 0 0-.621-.484L5.562 3zM1.5 4a.5.5 0 0 0-.5.5v9a.5.5 0 0 0 .5.5h13a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-13z" />
                </svg>
                <span>Wallet Info</span>
              </a>
            </li>
            <li>
              <a
                onClick={logout}
                className="w-75 flex items-center p-2 space-x-3 rounded-md no-underline text-current hover:text-current hover:bg-indigo-600 transition-all duration-300 cursor-pointer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="#fff"
                  className="bi bi-box-arrow-right"
                  viewBox="0 0 16 16"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0v2z"
                  />
                  <path
                    fillRule="evenodd"
                    d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z"
                  />
                </svg>
                <span>Logout</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </>
  )
  //hover
}

export default Sidebar
