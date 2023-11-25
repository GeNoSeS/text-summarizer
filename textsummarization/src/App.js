import "./App.css";
import { useState } from "react";
import openai from "./api";

function App() {
  const [text, setText] = useState("");
  const [summarizedtext, setsummarizedtext] = useState("");
  const [loading, setLoading] = useState(false);



  const HandleSubmit = (e) => {
      // Set loading to true to indicate that a request is in progress
      setLoading(true);
      // Prevent the default form submission behavior
      e.preventDefault();
    // Call the OpenAI API to generate a completion
    openai
      .createCompletion({
        model: "text-davinci-003",
        prompt: generatePrompt(text),
        temperature: 0.6,
        max_tokens: 100,
      })
      .then((res) => {
        if (res.status === 200) {
          setLoading(false);
        // Set the summarized text in the state based on the API response
          setsummarizedtext(res?.data?.choices[0]?.text);
          saveToMongoDB(text, res?.data?.choices[0]?.text);
        }
      })
      .catch((err) => {
        console.log(err, "An error occured");
      });
  };
  const saveToMongoDB = async (inputText, summarizedText) => {
    try {
      const response = await fetch('http://localhost:3001/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ inputText, summarizedText }),
      });
  
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error('Error saving to MongoDB:', error);
    }
  };

  function generatePrompt(text) {
    // return `Summarize this in five lines ${text}. and break them into seperate lines`;
    return `Summarize this  ${text}. and break them into seperate lines`;
  }

  return (
    <div className="App_">
      <div className="header">
        <h1 className="header_text">
          Text <span className="text_active">Summarizer</span>
        </h1>
        <h2 className="header_summary">
          {" "}
          Summarise your text into a shorter length.
        </h2>
      </div>
      <div className="container">
        <div className="text_form">
          <form>
            <label>Enter your text</label>
            <textarea
              rows={14}
              cols={80}
              placeholder="Put your text"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </form>
        </div>
        <div>
          <button type="button" onClick={HandleSubmit}>
            {loading ? "loading..." : "Summarize"}
          </button>
        </div>
        <div className="summarized_text">
          <label>Summarized text</label>
          <textarea
            placeholder="Summarized text"
            cols={80}
            rows={14}
            value={summarizedtext}
            onChange={(e) => setText(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
