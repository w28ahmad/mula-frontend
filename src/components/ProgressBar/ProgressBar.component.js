import { useState, useEffect } from "react";

const ProgressBar = (props) => {
  const { bgcolor, progress, name, position } = props;
  const [currentProgress, setCurrentProgress] = useState(progress);

  const containerStyles = {
    height: 20,
    width: "100%",
    backgroundColor: "#e0e0de",
    borderRadius: 50,
    margin: 10,
  };

  const fillerStyles = {
    height: "100%",
    width: `${currentProgress}%`,
    backgroundColor: bgcolor,
    borderRadius: "inherit",
    textAlign: "right",
    transition: "width 0.5s ease-in-out",
  };

  const labelStyles = {
    padding: 5,
    color: "white",
  };

  const positionStyle = {
    fontWeight: "bold",
  };

  useEffect(() => {
    setCurrentProgress(progress);
  }, [progress]);

  return (
    <div style={containerStyles}>
      <div style={fillerStyles} key={progress}>
        <span style={positionStyle}> {`${position ? position : ""}`} </span>
        <span style={labelStyles}>{`${name}`}</span>
      </div>
    </div>
  );
};

export default ProgressBar;
