import Markdown from "../Markdown/Markdown.component";

export default function OptionsGroup(props) {
    const options = props.options;
    return (
        Object.keys(options).map((keyName, _) => {
            if (keyName.startsWith("option")){
                return (
                    <button 
                        className={'button mt-20'} 
                        type="submit" 
                        key={keyName} 
                        value={options[keyName]}
                        onClick={props.onSolution}>
                            <Markdown>
                                {options[keyName]}
                            </Markdown>
                    </button>
                )
            }
            return null
        })
    );
}