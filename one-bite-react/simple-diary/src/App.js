import React, { useMemo, useState, useRef, useEffect, useCallback, useReducer } from 'react';
// 비구조할당을 통해 import 받은 것들은 이름을 바꿔서 받을 수없고 (export conts .. ), 
// React같이 직접 import한건 export default 된 것으로 이름을 바꾸어 받을 수있다. 
import './App.css';
import DiaryEditor from './DiaryEditor';
import DiaryList from './DiaryList';
// import OptimizeTest from './OptimizeTest';
// import Lifecycle from './Lifecycle';
// import LifecycleUnmount from './LifecycleUnmount';


const reducer = (state, action) => {
  switch (action.type) { // return 된 값으로 상태가 변한다.
    case 'INIT': {
      return action.data //이 값으로 새로운 state(상태)가 된다.
    }
    case 'CREATE': {
      const create_date = new Date().getTime();
      const newItem = { ...action.data, create_date: create_date };
      return [newItem, ...state]; // 기존 데이터(=state);
    }
    case 'REMOVE': {
      return state.filter((it) => it.id !== action.targetId);
    }
    case 'EDIT': {
      return state.map((it) => it.id === action.targetId ?
        { ...it, content: action.newContent } : it);
    }
    default:
    return state;
  }
}

// context API를 이용한 prop drilling 막기 
export const DiaryStateContext = React.createContext(); // 오직 data
  // export default는 하나만 사용가능 
export const DiaryDispatchContext = React.createContext(); // 상태변화함수용 
/* 값(data)과 상태변화 함수(onCreate, onUpdate, onDelete)를 각각 다른 객체로 묶어주기 때문에 
값의 변화에도 상태변화 함수를 묶는 객체가 다시 생성되지는 않는다,(useMemo 적용시)*/


function App() {

  // const [data, setData] = useState([]); // 일기배열 
  const [data, dispatch] = useReducer(reducer, []);// App 컴포넌트에서 상태변화로직(onCreate..같은)을 분리 할 수 있는 useReducer hook
    // dispatch(상태변화함수)는 함수형 업데이트 상관없이 호출하면 현재의 state를 reucer 함수가 참조하여 자동으로 하기에, usecallback과 사용시 dependency array를 걱정하지 않아도 된다. 

  const dataId = useRef(0); //useRef의 일반적인 변수 대신 사용 (어떤 dom도 선택 X, 0을가르킴 )
  
  const getDate = async () => {
    const res = await fetch('https://jsonplaceholder.typicode.com/posts/1/comments')
      .then((res) => res.json());
    //console.log(res);
    
    const initData = res.map((it) => {
      return {
        author: it.email,
        content: it.body,
        emotion: Math.floor(Math.random() * 5) + 1,
        create_date: new Date().getTime(),
        id: dataId.current++
      }
    })
    dispatch({ type: 'INIT', data: initData });
    // setData(initData);
  }

  useEffect(() => {
    getDate();  
  }, []); // mount, 컴포넌트 탄생시 실행

 
  // 리액트는 데이터가 단방향으로 흐르기때문에, data를 변경할 수 있는 setData를 밑으로 보내주어 data를 변경 할 수 있게 해야한다.
  const onCreate = useCallback(
    (author, content, emotion) => {
      /* useCallback을 쓰는 이유
        - data 길이 상관없이 컴포넌트가 mount되는 시점에 한번만 생성해서, 이후 일기 삭제나 기타 동작 시 재생성 되지 않도록 하기위해
      => 이후 data추가시 기존에 데이터는 사라지고 새로 추가한 데이터만 들어오는 이슈 발생 !
        왜냐하면 생성 당시 data는 빈 배열(현재 data값을 가져오지 못함) 이기에 이후 onCreate시 빈배열에 data가 추가된다.
        이걸 고치려면 dependency array에 data를 넣고 data가 변경 될 때 재생성하게끔 해야하는 딜레마에 빠진다.
        함수형 업데이트(상태변화 함수(set)에 함수를 전달) 를 사용하면 된다. ex) setData((data) => [newItem, ...data])
      이렇게 함으로써 한번만 생성하고, 추가 시 최신의 데이터를 가져와서 추가 할 수있다.  -> 연관없는 action을 줄이는..!
      */

      console.log("test");
      dispatch({
        type: 'CREATE',
        data: { author, content, emotion, id: dataId.current }
      });
    // const create_date = new Date().getTime();
    // const newItem = { // 단축 속성명 : 키와 값의 이름이 같을 경우 사용할 수있다.
    //   author, // author(키): author (인자)
    //   content,
    //   emotion,
    //   create_date,
    //   id: dataId.current
    // }
    dataId.current += 1;
    //setData([newItem, ...data]); // 새 데이터 +  기존 데이터 전개
    //setData((data) => [newItem, ...data]); // 최신의 state 인자로 가져오게된다. 
  },[]); // dependency가 없으므로 최초 한번만 생성

  const onRemove = useCallback((targetId) => { // onRemove는 한번만 생성되고 -> 재생성되면서 useEffect을 타는일은 없을 것 
    //console.log(`전달 ${targetId}`); // 해당 id 를 가진 요소를 제외한 새로운 배열을 반환 -> data 상태가 변했기 때문에 dataList가 다시 렌더
    //setData(data => data.filter((it) => it.id !== targetId)); // 최신의 state
    dispatch({ type: 'REMOVE', targetId });
  }, []);
  
  const onEdit = useCallback((targetId, newContent) => {
    //setData(data=>data.map((it) => it.id === targetId ? { ...it, content: newContent } : it));
    dispatch({ type: 'EDIT', targetId, newContent });
  }, []);

  const memoizedDispatches = useMemo(() => {
    // 여기서 useMemo를 해서 또 묶어주는 이유는 app()이 재생성 되면서 memoizedDispatches도 재성성되기 때문
    return { onCreate, onRemove, onEdit };
  }, [])  // dependency가 없으므로 최초 한번만 생성
  
  // 감정 점수 비율
  const getDiaryAnalysis = useMemo(
    () => {
      // useMemo React의 Hook 중 하나로
        // 계산 비용이 높은 연산의 결과를 캐싱하고, 이전 결과와 다를 때만 다시 계산하는 데 사용
        // 두번째 인자(data.length)로 넘긴 데이터에 변동이 있을 경우에만 콜백 함수 실행
        // 또한 콜백 함수가 리턴하는 값을 return 한다. 
      //console.log("일기 분석 시작");
      // 해당 로그 2번 호출 
      // -> 1. App 컴포넌트가 처음 mount 될 때 출력
      // -> 2. getDate() api가 성공 후 setData가 이루어 지면서  App 컴포넌트가 리렌더되면서 그안에 있는 함수가 재생성 될 때                                
      const goodCount = data.filter((it) => it.emotion >= 3).length;
      const badCount = data.length - goodCount;
      const goodRatio = (goodCount / data.length) * 100;
      return { goodCount, badCount, goodRatio };
    },[data.length]);

  const { goodCount, badCount, goodRatio } = getDiaryAnalysis;

  return (
    <DiaryStateContext.Provider value={data}>
      {/* 여기서 상태변화 함수도 같이 내려주게되면, provider도 결국 컴포넌트이기 때문에 prop이 바뀌어버리면 재생성 된다. 
        ==> 즉 data가 바뀔 때마다 최적화가 걸려있어도 상태변화 함수도 같이 리렌더링이 일어나게 된다. 
        ==> 상태변화 함수에 지금 최적화가 걸려있기 때문에 아래와 같이 중첩을 걸어주면 리렌더링 않는다.  */}
      <DiaryDispatchContext.Provider value={memoizedDispatches}>
        <div className="App">
          {/* <OptimizeTest/> */}
          {/* <Lifecycle/> */}
          {/* <LifecycleUnmount/> */}
          <DiaryEditor/>
          <div> 전체 일기 : {data.length} </div>
          <div> 기분 좋은 일기 개수 : {goodCount} </div>
          <div> 기분 나쁜 일기 개수 : {badCount} </div>
          <div> 기분 좋은 일기 비율 : {goodRatio} </div>
          <DiaryList/>  { /* diaryItem에서 ondelete를 호출 할 수 있어야하므로, 그의 부모인 diaryList에 전달*/}
        </div>
      </DiaryDispatchContext.Provider>
    </DiaryStateContext.Provider>
    
  );
}

export default App;
