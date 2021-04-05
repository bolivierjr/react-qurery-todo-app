import React, { useState, useEffect } from 'react';
import { Button, Checkbox, FormControlLabel, TextField } from '@material-ui/core';
import styled from 'styled-components';
import { createTodo, deleteTodo, getAllTodos, updateTodo } from '../api/todos';
import NavBar from './NavBar';
import TodoCard from './TodoCard';
import Loader from '../components/Loader';
import useCustomQuery from '../hooks/useCustomQuery';
import useCustomMutation from '../hooks/useCustomMutation';
import useOptimisticUpdates from './hooks/useOptimisticUpdates';
import { auth, signInWithGoogle, signOutOfGoogle } from '../services/firebase';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const InputWrapper = styled.div`
  margin-bottom: 1rem;
  width: 60%;
  min-width: 60%;
  display: flex;
  align-items: center;
`;

const CheckboxWrapper = styled.div`
  padding: 1rem 1rem 0 1rem;
`;

const TodosWrapper = styled.div`
  margin: 3rem auto;
  min-width: 45%;
`;

const TodoApp = () => {
  const [filteredTodos, setFilteredTodos] = useState([]);
  const [expanded, setExpanded] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [addTodoInput, setAddTodoInput] = useState('');
  const [makeNewTodoPrioritized, setMakeNewTodoPrioritized] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const { onMutateCreate, onMutateDelete, onMutateUpdate } = useOptimisticUpdates('todos');

  const {
    error: userError,
    isLoading: isUserLoading,
    isError: isUserError,
    refetch: fetchUser,
    remove: removeUser
  } = useCustomQuery('user', signInWithGoogle, {
    refetchInterval: false,
    refetchIntervalInBackground: false,
    enabled: false
  });

  const {
    data: todos,
    error: todosError,
    isLoading: isTodosLoading,
    isError: isTodosError
  } = useCustomQuery('todos', getAllTodos, { enabled: userInfo ? true : false });

  const {
    mutate: mutateCreateTodo,
    isError: isCreateError,
    error: createError
  } = useCustomMutation(
    'todos',
    ({ description, prioritize }) => createTodo(description, prioritize),
    {
      onMutate: onMutateCreate
    }
  );

  const {
    mutate: mutateUpdateTodo,
    isError: isUpdateError,
    error: updateError
  } = useCustomMutation('todos', ({ id, update }) => updateTodo(id, update), {
    onMutate: onMutateUpdate
  });

  const {
    mutate: mutateDeleteTodo,
    isError: isDeleteError,
    error: deleteError
  } = useCustomMutation('todos', deleteTodo, { onMutate: onMutateDelete });

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      setUserInfo(user);
    });
  });

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
        createTodoMutation(addTodoInput, makeNewTodoPrioritized);
        setMakeNewTodoPrioritized(false);
      }
    }
  };

  const createTodoMutation = async (description, prioritize) => {
    await mutateCreateTodo({ description, prioritize });
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

  // TODO: make real error handling messages & components
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

  if (isTodosLoading) return <Loader />;
  return !userInfo ? (
    <Button color="primary" onClick={async () => await fetchUser()}>
      Login
    </Button>
  ) : (
    <Wrapper>
      <NavBar
        onTabChange={(value) => {
          setTabValue(value);
          setExpanded(false);
        }}
        onLogOut={() => {
          signOutOfGoogle();
          removeUser();
        }}
        isTodoLoading={isTodosLoading}
        tabValue={tabValue}
      />
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
          <CheckboxWrapper>
            <FormControlLabel
              control={
                <Checkbox
                  name="PriorityCheck"
                  color="secondary"
                  onClick={() => setMakeNewTodoPrioritized((checked) => !checked)}
                  onChange={(event) => event.stopPropagation()}
                  checked={makeNewTodoPrioritized}
                />
              }
              label="Prioritize"
              labelPlacement="right"
            />
          </CheckboxWrapper>
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
              disableCard={todo.id === 'fakeId'}
            />
          ))}
      </TodosWrapper>
    </Wrapper>
  );
};

export default TodoApp;
