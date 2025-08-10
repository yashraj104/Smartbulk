import React from "react";
import { Link } from "react-router-dom";
import { Navbar, Nav, Container, Button } from "react-bootstrap";

function NavbarComp({ darkMode, setDarkMode }) {
  return (
    <Navbar bg={darkMode ? "dark" : "light"} variant={darkMode ? "dark" : "light"} expand="lg" sticky="top" className="shadow-sm">
      <Container>
        <Navbar.Brand as={Link} to="/">SmartBulk</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            <Nav.Link as={Link} to="/workout">Workout</Nav.Link>
            <Nav.Link as={Link} to="/diet">Diet</Nav.Link>
            <Nav.Link as={Link} to="/progress">Progress</Nav.Link>
            <Nav.Link as={Link} to="/exercises">Exercises</Nav.Link>
            <Nav.Link as={Link} to="/macros">Macros</Nav.Link>
            <Nav.Link as={Link} to="/community">Community</Nav.Link>
            <Nav.Link as={Link} to="/challenges">Challenges</Nav.Link>
            <Nav.Link as={Link} to="/trainers">Trainers</Nav.Link>
            <Nav.Link as={Link} to="/coach">AI Coach</Nav.Link>
            <Nav.Link as={Link} to="/settings">Settings</Nav.Link>
          </Nav>
          <Button variant={darkMode ? "outline-light" : "outline-dark"} onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? "Light Mode" : "Dark Mode"}
          </Button>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavbarComp;
