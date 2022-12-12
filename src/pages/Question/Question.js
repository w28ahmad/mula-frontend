import React, { useState, useEffect } from 'react'
import Markdown from '../../components/Markdown/Markdown.component'

import './Question.css'

const Question = () => {

    const [count, setCount] = useState(null)
    const [currIdx, setCurrIdx] = useState(null)
    const [data, setData] = useState(null)


    useEffect(() => {
      fetch('/questionCount')
        .then(response => response.json())
        .then(data => setCount(data));
    }, []);

    const menuItems = [];
    for (let i = 1; i <= count; i++) {
        menuItems.push(i);
    }

    const onQuestionSelect = async (e) => {
        const idx = e.currentTarget.getAttribute('data-item')
        const response = await fetch(`/getQuestion?idx=${idx-1}`);
        const newData = await response.json();
        setData(newData)
        setCurrIdx(idx)
    }

    const changeHandler = (e) => {
        const mainkey = e.target.getAttribute("mainkey")
        const subkey = e.target.getAttribute("subkey")
        const newValue = e.target.value
        setData(prevData => {
            const newData = { ...prevData }
            newData[mainkey][subkey] = newValue
            return newData
        })
    }
    const submitHandler = (e) => {
        e.preventDefault();
    
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        };
    
        fetch(`/putQuestion?idx=${currIdx-1}`, requestOptions);
    };

    return (
        <div style={{display: "flex"}}>
            <div className="sidebar">
                <ul>
                    {
                        menuItems.map(item => (
                            <li onClick={onQuestionSelect} key={item} data-item={item}>Question {item}</li>
                        ))
                    }
                </ul>
            </div>


            <div style={{margin: "10px 50px", width: "100%"}}>
                {data === null && <p></p>}
                { data && (
                    <form onSubmit={submitHandler}>
                    {Object.keys(data).map(key => (
                      <div key={key}>
                        <h3>{key}</h3>
                        {Object.keys(data[key]).map(subKey => (
                          <label key={subKey} style={{margin: "10px 0", display: "flex", flexDirection: "column"}}>
                            {subKey}:
                            {(key==="questionData" || key === "solutionData") && <Markdown>{data[key][subKey].replace(/\\\\/g, '\\')}</Markdown>}
                            <textarea 
                                mainkey={key}
                                subkey={subKey}
                                onChange={changeHandler} 
                                style={{margin: "0 0 10px", width: "100%"}} 
                                value={data[key][subKey]} 
                                />
                          </label>
                        ))}
                      </div>
                    ))}
                    <button type="submit" style={{margin: "20px 0"}}>Save</button>
                  </form>
                )}
            </div>
        </div>
    );
}

export default Question;