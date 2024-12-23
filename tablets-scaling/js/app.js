(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define([], factory);
  } else if (typeof exports !== "undefined") {
    factory();
  } else {
    var mod = {
      exports: {}
    };
    factory();
    global.app = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function () {
  "use strict";

  function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
  function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
  function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
  function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
  function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
  function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
  var _React = React,
    useEffect = _React.useEffect,
    useState = _React.useState,
    useRef = _React.useRef;
  var _ReactBootstrap = ReactBootstrap,
    Tabs = _ReactBootstrap.Tabs,
    Tab = _ReactBootstrap.Tab,
    Button = _ReactBootstrap.Button,
    Collapse = _ReactBootstrap.Collapse,
    Card = _ReactBootstrap.Card,
    Form = _ReactBootstrap.Form,
    Row = _ReactBootstrap.Row,
    Col = _ReactBootstrap.Col,
    Spinner = _ReactBootstrap.Spinner;

  // React Application Code
  var App = function App() {
    // Use a ref to persist the socket instance across renders
    var socket = useRef(null);

    // Emit events when buttons are clicked
    var emitEvent = function emitEvent(eventName) {
      console.log("Emitting event: ".concat(eventName));
      if (socket.current) {
        socket.current.emit(eventName);
      }
    };
    var handleClusterToggle = function handleClusterToggle(isRunning) {
      if (isRunning) {
        console.log('Loader Started');
      } else {
        console.log('Loader Stopped');
      }
    };
    var handleLoaderToggle = function handleLoaderToggle(isRunning) {
      if (isRunning) {
        console.log('Loader Started');
      } else {
        console.log('Loader Stopped');
      }
    };
    var ConsoleOutput = function ConsoleOutput() {
      var _useState = useState("[Welcome to ScyllaDB Tech Demo]"),
        _useState2 = _slicedToArray(_useState, 2),
        output = _useState2[0],
        setOutput = _useState2[1];
      var outputRef = useRef(null);
      useEffect(function () {
        // Initialize the socket connection
        socket.current = window.io();

        // Set up event listeners
        socket.current.on("playbook_output", function (data) {
          setOutput(function (prevOutput) {
            return prevOutput + data.output;
          });
          console.log(data.output);
        });

        // Cleanup socket connection on component unmount
        return function () {
          socket.current.disconnect();
        };
      }, []);
      useEffect(function () {
        // Scroll the pre element to the bottom
        if (outputRef.current) {
          outputRef.current.scrollTop = outputRef.current.scrollHeight;
        }
      }, [output]);
      return /*#__PURE__*/React.createElement("pre", {
        id: "output",
        className: "pre flex-grow-1",
        ref: outputRef
      }, output);
    };

    // Scenario Card Component
    var ScenarioCard = function ScenarioCard(_ref) {
      var icon = _ref.icon,
        title = _ref.title,
        description = _ref.description,
        collapseId = _ref.collapseId,
        onClick = _ref.onClick;
      var _useState3 = useState(true),
        _useState4 = _slicedToArray(_useState3, 2),
        open = _useState4[0],
        setOpen = _useState4[1];
      var _useState5 = useState(0),
        _useState6 = _slicedToArray(_useState5, 2),
        runState = _useState6[0],
        setRunState = _useState6[1];
      var handleButtonClick = function handleButtonClick() {
        setRunState(2);
        if (onClick) {
          onClick(); // Call the parent-provided onClick if it exists
        }
      };
      return /*#__PURE__*/React.createElement(Card, {
        className: "p-2"
      }, /*#__PURE__*/React.createElement("div", {
        className: "desc"
      }, /*#__PURE__*/React.createElement("a", {
        className: "d-block flex-grow-1",
        onClick: function onClick() {
          return setOpen(!open);
        },
        "aria-controls": collapseId,
        "aria-expanded": open
      }, /*#__PURE__*/React.createElement("h4", null, /*#__PURE__*/React.createElement("i", {
        className: icon
      }), " ", title)), /*#__PURE__*/React.createElement(Collapse, {
        "in": open
      }, /*#__PURE__*/React.createElement("div", {
        id: collapseId
      }, /*#__PURE__*/React.createElement("div", {
        className: "collapse-content"
      }, description)))), /*#__PURE__*/React.createElement("div", {
        className: "actions"
      }, /*#__PURE__*/React.createElement(RunButton, {
        state: runState,
        onClick: handleButtonClick
      })));
    };

    //Icon Component
    var Icon = function Icon(_ref2) {
      var icon = _ref2.icon,
        _ref2$margin = _ref2.margin,
        margin = _ref2$margin === void 0 ? "me-1" : _ref2$margin,
        children = _ref2.children;
      return /*#__PURE__*/React.createElement("i", {
        className: "icon-".concat(icon, " ").concat(margin)
      }, children);
    };
    var Slider = function Slider(_ref3) {
      var value = _ref3.value,
        min = _ref3.min,
        max = _ref3.max,
        step = _ref3.step,
        onChange = _ref3.onChange,
        label = _ref3.label;
      return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Form.Label, {
        column: true,
        sm: "4",
        className: "small-label"
      }, label), /*#__PURE__*/React.createElement(Row, null, /*#__PURE__*/React.createElement(Col, null, /*#__PURE__*/React.createElement(Form.Range, {
        value: value,
        min: min,
        max: max,
        step: step,
        onChange: onChange
      }), /*#__PURE__*/React.createElement("div", {
        className: "d-flex justify-content-between"
      }, /*#__PURE__*/React.createElement("div", {
        className: "small-label"
      }, min), /*#__PURE__*/React.createElement("div", {
        className: "small-label"
      }, max))), /*#__PURE__*/React.createElement("div", {
        style: {
          width: '90px'
        }
      }, /*#__PURE__*/React.createElement(Form.Control, {
        type: "number",
        value: value,
        min: min,
        max: max,
        step: step,
        onChange: onChange,
        className: "blend-input"
      }))));
    };
    var ToggleButton = function ToggleButton(_ref4) {
      var initialState = _ref4.initialState,
        onState = _ref4.onState,
        offState = _ref4.offState,
        onToggle = _ref4.onToggle;
      var _useState7 = useState(initialState),
        _useState8 = _slicedToArray(_useState7, 2),
        isOn = _useState8[0],
        setIsOn = _useState8[1];
      var handleClick = function handleClick() {
        setIsOn(!isOn);
        onToggle(!isOn); // Notify parent of state change
      };
      return /*#__PURE__*/React.createElement(Button, {
        variant: isOn ? 'warning' : 'success',
        onClick: handleClick
      }, isOn ? offState : onState);
    };
    var RunButton = function RunButton(_ref5) {
      var state = _ref5.state,
        onClick = _ref5.onClick;
      return /*#__PURE__*/React.createElement("div", null, state === 0 && /*#__PURE__*/React.createElement(Button, {
        variant: "light",
        onClick: onClick
      }, /*#__PURE__*/React.createElement("i", {
        className: "icon-play me-2"
      }), " Run"), state === 1 && /*#__PURE__*/React.createElement(Button, {
        variant: "light",
        disabled: true
      }, /*#__PURE__*/React.createElement(Spinner, {
        as: "span",
        animation: "border",
        size: "sm",
        role: "status",
        "aria-hidden": "true",
        className: "me-2"
      }), "Running"), state === 2 && /*#__PURE__*/React.createElement(Button, {
        variant: "success",
        disabled: true
      }, /*#__PURE__*/React.createElement("i", {
        className: "icon-check"
      })));
    };
    var ClusterProperties = function ClusterProperties(_ref6) {
      var handleSaveClusterProperties = _ref6.handleSaveClusterProperties;
      var _useState9 = useState(3),
        _useState10 = _slicedToArray(_useState9, 2),
        numNodes = _useState10[0],
        setNumNodes = _useState10[1];
      var _useState11 = useState('t2.micro'),
        _useState12 = _slicedToArray(_useState11, 2),
        instanceType = _useState12[0],
        setInstanceType = _useState12[1];
      return /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement(Card.Body, null, /*#__PURE__*/React.createElement("h3", {
        className: "mb-3"
      }, "Cluster Properties"), /*#__PURE__*/React.createElement(Form, {
        className: "vstack gap-3 mb-3"
      }, /*#__PURE__*/React.createElement(Slider, {
        value: numNodes,
        min: 1,
        max: 10,
        step: 1,
        onChange: function onChange(e) {
          return setNumNodes(Number(e.target.value));
        },
        label: "Number of Nodes"
      }), /*#__PURE__*/React.createElement(Form.Group, null, /*#__PURE__*/React.createElement(Form.Label, {
        column: true,
        sm: "4",
        className: "small-label"
      }, "Instance Type"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Form.Select, {
        value: instanceType,
        onChange: function onChange(e) {
          return setInstanceType(e.target.value);
        }
      }, /*#__PURE__*/React.createElement("option", {
        value: "t2.micro"
      }, "t2.micro"), /*#__PURE__*/React.createElement("option", {
        value: "t2.small"
      }, "t2.small"), /*#__PURE__*/React.createElement("option", {
        value: "t2.medium"
      }, "t2.medium"), /*#__PURE__*/React.createElement("option", {
        value: "t3.micro"
      }, "t3.micro"), /*#__PURE__*/React.createElement("option", {
        value: "t3.small"
      }, "t3.small"), /*#__PURE__*/React.createElement("option", {
        value: "t3.medium"
      }, "t3.medium")))), /*#__PURE__*/React.createElement("div", {
        className: "hstack gap-3"
      }, /*#__PURE__*/React.createElement(Button, {
        variant: "primary",
        onClick: function onClick() {
          return emitEvent("sample_data");
        }
      }, "Save"), /*#__PURE__*/React.createElement(ToggleButton, {
        initialState: false,
        onState: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Icon, {
          icon: "play"
        }), " Run Cluster"),
        offState: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Icon, {
          icon: "stop"
        }), " Stop Cluster"),
        onToggle: handleClusterToggle
      })))));
    };
    var LoaderProperties = function LoaderProperties(_ref7) {
      var handleSaveLoaderProperties = _ref7.handleSaveLoaderProperties;
      var _useState13 = useState(1000),
        _useState14 = _slicedToArray(_useState13, 2),
        readOps = _useState14[0],
        setReadOps = _useState14[1];
      var _useState15 = useState(500),
        _useState16 = _slicedToArray(_useState15, 2),
        writeOps = _useState16[0],
        setWriteOps = _useState16[1];
      var _useState17 = useState(2),
        _useState18 = _slicedToArray(_useState17, 2),
        numLoaders = _useState18[0],
        setNumLoaders = _useState18[1];
      return /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement(Card.Body, null, /*#__PURE__*/React.createElement("h3", {
        className: "mb-3"
      }, "Loader Properties"), /*#__PURE__*/React.createElement(Form, {
        className: "vstack gap-3"
      }, /*#__PURE__*/React.createElement(Slider, {
        value: readOps,
        min: 500,
        max: 5000,
        step: 100,
        onChange: function onChange(e) {
          return setReadOps(Number(e.target.value));
        },
        label: "Read Ops/sec"
      }), /*#__PURE__*/React.createElement(Slider, {
        value: writeOps,
        min: 100,
        max: 5000,
        step: 100,
        onChange: function onChange(e) {
          return setWriteOps(Number(e.target.value));
        },
        label: "Write Ops/sec"
      }), /*#__PURE__*/React.createElement(Slider, {
        value: numLoaders,
        min: 1,
        max: 20,
        step: 1,
        onChange: function onChange(e) {
          return setNumLoaders(Number(e.target.value));
        },
        label: "Number of Loader Instances"
      }), /*#__PURE__*/React.createElement("div", {
        className: "hstack gap-3"
      }, /*#__PURE__*/React.createElement(Button, {
        variant: "primary",
        onClick: function onClick() {
          return handleSaveLoaderProperties(readOps, writeOps, numLoaders);
        }
      }, "Save"), /*#__PURE__*/React.createElement(ToggleButton, {
        initialState: false,
        onState: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Icon, {
          icon: "play"
        }), " Start Loader"),
        offState: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Icon, {
          icon: "stop"
        }), " Stop Loader"),
        onToggle: handleLoaderToggle
      })))));
    };

    // MainContainer Component
    var MainContainer = function MainContainer() {
      return /*#__PURE__*/React.createElement("div", {
        className: "controls gap-4"
      }, /*#__PURE__*/React.createElement("div", {
        className: "top-nav d-flex align-items-center"
      }, /*#__PURE__*/React.createElement("img", {
        src: "./img/scylla-logo.svg",
        alt: "ScyllaDB"
      }), /*#__PURE__*/React.createElement("div", {
        className: "flex-grow-1"
      }), /*#__PURE__*/React.createElement("h3", null, "Tech Demo")), /*#__PURE__*/React.createElement(Tabs, {
        defaultActiveKey: "home",
        id: "controlTabs",
        className: "nav-tabs nav-fill"
      }, /*#__PURE__*/React.createElement(Tab, {
        eventKey: "home",
        title: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Icon, {
          icon: "dashboard"
        }), " Dashboard")
      }, /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(ClusterProperties, null), /*#__PURE__*/React.createElement(LoaderProperties, null))), /*#__PURE__*/React.createElement(Tab, {
        eventKey: "settings",
        title: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Icon, {
          icon: "rocket"
        }), " Scenarios")
      }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
        className: "mb-3"
      }, "Tablets demo"), /*#__PURE__*/React.createElement("ol", {
        className: "cards-list"
      }, /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement(ScenarioCard, {
        icon: "icon-database",
        title: "Set up 3-node cluster",
        description: "Initialize a resilient ScyllaDB cluster with three interconnected nodes, ready for high-performance data operations.",
        collapseId: "stepOneCollapse",
        onClick: function onClick() {
          return emitEvent("original_cluster");
        }
      })), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement(ScenarioCard, {
        icon: "icon-sample-data",
        title: "Load sample data",
        description: "Populate the database with predefined sample data, showcasing key-value pairs, relational mappings, or time-series metrics.",
        collapseId: "stepTwoCollapse",
        onClick: function onClick() {
          return emitEvent("sample_data");
        }
      })), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement(ScenarioCard, {
        icon: "icon-rocket",
        title: "Start loader",
        description: "Simulate real-world traffic by generating a continuous workload on the database to evaluate its performance.",
        collapseId: "stepThreeCollapse",
        onClick: function onClick() {
          return emitEvent("start_stress");
        }
      })), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement(ScenarioCard, {
        icon: "icon-scale_out",
        title: "Scale out (add 3 nodes)",
        description: "Seamlessly add three additional nodes to the cluster, enabling automatic data redistribution and increased capacity using ScyllaDB's tablet architecture.",
        collapseId: "stepFourCollapse",
        onClick: function onClick() {
          return emitEvent("scale_out");
        }
      })), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement(ScenarioCard, {
        icon: "icon-scale_in",
        title: "Scale in (remove 3 nodes)",
        description: "Simulate real-world traffic by generating a continuous workload on the database to evaluate its performance.",
        collapseId: "stepFiveCollapse",
        onClick: function onClick() {
          return emitEvent("scale_in");
        }
      })), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement(ScenarioCard, {
        icon: "icon-stop",
        title: "Stop loader",
        description: "Simulate real-world traffic by generating a continuous workload on the database to evaluate its performance.",
        collapseId: "stepSixCollapse",
        onClick: function onClick() {
          return emitEvent("stop_stress");
        }
      }))))), /*#__PURE__*/React.createElement(Tab, {
        eventKey: "about",
        title: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Icon, {
          icon: "info"
        }), " About")
      }, /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement(Card.Body, {
        className: "section-about"
      }, /*#__PURE__*/React.createElement("img", {
        src: "./img/scylladb-mascot-cloud.svg",
        alt: ""
      }), /*#__PURE__*/React.createElement("h2", null, "1 million ops/sec ", /*#__PURE__*/React.createElement("br", null), "ScyllaDB demos with Terraform"), /*#__PURE__*/React.createElement("p", {
        className: "lead"
      }, "Test and benchmark ScyllaDB under a 1 million operations per second workload."))), /*#__PURE__*/React.createElement("div", {
        className: "flex-grow-1"
      }, /*#__PURE__*/React.createElement("div", {
        className: "hstack justify-content-center gap-3 flex-wrap"
      }, /*#__PURE__*/React.createElement(Button, {
        variant: "light",
        href: "https://www.scylladb.com",
        target: "_blank"
      }, "ScyllaDB.com"), /*#__PURE__*/React.createElement(Button, {
        variant: "light",
        href: "https://docs.scylladb.com",
        target: "_blank"
      }, /*#__PURE__*/React.createElement(Icon, {
        icon: "docs"
      }), "Documentation"), /*#__PURE__*/React.createElement(Button, {
        variant: "light",
        href: "https://github.com/scylladb",
        target: "_blank"
      }, /*#__PURE__*/React.createElement(Icon, {
        icon: "github"
      }), "GitHub"), /*#__PURE__*/React.createElement(Button, {
        variant: "light",
        href: "https://twitter.com/scylladb",
        target: "_blank"
      }, /*#__PURE__*/React.createElement(Icon, {
        icon: "x"
      }), "X"), /*#__PURE__*/React.createElement(Button, {
        variant: "light",
        href: "https://www.linkedin.com/company/scylladb",
        target: "_blank"
      }, /*#__PURE__*/React.createElement(Icon, {
        className: "linkedin"
      }), "LinkedIn"))), /*#__PURE__*/React.createElement("div", {
        className: "border-top pt-3 small text-center"
      }, "\xA9 ", new Date().getFullYear(), " ScyllaDB. All rights reserved.")))));
    };

    // GrafanaContainer Component
    var GrafanaContainer = function GrafanaContainer() {
      var _useState19 = useState({
          "Loading Grafana...": ""
        }),
        _useState20 = _slicedToArray(_useState19, 2),
        grafanaUrls = _useState20[0],
        setGrafanaUrls = _useState20[1];
      useEffect(function () {
        fetch('../data/grafana_urls.json') // Adjust the path based on where the file is hosted
        .then(function (response) {
          if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
          }
          return response.json();
        }).then(function (data) {
          console.log('Fetched grafanaUrls');
          setGrafanaUrls(data);
        })["catch"](function (error) {
          console.error('Error fetching grafanaUrls:', error);
        });
      }, []);
      return /*#__PURE__*/React.createElement("div", {
        className: "grafana"
      }, /*#__PURE__*/React.createElement(Tabs, {
        defaultActiveKey: "console",
        id: "tabMenu",
        className: "nav-tabs",
        transition: false
      }, /*#__PURE__*/React.createElement(Tab, {
        eventKey: "console",
        title: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Icon, {
          icon: "terminal"
        }), " Console")
      }, /*#__PURE__*/React.createElement(ConsoleOutput, null)), Object.entries(grafanaUrls).map(function (_ref8) {
        var _ref9 = _slicedToArray(_ref8, 2),
          key = _ref9[0],
          url = _ref9[1];
        return /*#__PURE__*/React.createElement(Tab, {
          eventKey: key.toLowerCase(),
          title: key,
          key: key
        }, /*#__PURE__*/React.createElement("iframe", {
          src: url,
          title: key
        }));
      })));
    };
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(MainContainer, null), /*#__PURE__*/React.createElement(GrafanaContainer, null));
  };

  // Render the App Component
  var root = ReactDOM.createRoot(document.getElementById("root"));
  root.render(/*#__PURE__*/React.createElement(App, null));
});