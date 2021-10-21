import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { io } from "socket.io-client";
import "./Join.css";

let socket;
export default function SignIn() {
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  const history = useHistory();
  const ENDPOINT = "localhost:5000";
  const gotochat = () => {
    socket = io(`http://${ENDPOINT}`);
    socket.emit("checkuser", { name, room }, (error) => {
      if (error) {
        alert(error);
      } else {
        history.push(`/chat?name=${name}&room=${room}`);
      }
    });
  };
  return (
    <div className="joinOuterContainer">
      <div className="joinInnerContainer">
        <h1 className="heading">Join</h1>
        <div>
          <input
            placeholder="Name"
            className="joinInput"
            type="text"
            onChange={(event) => setName(event.target.value)}
          />
        </div>
        <div>
          <input
            placeholder="Room"
            className="joinInput mt-20"
            type="text"
            onChange={(event) => setRoom(event.target.value)}
          />
        </div>

        <button
          className={"button mt-20"}
          type="submit"
          onClick={() => {
            gotochat();
          }}
        >
          Sign In
        </button>
      </div>
    </div>
  );
}
