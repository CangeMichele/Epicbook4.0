//----- Componenti react
import React from "react";
//----- Componenti react-bootstrap
import { Container, Row, Col, Button, Form } from "react-bootstrap";

// ----- Stilizzazione
import "bootstrap/dist/css/bootstrap.min.css";
import {
  FaFacebook,
  FaTwitter,
  FaGoogle,
  FaInstagram,
  FaLinkedin,
  FaGithub,
} from "react-icons/fa";



// ----- MyFooter.jsx
export default function MyFooter() {
  return (
    <footer className="bg-dark text-white text-center text-lg-start">
      <Container className="p-4">
        <Row>
          <Col>
            {/* Social */}
            <Button
              variant="outline-light"
              className="btn-floating m-1"
              href="#!"
              role="button"
            >
              <FaFacebook />
            </Button>
            <Button
              variant="outline-light"
              className="btn-floating m-1"
              href="#!"
              role="button"
            >
              <FaTwitter />
            </Button>
            <Button
              variant="outline-light"
              className="btn-floating m-1"
              href="#!"
              role="button"
            >
              <FaGoogle />
            </Button>
            <Button
              variant="outline-light"
              className="btn-floating m-1"
              href="#!"
              role="button"
            >
              <FaInstagram />
            </Button>
            <Button
              variant="outline-light"
              className="btn-floating m-1"
              href="#!"
              role="button"
            >
              <FaLinkedin />
            </Button>
            <Button
              variant="outline-light"
              className="btn-floating m-1"
              href="#!"
              role="button"
            >
              <FaGithub />
            </Button>
          </Col>
          <Col className="col-8">
            {/* Form */}

            <Form action="">
              <Row>
                <Col auto>
                  <p className="pt-2">
                    <strong>Iscriviti alla nostra newsletter</strong>
                  </p>
                </Col>
                <Col md={5} className="col-12">
                  <Form.Group className="form-outline form-white mb-4">
                    <Form.Control
                      type="email"
                      id="form5Example2"
                      placeholder="Indirizzo email"
                    />
                  </Form.Group>
                </Col>
                <Col auto>
                  <Button
                    variant="outline-light"
                    className="mb-4"
                    type="submit"
                  >
                    Iscriviti
                  </Button>
                </Col>
              </Row>
            </Form>
          </Col>
        </Row>
        {/* Copyright */}
        <Row className="text-center">
          <Col>
            © 2024 Copyright:
            <a className="text-white ms-2" href="#">
              {" "}
              EpicBook.com
            </a>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}
