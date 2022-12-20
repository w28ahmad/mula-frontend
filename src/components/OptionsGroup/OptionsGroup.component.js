import Markdown from "../Markdown/Markdown.component";

export default function OptionsGroup(props) {
    const options = props.options;
    return (
        Object.keys(options).map((keyName, _) => {
            if (keyName.startsWith("option")){
                return (
                    <div btn-value={options[keyName]} style={{display: 'block', margin: '10px'}}>
                      <button 
                        className={'btn btn-outline-primary'} 
                        type="submit" 
                        key={keyName} 
                        value={options[keyName]}
                        onClick={props.onSolution}
                        style={{width: '100%', padding: '20px', textAlign: 'center'}}
                      >
                        <Markdown>{options[keyName]}</Markdown>
                      </button>
                    </div>
                )
            }
            return null
        })
    );
}
