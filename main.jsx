import { jsxDEV } from "react/jsx-dev-runtime";
import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { Player } from "@websim/remotion/player";
import { ReplayComposition } from "./composition.jsx";
const ReplayModalContent = () => {
  const [recordingData, setRecordingData] = useState(null);
  useEffect(() => {
    const handleShow = (e) => {
      setRecordingData(e.detail);
    };
    const handleHide = () => {
      setRecordingData(null);
    };
    window.addEventListener("showReplay", handleShow);
    window.addEventListener("hideReplay", handleHide);
    return () => {
      window.removeEventListener("showReplay", handleShow);
      window.removeEventListener("hideReplay", handleHide);
    };
  }, []);
  if (!recordingData || !recordingData.actions.length) {
    return /* @__PURE__ */ jsxDEV("div", { style: { color: "white", fontSize: "24px", fontFamily: "Comic Sans MS" }, children: "Waiting for Replay Data..." }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 27,
      columnNumber: 12
    });
  }
  const lastAction = recordingData.actions[recordingData.actions.length - 1];
  const durationInSeconds = (lastAction ? lastAction.timestamp : 0) / 1e3 + 3;
  const durationInFrames = Math.max(90, Math.ceil(durationInSeconds * 30));
  return /* @__PURE__ */ jsxDEV("div", { style: { width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }, children: /* @__PURE__ */ jsxDEV(
    Player,
    {
      component: ReplayComposition,
      durationInFrames,
      fps: 30,
      compositionWidth: 540,
      compositionHeight: 540,
      controls: true,
      loop: true,
      autoPlay: true,
      inputProps: { recording: recordingData },
      style: { width: "100%", maxWidth: "540px", aspectRatio: "1/1", boxShadow: "0 0 20px rgba(0,0,0,0.3)", borderRadius: "10px" }
    },
    void 0,
    false,
    {
      fileName: "<stdin>",
      lineNumber: 38,
      columnNumber: 7
    }
  ) }, void 0, false, {
    fileName: "<stdin>",
    lineNumber: 37,
    columnNumber: 5
  });
};
const rootElement = document.getElementById("remotion-root");
if (rootElement) {
  const root = createRoot(rootElement);
  root.render(/* @__PURE__ */ jsxDEV(ReplayModalContent, {}, void 0, false, {
    fileName: "<stdin>",
    lineNumber: 57,
    columnNumber: 17
  }));
}
