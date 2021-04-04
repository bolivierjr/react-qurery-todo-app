import React from 'react';
import styled from 'styled-components';
import TodoApp from './TodoApp';

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  height: 100%;
`;

function App() {
  return (
    <div className="App">
      <Wrapper>
        <TodoApp />
      </Wrapper>
    </div>
  );
}

export default App;
