import { useDispatch, useSelector } from "react-redux";
import { setPageTitle } from "../feature/pageState";
import { useEffect } from "react";


const Title = () => {
    const { pageTitle} = useSelector(state => state.pageState)
    const dispatch = useDispatch()
    useEffect(() =>{
        dispatch(setPageTitle())
    }, [])
    document.title = pageTitle
}
 
export default Title;