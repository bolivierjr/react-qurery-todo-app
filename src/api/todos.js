import { v4 as uuidv4 } from 'uuid';

const idOne = uuidv4();
const idTwo = uuidv4();
let todos = {
  [idOne]: {
    id: idOne,
    description: 'My first today item',
    prioritized: true,
    completed: false
  },
  [idTwo]: {
    id: idTwo,
    description: 'My second today item',
    prioritized: false,
    completed: false
  }
};

export const getAllTodos = async () => {
  console.table({ getAllTodos: 'fetching all todos' });
  return new Promise((resolve, reject) => {
    if (!todos) {
      setTimeout(() => reject(new Error('No todos found.')), 1500);
    } else {
      setTimeout(() => resolve(Object.values(todos)), 1500);
    }
  });
};

export const createTodo = (todo) => {
  return new Promise((resolve, reject) => {
    const id = uuidv4();
    if (!todos) {
      setTimeout(() => reject(new Error('No todos found.')), 1500);
    } else if (!todo) {
      setTimeout(() => reject(new Error('Missing todo value.')), 1500);
    } else {
      const newTodo = {
        id,
        completed: false,
        prioritized: false,
        description: todo
      };
      todos = { [id]: newTodo, ...todos };
      setTimeout(() => resolve(true), 1500);
    }
  });
};

export const getTodo = async (id) => {
  return new Promise((resolve, reject) => {
    if (!todos[id]) {
      setTimeout(() => reject(new Error('Todo not found.')), 1500);
    } else {
      setTimeout(() => resolve(todos[id]), 1500);
    }
  });
};

export const updateTodo = async (id, todo) => {
  console.table({ updateTodo: todo });
  return new Promise((resolve, reject) => {
    if (!todos[id]) {
      setTimeout(() => reject(new Error('Todo not found')), 1500);
    } else {
      todos[id] = { ...todos[id], ...todo };
      setTimeout(() => resolve(true), 1500);
    }
  });
};

export const deleteTodo = async (id) => {
  console.table({ deleteTodo: id });
  return new Promise((resolve, reject) => {
    if (!todos[id]) {
      setTimeout(() => reject(new Error('Todo not found')), 1500);
    } else {
      const { [id]: todo, ...rest } = todos;
      todos = { ...rest };
      setTimeout(() => resolve(true), 1500);
    }
  });
};
