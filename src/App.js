import './css/App.css';
import {useNavigate} from "react-router-dom";

function App() {
    const navigate = useNavigate();

    const goToJoke = () => {
        navigate("/joke");
    }

  return (
    <div className="App">
      <header className="App-header">
      <h1 onClick={goToJoke} >오늘의 개-그</h1>
      </header>
    </div>
  );
}

export default App;
