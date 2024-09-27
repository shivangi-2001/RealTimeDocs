import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useGetGithubCodeMutation } from "../../services/githubOAuth";
import { setAccessToken } from "../../feature/AuthState";
import { useDispatch } from "react-redux";

const GithubCallback = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [searchParam, setSearchParam] = useSearchParams()

    const [GithubCode, {isError}] = useGetGithubCodeMutation()

    const loginSuc = async () => {
        try {
            const code = searchParam.get("code")
            if (!code) {
                console.error("No code found in the URL");
                return;
            }
            const res = await GithubCode(code).unwrap()
            if(res.message === "Login successful"){
                dispatch(setAccessToken(res.token))
                navigate('/')
            }
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        loginSuc()
    }, [])
   
    if(isError) return (<h1>Authorizatuon Failed</h1>)

    
}
 
export default GithubCallback;