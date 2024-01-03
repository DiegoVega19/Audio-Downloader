import React, { Component } from "react";
import axios from "axios";
import "./App.css";
import { Container, Row, Button, Input, Form, Col, Progress } from "reactstrap";

const URL = "http://127.0.0.1:5000";

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      urlText: "",
      dataDownloaded: 0,
      blobData: null,
      videoName: "",
    };
  }

  handleSubmit = (e) => {
    e.preventDefault();

    axios
      .post(`/api`, { url: this.state.urlText }, { responseType: "blob" })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));

        // Extract video name from Content-Disposition header
        const contentDisposition = response.headers["content-disposition"];
        const videoNameMatch = contentDisposition.match(/filename="(.+?)"/);
        const videoName = videoNameMatch ? videoNameMatch[1] : "audio";

        this.setState({
          blobData: url,
          videoName,
        });

        // Trigger download
        const a = document.createElement("a");
        a.href = url;
        a.download = `${videoName}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      })
      .catch((error) => {
        console.error("Error during download:", error);
        // Handle errors and update state accordingly
      });
  };

  handleTextChange = (e) => {
    this.setState({ urlText: e.target.value });
  };

  render() {
    return (
      <Container>
        <Form onSubmit={(e) => this.handleSubmit(e)}>
          <Row>
            <Col>
              <Input
                required
                type="text"
                placeholder="URL"
                value={this.state.urlText}
                onChange={(e) => this.handleTextChange(e)}
              ></Input>
            </Col>
          </Row>
          <Row style={{ textAlign: "center", marginTop: "10px" }}>
            <Col>
              <Button type="submit" color="primary" size="lg">
                Start Process
              </Button>
            </Col>
          </Row>
        </Form>

        <Row>
          <Col>
            {this.state.videoName !== "" ? (
              <h1>Title: {this.state.videoName}</h1>
            ) : (
              ""
            )}
          </Col>
        </Row>

       
      </Container>
    );
  }
}
