import "../css/addJoke.css"
import {useNavigate} from "react-router-dom";


const AddJoke = () => {

    const navigate = useNavigate();

    const saveJoke = async () => {
        const question = document.querySelector(".question").value;
        const answer = document.querySelector(".answer").value;

        const body = {question: question, answer: answer};
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
                    <input type="text" id="question" className="question" name="question"></input>
                </div>
                <div className="answer-wrap">
                    <label htmlFor="answer">정답</label>
                    <input type="text" id="answer" className="answer" name="answer"></input>
                </div>
                <div className="btn-wrap">
                <button type="button" onClick={() => saveJoke()}>개그 추가하기</button>
                </div>
            </form>
        </div>
    )
}

export default AddJoke;