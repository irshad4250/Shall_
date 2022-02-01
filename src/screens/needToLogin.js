import React, { useEffect } from "react"
import { Button } from "react-bootstrap"
import { login, logout } from "../utils"

function NeedToLogin(props) {
  useEffect(() => {
    if (window.accountId) {
      window.location.replace("/")
    }
  }, [])

  return (
    <div className="w-100 h-100 d-flex align-items-center justify-content-flex-start flex-column bg-light ">
      <img className="nearLogo" src={require("../assets/logo-black.svg")} />
      <h1 className="mb-3 fw-bold">Login</h1>
      <p className="lead mb-0 text-center">
        You need to login with your Near wallet in order to use Shall.
      </p>
      <div className="text-sm text-center mb-3 font-semibold">
        Note: If you are a new user you will be redirected to Near wallet for
        account initialization.
      </div>
      <Button variant={"dark"} onClick={handleClick}>
        Login With Near
      </Button>
    </div>
  )

  function handleClick() {
    if (window.accountId) {
      alert("Already logged in")
    } else {
      login()
    }
  }
}

export default NeedToLogin
