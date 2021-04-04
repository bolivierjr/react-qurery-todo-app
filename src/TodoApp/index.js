import React, { useState, useEffect } from 'react';
import { Box, Tab, Tabs, TextField } from '@material-ui/core';
import styled from 'styled-components';
import { createTodo, deleteTodo, getAllTodos, updateTodo } from '../api/todos';
import TodoCard from './TodoCard';
import Loader from '../components/Loader';
import useCustomQuery from '../hooks/useCustomQuery';
import useUpdateMutation from './hooks/useUpdateMutation';
import useDeleteMutation from './hooks/useDeleteMutation';
import useCreateMutation from './hooks/useCreateMutation';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const InputWrapper = styled.div`
  margin-bottom: 1rem;
  width: 30%;
  min-width: 30%;
`;

const TodosWrapper = styled.div`
  margin: 5rem auto;
  min-width: 40%;
`;

const TodoApp = () => {
  const [filteredTodos, setFilteredTodos] = useState([]);
  const [expanded, setExpanded] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [addTodoInput, setAddTodoInput] = useState('');

  const {
    data: todos,
    error: todosError,
    isLoading: isTodosLoading,
    isError: isTodosError
  } = useCustomQuery('todos', getAllTodos);

  const {
    mutate: mutateCreateTodo,
    isError: isCreateError,
    error: createError
  } = useCreateMutation('todos', createTodo);

  const {
    mutate: mutateUpdateTodo,
    isError: isUpdateError,
    error: updateError
  } = useUpdateMutation('todos', ({ id, update }) => updateTodo(id, update));

  const {
    mutate: mutateDeleteTodo,
    isError: isDeleteError,
    error: deleteError
  } = useDeleteMutation('todos', deleteTodo);

  useEffect(() => {
    if (todos) setFilteredTodos(getFilteredTodos());
  }, [tabValue, todos]);

  const handleExpandChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handleOnKeyDown = (event) => {
    event.stopPropagation();
    if (event.key === 'Enter') {
      if (addTodoInput) {
        setExpanded(false);
        setAddTodoInput('');
        createTodoMutation(addTodoInput);
      }
    }
  };

  const createTodoMutation = async (todo) => {
    await mutateCreateTodo(todo);
  };

  const updateTodoMutation = async (id, update) => {
    await mutateUpdateTodo({ id, update });
  };

  const deleteTodoMutation = async (id) => {
    await mutateDeleteTodo(id);
  };

  const getFilteredTodos = () => {
    switch (tabValue) {
      case 0:
        return todos;
      case 1:
        return todos.filter((todo) => todo.prioritized && !todo.completed);
      case 2:
        return todos.filter((todo) => todo.completed);
      default:
        return todos;
    }
  };

  if (isTodosError) {
    return <span>Error: {todosError.message}</span>;
  }
  if (isCreateError) {
    return <span>Error: {createError.message}</span>;
  }
  if (isUpdateError) {
    return <span>Error: {updateError.message}</span>;
  }
  if (isDeleteError) {
    return <span>Error: {deleteError.message}</span>;
  }

  return (
    <Wrapper>
      {isTodosLoading && <Loader />}
      <Box sx={{ width: '100%' }}>
        <Tabs
          textColor="primary"
          indicatorColor="primary"
          onChange={(event, value) => {
            setTabValue(value);
            setExpanded(false);
          }}
          value={tabValue}
          centered
        >
          <Tab label="show all" disabled={isTodosLoading} />
          <Tab label="prioritized" disabled={isTodosLoading} />
          <Tab label="completed" disabled={isTodosLoading} />
        </Tabs>
      </Box>
      <TodosWrapper>
        <InputWrapper>
          <TextField
            id="demo-helper-text-misaligned"
            type="string"
            label="Add Todo"
            variant="standard"
            autoComplete="off"
            fullWidth={true}
            onChange={(event) => setAddTodoInput(event.target.value)}
            onKeyDown={handleOnKeyDown}
            value={addTodoInput}
          />
        </InputWrapper>
        {filteredTodos &&
          filteredTodos.map((todo) => (
            <TodoCard
              key={todo.id}
              todo={todo}
              expanded={expanded}
              onCompletion={() => setExpanded(false)}
              handleExpandChange={handleExpandChange}
              updateTodo={updateTodoMutation}
              deleteTodo={deleteTodoMutation}
            />
          ))}
      </TodosWrapper>
    </Wrapper>
  );
};

export default TodoApp;
