const ProgressBar = (props) => {
  const { bgcolor, progress, name, position } = props

  const containerStyles = {
    height: 20,
    width: '100%',
    backgroundColor: "#e0e0de",
    borderRadius: 50,
    margin: 10
  }

  const fillerStyles = {
    height: '100%',
    width: `${progress}%`,
    backgroundColor: bgcolor,
    borderRadius: 'inherit',
    textAlign: 'right'
  }

  const labelStyles = {
    padding: 5,
    color: 'white',
  }

  const positionStyle = {
    fontWeight: 'bold'
  }

  return (
    <div style={containerStyles}>
      <div style={fillerStyles}>
        <span style={positionStyle}> {`${position ? position+"st" : ""}`} </span>
        <span style={labelStyles}>{`${name}`}</span>
      </div>
    </div>
  )
}

export default ProgressBar