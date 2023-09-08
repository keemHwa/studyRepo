import { useSelector, useDispatch } from "react-redux"; // useStore도 있지만 selector가 더 유용
import classes from "./Counter.module.css";

const Counter = () => {
  const dispatch = useDispatch(); // action
  const counter = useSelector((state) => state.counter); // useSelector를 사용함으로써 리덕스 저장소에 자동 구독 설정한다.
  // 해당 리덕스 상태를 받는다.
  // 또한 함수를 통해 상태에서 일부분만 추출 가능
  // 구독 === useSelector로 선택한 상태는 리덕스 저장소에 데이터가 변경 될 때마다 자동으로 업데이트 되며 컴포넌트도 재실행되고 받아온 최신데이터를 기반으로 렌더링을 진행한다.
  const show = useSelector((state) => state.showCounter);
  const incrementHandler = () => {
    dispatch({ type: "increment" });
  };
  const increaseHandler = () => {
    dispatch({ type: "increase", amount: 5 });
    // 페이로드(action 객체에 추가할 수 있는 추가적인 속성, 여기선 amount)
  };
  const decrementHandler = () => {
    dispatch({ type: "decrement" });
  };
  const toggleCounterHandler = () => {
    // 해당 컴포넌트에만 관련 상태는 로컬 상태로 설정(useSteate)로 하는게 맞다 .
    // 지금은 공부용으로 . .
    dispatch({ type: "toggle" });
  };

  return (
    <main className={classes.counter}>
      <h1>Redux Counter</h1>
      {show && <div className={classes.value}>{counter}</div>}
      <div>
        <button onClick={incrementHandler}>Increment</button>
        <button onClick={increaseHandler}>Increment by 5</button>
        <button onClick={decrementHandler}>Decrement</button>
      </div>
      <button onClick={toggleCounterHandler}>Toggle Counter</button>
    </main>
  );
};

export default Counter;
