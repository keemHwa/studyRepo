import { useNavigate, useSearchParams } from "react-router-dom";

const Edit = () => {

    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams(); // Query String ?id=

    const id = searchParams.get('id');
    console.log(id);

    return (
        <div>
            <h1>Edit</h1>
            <p2>이곳은 일기 편집 페이지 입니다.</p2>
            <button onClick={() => setSearchParams({who:'kjs'})}> Query String 바꾸기 </button>
            <button onClick={() => navigate('/home')}>홈으로가기</button>
            <button onClick={() => navigate(-1)}>뒤로가기</button>
        </div>
    );
};

export default Edit;