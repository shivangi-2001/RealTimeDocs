import React, { useEffect } from "react";

const GithubLogin = () => {
    const github_login = () => {
        window.location.href = 'http://localhost:8000/auth/github';
    }
    return (
        <React.Fragment>
            <button className="p-3 shadow rounded-full hover:bg-gray-200" onClick={github_login}>
              <img src="/github.png" alt="GitHub" className="w-6" />
            </button>
        </React.Fragment>
     );
}
 
export default GithubLogin;