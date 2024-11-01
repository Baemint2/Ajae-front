const AddJoke = () => {
    return (
        <div>
            <h1>나만의 개그 추가해보기</h1>
            <form id="jokeForm">
                <div>
                    <label htmlFor="question">문제</label>
                    <input type="text" id="question" name="question"></input>
                </div>
                <div>
                    <label htmlFor="answer">정답</label>
                    <input type="text" id="answer" name="answer"></input>
                </div>
                <button type="submit">개그 추가하기</button>
            </form>
        </div>
    )
}

export default AddJoke;