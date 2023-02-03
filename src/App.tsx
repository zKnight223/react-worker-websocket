import "./App.css";
import React from "react";
import PrintTree from "./components/PrintTree";

const worker_script = require("./worker");

function App() {
  const [readyState, setReadyState] = React.useState<number>(0);
  const [payload, setPayload] = React.useState<any>({});

  const myWorker = new SharedWorker(worker_script);
  myWorker.port.addEventListener("message", (event: any) => {
    if (event.data.message === "data_arrived") {
      setPayload(event.data.payload);
    } else if (event.data.message === "state_changed") {
      setReadyState(event.data.payload);
    }
  });
  myWorker.port.start();

  return (
    <div className="root_container">
      <span className="state">
        Web Socket State:
        {readyState === 0 && <span className="connecting">Connecting</span>}
        {readyState === 1 && <span className="open">Open</span>}
        {readyState === 3 && <span className="close">Close</span>}
      </span>
      {readyState === 1 && <PrintTree data={payload} />}
    </div>
  );
}

export default App;
