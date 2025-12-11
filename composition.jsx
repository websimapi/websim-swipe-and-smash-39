import { jsxDEV } from "react/jsx-dev-runtime";
import React, { useMemo } from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, Audio, staticFile, interpolate, Img, Sequence } from "remotion";
const BOARD_SIZE = 10;
const CANDY_SIZE = 540 / BOARD_SIZE;
const Candy = ({ type, x, y, scale = 1, opacity = 1, powerup = null }) => {
  return /* @__PURE__ */ jsxDEV(
    "div",
    {
      style: {
        position: "absolute",
        left: x,
        top: y,
        width: CANDY_SIZE,
        height: CANDY_SIZE,
        backgroundImage: `url(${staticFile(type)})`,
        backgroundSize: "80%",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        transform: `scale(${scale})`,
        opacity,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        filter: powerup === "rainbow" ? "drop-shadow(0 0 3px red)" : "none"
      },
      children: [
        powerup === "bomb" && /* @__PURE__ */ jsxDEV("div", { style: {
          fontSize: "1.5em",
          opacity: 0.7,
          textShadow: "0 0 3px white"
        }, children: "\u{1F4A5}" }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 29,
          columnNumber: 13
        }),
        powerup === "row" && /* @__PURE__ */ jsxDEV("div", { style: {
          position: "absolute",
          top: "50%",
          left: "10%",
          right: "10%",
          height: "10%",
          backgroundColor: "rgba(255, 255, 255, 0.7)",
          borderRadius: "5px",
          transform: "translateY(-50%)",
          boxShadow: "0 0 4px white"
        } }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 36,
          columnNumber: 13
        }),
        powerup === "col" && /* @__PURE__ */ jsxDEV("div", { style: {
          position: "absolute",
          left: "50%",
          top: "10%",
          bottom: "10%",
          width: "10%",
          backgroundColor: "rgba(255, 255, 255, 0.7)",
          borderRadius: "5px",
          transform: "translateX(-50%)",
          boxShadow: "0 0 4px white"
        } }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 49,
          columnNumber: 13
        })
      ]
    },
    void 0,
    true,
    {
      fileName: "<stdin>",
      lineNumber: 9,
      columnNumber: 5
    }
  );
};
const ReplayComposition = ({ recording }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const currentTime = frame / fps * 1e3;
  const { candies, comboText, isRainbow } = useMemo(() => {
    const state = {};
    let currentCombo = null;
    let isRainbow2 = false;
    if (recording.initialState) {
      recording.initialState.forEach((row) => {
        row.forEach((cData) => {
          if (cData) {
            state[cData.id] = {
              id: cData.id,
              type: cData.type,
              r: cData.r,
              c: cData.c,
              x: cData.c * CANDY_SIZE,
              y: cData.r * CANDY_SIZE,
              scale: 1,
              opacity: 1,
              powerup: null
            };
          }
        });
      });
    }
    for (const action of recording.actions) {
      if (action.timestamp <= currentTime) {
        if (action.type === "startRainbow") isRainbow2 = true;
        if (action.type === "endRainbow") isRainbow2 = false;
      }
      if (action.type === "comboUpdate") {
        if (currentTime >= action.timestamp && currentTime < action.timestamp + 1500) {
          if (action.count >= 2) {
            currentCombo = `Combo x${action.count}`;
          }
        }
      }
      if (action.type === "powerup_upgrade") {
        if (action.timestamp <= currentTime) {
          if (state[action.id]) {
            state[action.id].powerup = action.powerup;
            if (action.powerup === "rainbow") {
              state[action.id].type = "candy_chocolate.png";
            }
          }
        }
      }
      if (action.type === "create") {
        if (action.timestamp <= currentTime) {
          state[action.id] = {
            id: action.id,
            type: action.candyType,
            r: action.row,
            c: action.col,
            x: action.col * CANDY_SIZE,
            y: action.row * CANDY_SIZE,
            scale: 1,
            opacity: 1,
            powerup: null
          };
          const age = currentTime - action.timestamp;
          if (age < 300 && !action.isInitializing) {
            state[action.id].y = action.row * CANDY_SIZE - CANDY_SIZE + age / 300 * CANDY_SIZE;
          }
        }
      } else if (action.type === "remove") {
        if (action.timestamp <= currentTime) {
          delete state[action.id];
        }
      } else if (action.type === "match_anim") {
        const age = currentTime - action.timestamp;
        if (age >= 0 && age < action.duration) {
          const progress = age / action.duration;
          action.ids.forEach((id) => {
            if (state[id]) {
              state[id].scale = 1 - progress;
              state[id].opacity = 1 - progress;
            }
          });
        }
      } else if (action.type === "swap_anim") {
        const age = currentTime - action.timestamp;
        const c1 = state[action.id1];
        const c2 = state[action.id2];
        if (age >= action.duration) {
          if (c1) {
            c1.r = action.c1_to.r;
            c1.c = action.c1_to.c;
            c1.x = c1.c * CANDY_SIZE;
            c1.y = c1.r * CANDY_SIZE;
          }
          if (c2) {
            c2.r = action.c2_to.r;
            c2.c = action.c2_to.c;
            c2.x = c2.c * CANDY_SIZE;
            c2.y = c2.r * CANDY_SIZE;
          }
        } else if (age >= 0) {
          const p = age / action.duration;
          if (c1) {
            c1.x = action.c1_from.c * CANDY_SIZE * (1 - p) + action.c1_to.c * CANDY_SIZE * p;
            c1.y = action.c1_from.r * CANDY_SIZE * (1 - p) + action.c1_to.r * CANDY_SIZE * p;
          }
          if (c2) {
            c2.x = action.c2_from.c * CANDY_SIZE * (1 - p) + action.c2_to.c * CANDY_SIZE * p;
            c2.y = action.c2_from.r * CANDY_SIZE * (1 - p) + action.c2_to.r * CANDY_SIZE * p;
          }
        }
      } else if (action.type === "fall_anim") {
        const age = currentTime - action.timestamp;
        const c = state[action.id];
        if (c) {
          if (age >= action.duration) {
            c.r = action.toRow;
            c.y = action.toRow * CANDY_SIZE;
          } else if (age >= 0) {
            const startY = c.y;
            const fromY = c.r * CANDY_SIZE;
            const toY = action.toRow * CANDY_SIZE;
            const p = age / action.duration;
            c.y = fromY + (toY - fromY) * p;
          }
        }
      }
    }
    return { candies: Object.values(state), comboText: currentCombo, isRainbow: isRainbow2 };
  }, [recording, currentTime]);
  return /* @__PURE__ */ jsxDEV(AbsoluteFill, { style: { backgroundColor: "#ffebf8", overflow: "hidden", justifyContent: "center", alignItems: "center" }, children: [
    /* @__PURE__ */ jsxDEV("div", { style: { position: "relative", width: 540, height: 540, border: "5px solid #e7a5d3", borderRadius: 10, background: "rgba(255,255,255,0.5)", boxSizing: "border-box", flexShrink: 0 }, children: candies.map((c) => /* @__PURE__ */ jsxDEV(Candy, { ...c }, c.id, false, {
      fileName: "<stdin>",
      lineNumber: 211,
      columnNumber: 32
    })) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 210,
      columnNumber: 11
    }),
    comboText && /* @__PURE__ */ jsxDEV("div", { style: {
      position: "absolute",
      top: isRainbow ? "10px" : "50%",
      left: isRainbow ? "10px" : "50%",
      transform: isRainbow ? "none" : "translate(-50%, -50%)",
      fontSize: isRainbow ? "2em" : "4em",
      fontWeight: "bold",
      color: "white",
      textShadow: "3px 3px 0 #d63384, -1px -1px 0 #d63384",
      fontFamily: "Comic Sans MS, sans-serif",
      zIndex: 10
    }, children: comboText }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 215,
      columnNumber: 14
    }),
    recording.actions.filter((a) => a.type === "sound").map((a, i) => {
      const startFrame = Math.round(a.timestamp / 1e3 * fps);
      return /* @__PURE__ */ jsxDEV(Sequence, { from: startFrame, durationInFrames: 90, children: /* @__PURE__ */ jsxDEV(
        Audio,
        {
          src: staticFile(a.name),
          volume: 0.5
        },
        void 0,
        false,
        {
          fileName: "<stdin>",
          lineNumber: 236,
          columnNumber: 23
        }
      ) }, i, false, {
        fileName: "<stdin>",
        lineNumber: 235,
        columnNumber: 19
      });
    }),
    /* @__PURE__ */ jsxDEV(AbsoluteFill, { style: { justifyContent: "flex-end", alignItems: "flex-end", padding: 30, pointerEvents: "none" }, children: /* @__PURE__ */ jsxDEV(Img, { src: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent("https://candysmash.on.websim.com")}`, style: { width: 120, height: 120, border: "4px solid white", borderRadius: 15, boxShadow: "0 4px 10px rgba(0,0,0,0.3)" } }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 246,
      columnNumber: 14
    }) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 245,
      columnNumber: 12
    })
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 209,
    columnNumber: 7
  });
};
export {
  ReplayComposition
};
