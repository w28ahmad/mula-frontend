import React, { useState, useEffect } from 'react'
import { QUESTION_SCHEMA } from './QuestionSchema'
import Markdown from '../../components/Markdown/Markdown.component'

import './Question.css'

const Question = () => {

    const [count, setCount] = useState(null)
    const [currIdx, setCurrIdx] = useState(null)
    const [data, setData] = useState(null)
    const [menuItems, setMenuItems] = useState([])
    const [questionDiagram, setQuestionDiagram] = useState(null)
    const [solutionDiagram, setSolutionDiagram] = useState(null)


    useEffect(() => {
        fetch('/questionCount')
            .then(response => response.json())
            .then(data => {
                setCount(data);
                const menuItems = [];
                for (let i = 1; i <= data; i++) {
                    menuItems.push(i);
                }
                setMenuItems(menuItems);
            });
    }, []);

    const onQuestionSelect = async (e) => {
        const idx = e.currentTarget.getAttribute('data-item')
        const response = await fetch(`/getQuestion?idx=${idx - 1}`);
        if(response.ok){
            const newData = await response.json();
            setData(newData)
            setCurrIdx(idx)    
        }
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


    const saveDiagram = (url, mainkey, subkey) => {
        if (url !== null) {
            fetch(url)
                .then(response => response.blob())
                .then(blob => {
                    const formData = new FormData();
                    formData.append('file', blob);

                    return fetch('/diagrams', {
                        method: 'POST',
                        body: formData
                    });
                })
                .then(response => response.json())
                .then(result => {
                    console.log(result);
                    setData(prevData => {
                        const newData = { ...prevData };
                        newData[mainkey][subkey] = result.diagramID;
                        return newData;
                    });
                })
                .catch(error => console.error(error));
        }
    }

    const submitHandler = (e) => {
        e.preventDefault()

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        };

        saveDiagram(questionDiagram, 'questionData', 'diagram');
        saveDiagram(solutionDiagram, 'solutionData', 'diagram');

        if (currIdx === count + 1) {
            fetch('/createQuestion', requestOptions)
            setCount(count+1)
        } else {
            fetch(`/putQuestion?idx=${currIdx-1}`, requestOptions)
        }

    };

    const addQuestion = () => {
        setData(QUESTION_SCHEMA);
        setCurrIdx(count + 1);
        menuItems.push(count + 1);
    };

    const uploadImage = (e) => {
        const mainkey = e.target.getAttribute("mainkey")

        // Check if the user is pasting an image
        if (e.clipboardData && e.clipboardData.items) {
            const items = e.clipboardData.items;
            for (let i = 0; i < items.length; i++) {
                // Check if the item is an image
                if (items[i].type.indexOf("image") !== -1) {
                    // Extract the image from the clipboard
                    const blob = items[i].getAsFile();

                    // Create a URL for the image
                    const URLObj = window.URL || window.webkitURL;
                    const source = URLObj.createObjectURL(blob);

                    // Check if the label at the top of the text area has a subkey of "diagram"
                    // If it does, set the previewImage state to the image URL
                    if (mainkey === "questionData") {
                        setQuestionDiagram(source);
                    } else if (mainkey === "solutionData") {
                        setSolutionDiagram(source)
                    }


                    // Insert the image into the textarea
                    const textarea = e.target;
                    textarea.focus();
                    textarea.value = `![image]${source}`;

                    // Stop the default paste action
                    e.preventDefault();
                }
            }
        }
    }

    return (
        <div style={{ display: "flex" }}>
            <div>
                <button style={{ margin: "10px" }} type="button" onClick={addQuestion}>Add Question</button>
                <div className="sidebar">
                    <ul>
                        {
                            menuItems.map(item => (
                                <li onClick={onQuestionSelect} key={item} data-item={item}>Question {item}</li>
                            ))
                        }
                    </ul>
                </div>
            </div>


            <div style={{ margin: "10px 50px", width: "100%" }}>
                {data === null && <p></p>}
                {data && (
                    <form onSubmit={submitHandler}>
                        {Object.keys(data).map(key => (
                            <div key={key}>
                                <h3>{key}</h3>
                                {Object.keys(data[key]).map(subKey => (
                                    <label key={subKey} style={{ margin: "10px 0", display: "flex", flexDirection: "column" }}>
                                        {subKey}:
                                        {(key === "questionData" || key === "solutionData") && <Markdown>{data[key][subKey].replace(/\\\\/g, '\\')}</Markdown>}
                                        {questionDiagram && key === "questionData" && subKey === "diagram" && (
                                            <img src={questionDiagram} alt="" />
                                        )}
                                        {solutionDiagram && key === "solutionData" && subKey === "diagram" && (
                                            <img src={solutionDiagram} alt="" />
                                        )}

                                        <textarea
                                            mainkey={key}
                                            subkey={subKey}
                                            value={data[key][subKey]}
                                            onChange={changeHandler}
                                            onPaste={uploadImage}
                                        />

                                    </label>
                                ))}
                            </div>
                        ))}
                        <button type="submit" style={{ margin: "20px 0" }}>Save</button>
                    </form>
                )}
            </div>

        </div>
    );
}

export default Question;