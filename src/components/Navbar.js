import React from "react"
import { Navbar, Container, NavDropdown, Nav } from "react-bootstrap"
import { logout } from "../utils"

function MyNavbar(props) {
  return (
    <>
      <Navbar bg="dark" expand="lg" variant="dark" className="w-100">
        <Container>
          <Navbar.Brand href="/">Shall</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="/">Home</Nav.Link>
              <Nav.Link href="/search">Search</Nav.Link>
              <Nav.Link href="/dashboard">Dashboard</Nav.Link>
              <NavDropdown title="More" id="basic-nav-dropdown">
                <NavDropdown.Item href="/Shares">My Shares</NavDropdown.Item>
                <NavDropdown.Item href="/AccountInfo">
                  Account Info
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item
                  onClick={() => {
                    logout()
                    window.location.replace("/login")
                  }}
                >
                  Logout
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
            <Nav>
              <Navbar.Text className="text-light">
                Account: {window.accountId}
              </Navbar.Text>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  )
}

export default MyNavbar
