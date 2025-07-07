# [React18+TS+Vite 从 0 自定义组件库实战复杂项目](https://coding.imooc.com/class/639.html)

-   融复杂业务拆解、通用组件设计封装、性能优化等"高手"必备技能，开发一套高质量及业务完备的高性能阅读 APP

# React 常用的 Hook 及其使用场景如下，并附有简单示例：

## **1、useSate**

-   **用途：** 让你在函数组件中添加状态。

-   **使用场景：** 需要在组件内维护数据（如计数、表单输入等）。

    ```js
    import { useState } from 'react';

    function Counter() {
        const [count, setCount] = useState(0);
        return <button onClick={() => setCount(count + 1)}>{count}</button>;
    }
    ```

## **2、useEffect**

-   **用途：** 处理副作用（如数据请求、订阅、手动 DOM 操作等）。

-   **使用场景：** 组件挂载、更新、卸载时需要执行操作。

    ```js
    import { useEffect } from 'react';

    function Example() {
        useEffect(() => {
            document.title = '页面已加载';
            return () => {
                document.title = '页面已卸载';
            };
        }, []);
        return <div>示例</div>;
    }
    ```

## **3、useContext**

-   **用途：** 在组件树中共享全局数据。

-   **使用场景：** 主题、用户信息等全局状态。

    ```js
    const MyContext = React.createContext(null);

    function App() {
        return (
            <MyContext.Provider value="Hello World">
                <Toolbar />
            </MyContext.Provider>
        );
    }

    function Toolbar(props) {
        const value = useContext(MyContext);
        return <div>{value}</div>;
    }
    ```

## **4、useReducer**

-   **用途：** 以 reducer 方式管理复杂状态。

-   **使用场景：** 状态逻辑复杂或多个子值相互关联时。

    ```js
    import { useReducer } from 'react';

    function reducer(state, action) {
        switch (action.type) {
            case 'increment':
                return { count: state.count + 1 };
            default:
                return state;
        }
    }
    function Counter() {
        const [state, dispatch] = useReducer(reducer, { count: 0 });
        return <button onClick={() => dispatch({ type: 'increment' })}>{state.count}</button>;
    }
    ```

## **5、useRef**

-   **用途：** 获取/保存可变的引用值，不会引起组件重新渲染。

-   **使用场景：** 访问 DOM 元素、保存定时器等

    ```js
    import { useRef } from 'react';

    function InputFocus() {
        const inputRef = useRef < HTMLInputElement > null;
        return (
            <>
                <input ref={inputRef} />
                <button onClick={() => inputRef.current?.focus()}>聚焦</button>
            </>
        );
    }
    ```

## **6、useMemo**

-   **用途：** 缓存计算结果，避免不必要的重复计算。

-   **使用场景：** 性能优化，依赖项不变时复用计算结果。

    ```js
    import { useMemo } from 'react';

    function ExpensiveComponent({ num }) {
        const result = useMemo(() => {
            return num * 2; // 假设是复杂计算
        }, [num]);
        return <div>{result}</div>;
    }
    ```

## **7、useCallback**

-   **用途：** 缓存函数实例，避免子组件不必要的渲染。

-   **使用场景：** 尤其是在将回调函数作为 props 传递给子组件时。通过使用 useCallback，你可以确保只有在依赖项发生变化时，回调函数才会被重新创建。
-   **父组件：**

    ```js
    import React, { useState, useCallback } from 'react';
    import ChildComponent from './ChildComponent';

    function ParentComponent() {
        const [count, setCount] = useState(0);
        const [text, setText] = useState('');

        // 使用 useCallback 缓存 handleIncrement 函数
        const handleIncrement = useCallback(() => {
            setCount((c) => c + 1);
        }, []); // 没有依赖项，因此此函数只会被创建一次

        return (
            <div>
                <input value={text} onChange={(e) => setText(e.target.value)} />
                <p>Count: {count}</p>
                {/* 将 handleIncrement 作为 prop 传递给子组件 */}
                <ChildComponent onIncrement={handleIncrement} />
            </div>
        );
    }

    export default ParentComponent;
    ```

-   **子组件：**

    ```js
    import React from 'react';

    // 使用 React.memo 防止不必要的重新渲染
    const ChildComponent = React.memo(({ onIncrement }) => {
        console.log('ChildComponent render'); // 这里可以观察到渲染日志

        return <button onClick={onIncrement}>Increment Count</button>;
    });

    export default ChildComponent;
    ```

## **8、useLayoutEffect**

-   **用途：** 在所有的 DOM 变更之后，在浏览器绘制之前执行

-   **使用场景：** 需要读取布局并同步触发重绘。

    ```js
    import React, { useLayoutEffect, useRef } from 'react';

    function MeasureExample() {
        const divRef = useRef(null);

        useLayoutEffect(() => {
            // 测量一个元素的宽度
            const { width } = divRef.current.getBoundingClientRect();
            console.log('div width:', width);
        }, []); // 空数组表示仅在组件挂载和卸载时执行

        return <div ref={divRef}>查看控制台输出此 div 的宽度</div>;
    }

    export default MeasureExample;
    ```

## **9、useImperativeHandle**

-   **用途：** 是 React 中一个专门用于自定义暴露子组件方法或属性的 Hook，通常与 forwardRef 一起使用。

-   **使用场景：** 父组件调用子组件中的方法。

-   **子组件（使用 useImperativeHandle）**

    ```js
    import React, { useState, useImperativeHandle, forwardRef } from 'react';

    const ChildComponent = forwardRef((props, ref) => {
        const [inputValue, setInputValue] = useState('');

        // 自定义通过 ref 暴露的方法
        useImperativeHandle(ref, () => ({
            focusInput: () => {
                console.log('子组件方法被调用');
                const input = document.getElementById('my-input');
                if (input) input.focus();
            },
            getInputValue: () => inputValue,
        }));

        return (
            <div>
                <input
                    id="my-input"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="输入内容..."
                />
            </div>
        );
    });

    export default ChildComponent;
    ```

-   **父组件（通过 ref 调用子组件的方法）**

    ```js
    import React, { useRef } from 'react';
    import ChildComponent from './ChildComponent';

    function ParentComponent() {
        const childRef = useRef();

        const handleFocusClick = () => {
            if (childRef.current && childRef.current.focusInput) {
                childRef.current.focusInput(); // 调用子组件暴露的方法
            }
        };

        const handleGetValue = () => {
            if (childRef.current && childRef.current.getInputValue) {
                alert('子组件输入框的值是：' + childRef.current.getInputValue());
            }
        };

        return (
            <div>
                <h2>父组件</h2>
                <ChildComponent ref={childRef} />
                <button onClick={handleFocusClick}>聚焦输入框</button>
                <button onClick={handleGetValue}>获取输入框的值</button>
            </div>
        );
    }

    export default ParentComponent;
    ```
