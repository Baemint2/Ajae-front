import naverLogin from "../img/btnG_official.png";
import kakaoLogin from "../img/kakao_login_medium_narrow.png";
import googleLogin from "../img/web_light_sq_SI@2x.png";

const Login = () => {
    const handleLogin = (provider) => {
        window.location.href = `http://localhost:8080/oauth2/authorization/${provider}`;
    }

    return (

        <div className="login-container">
            <h1 className="text-3xl font-bold text-center mb-5">간편 로그인 하기</h1>
            <img id="kakao-login" 
                 src={kakaoLogin} 
                 alt="카카오 로그인"
                 onClick={() => handleLogin("kakao")}>
                 </img>
            <img id="naver-login" src={naverLogin} alt="네이버 로그인" onClick={() => handleLogin("naver")}></img>
            <img id="google-login" src={googleLogin} alt="구글 로그인" onClick={() => handleLogin("google")}></img>
        </div>
    )
}

export default Login;