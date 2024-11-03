import React, {useState, useEffect} from "react";

const MyBookmark = () => {

    const [bookmark, setBookmark] = useState({});

    useEffect(() => {
        getAllJoke();
    }, [])

    const getAllJoke = () => {
        fetch("/api/v1/allJoke")
            .then(response => response.json())
            .then(data => {
                console.log(data)
                setBookmark(data)
            })
    }
    return (
        <div className="my-bookmark">
            <h1 className="text-3xl">내 북마크</h1>
            {bookmark.map((item, index) => (
                <div className="border border-sky-400 rounded-3xl mb-10" key={index}>
                    <div className="joke-wrap">
                        <span>{item.question}</span>
                        <span>{item.answer}</span>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default MyBookmark