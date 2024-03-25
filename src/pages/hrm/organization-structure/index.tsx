
import { ConnectorModel, DiagramComponent, NodeModel } from "@syncfusion/ej2-react-diagrams";
import * as React from 'react';
import "@syncfusion/ej2-diagrams/styles/material.css";
import "@syncfusion/ej2-react-diagrams/styles/material.css";
import "@syncfusion/ej2-base/styles/material.css";
import "@syncfusion/ej2-popups/styles/material.css";
import "@syncfusion/ej2-splitbuttons/styles/material.css";
import "@syncfusion/ej2-navigations/styles/material.css";

//Initializes the nodes for the diagram
let nodes: NodeModel[] = [
  {
    id: "begin",
    height: 60,
    offsetX: 300,
    offsetY: 80,
    shape: { type: "Flow", shape: "Terminator" },
    annotations: [
      {
        content: "Begin"
      }
    ]
  },
  {
    id: "process",
    height: 60,
    offsetX: 300,
    offsetY: 160,
    shape: { type: "Flow", shape: "Decision" },
    annotations: [
      {
        content: "Process"
      }
    ]
  },
  {
    id: "end",
    height: 60,
    offsetX: 300,
    offsetY: 240,
    shape: { type: "Flow", shape: "Process" },
    annotations: [
      {
        content: "End"
      }
    ]
  },
];
//Initializes the connector for the diagram
let connectors: ConnectorModel[] = [
  { id: "connector1", sourceID: "begin", targetID: "process" },
  { id: "connector2", sourceID: "process", targetID: "end" },
];

function App() {
    return <DiagramComponent id="container" width={"100%"} height={"350px"} nodes={nodes} connectors={connectors}></DiagramComponent>
};
export default App;
