import { auth, db } from '../services/firebase';

export const getAllTodos = async () => {
  console.table({ getAllTodos: 'fetching all todos' });
  const userId = auth.currentUser.uid;
  const result = await db.ref('/users/' + userId + '/todos').once('value');
  const todos = result.val();
  return Object.keys(todos)
    .map((key) => {
      const newTodo = todos[key];
      newTodo.id = key;
      return newTodo;
    })
    .reverse();
};

export const createTodo = async (description, prioritize) => {
  const userId = auth.currentUser.uid;
  const newTodo = {
    description: description,
    prioritized: prioritize,
    completed: false
  };
  const newTodoKey = await db
    .ref()
    .child('/users/' + userId + '/todos/')
    .push().key;
  const updates = {};
  updates['/users/' + userId + '/todos/' + newTodoKey] = newTodo;
  return await db.ref().update(updates);
};

export const updateTodo = async (id, todo) => {
  console.table({ updateTodo: todo });
  const userId = auth.currentUser.uid;
  delete todo['id'];
  return await db
    .ref()
    .child('/users/' + userId + '/todos/' + id)
    .update(todo);
};

export const deleteTodo = async (id) => {
  console.table({ deleteTodo: id });
  const userId = auth.currentUser.uid;
  return await db
    .ref()
    .child('/users/' + userId + '/todos/' + id)
    .remove();
};
