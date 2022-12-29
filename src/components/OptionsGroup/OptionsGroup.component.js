import Markdown from "../Markdown/Markdown.component";
import "./OptionsGroup.component.css";

export default function OptionsGroup(props) {
  const options = props.options;
  return (
    <div className={"optionsGrid"}>
      {Object.keys(options).map((keyName, index) => {
        if (keyName.startsWith("option")) {
          return (
            <div
              btn-value={options[keyName]}
              style={{ margin: "10px" }}
              key={index}
            >
              <button
                className={"btn btn-primary"}
                type="submit"
                value={options[keyName]}
                onClick={props.onSolution}
                style={{ width: "100%", padding: "20px", textAlign: "center" }}
              >
                <div style={{ pointerEvents: "none" }}>
                  <Markdown>{options[keyName]}</Markdown>
                </div>
              </button>
            </div>
          );
        }
        return null;
      })}
    </div>
  );
}
