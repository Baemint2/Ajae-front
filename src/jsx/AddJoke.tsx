import "../css/addJoke.css"
import {useNavigate} from "react-router-dom";
import {ChangeEvent, useState} from "react";


const AddJoke = () => {

    const navigate = useNavigate();
    const [question, setQuestion] = useState<string>("");
    const [answer, setAnswer] = useState<string>("");

    const handleQuestionChange = (e: ChangeEvent<HTMLInputElement>) => {
        setQuestion(e.target.value);
    }

    const handleAnswerChange = (e: ChangeEvent<HTMLInputElement>) => {
        setAnswer(e.target.value);
    }

    const saveJoke = async () => {
        const body = { question, answer };
        const response = await fetch("/api/v1/joke", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body)
        });
        const data = await response.json();
        if(data.message === "문제 등록이 완료되었습니다.") {
            navigate("/userJoke");
        }
    }

    return (
        <div className="add-joke">
            <h1 className="text-3xl ">나만의 아재 개그 추가해보기</h1>
            <form className="joke-form">
                <div className="question-wrap">
                    <label htmlFor="question">문제</label>
                    <input type="text" id="question" className="question" name="question" onChange={handleQuestionChange}></input>
                </div>
                <div className="answer-wrap">
                    <label htmlFor="answer">정답</label>
                    <input type="text" id="answer" className="answer" name="answer" onChange={handleAnswerChange}></input>
                </div>
                <div className="btn-wrap">
                    <button type="button" className="cancel-btn"  onClick={() => navigate("/userJoke")}>취소</button>
                    <button type="button" onClick={() => saveJoke()}>개그 추가하기</button>
                </div>
            </form>
        </div>
    )
}

export default AddJoke;