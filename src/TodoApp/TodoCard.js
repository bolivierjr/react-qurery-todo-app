import React, { useState, useEffect } from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Checkbox,
  Chip,
  FormControlLabel,
  Button,
  Input
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import styled from 'styled-components';
import GreenCheckbox from '../components/GreenCheckBox';
import GreenChip from '../components/GreenChip';

const SummaryWrapper = styled.div`
  width: 100%;
  padding: 0 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .task-description {
    text-decoration: ${({ completed }) => (completed ? 'line-through' : 'none')};
  }
`;

const DetailsWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-around;
  align-items: center;
`;

const EmptyDiv = styled.div`
  width: 82.69px;
`;

const TodoCard = ({
  expanded,
  handleExpandChange,
  todo,
  updateTodo,
  deleteTodo,
  onCompletion,
  disableCard
}) => {
  const [priorityChecked, setPriorityChecked] = useState(false);
  const [completedChecked, setCompletedChecked] = useState(false);
  const [todoInput, setTodoInput] = useState('');
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    setPriorityChecked(todo.prioritized);
    setCompletedChecked(todo.completed);
    setTodoInput(todo.description);
  }, [todo]);

  const handleCompletedClick = (event) => {
    event.stopPropagation();
    if (!completedChecked) onCompletion();
    updateTodo(todo.id, { completed: !completedChecked });
    setCompletedChecked((prevState) => !prevState);
  };

  const handlePriorityClick = (event) => {
    event.stopPropagation();
    updateTodo(todo.id, { prioritized: !priorityChecked });
    setPriorityChecked((prevState) => !prevState);
  };

  const handleUpdateTodo = (event) => {
    if (todoInput && todo.description !== todoInput) {
      updateTodo(todo.id, { description: todoInput });
    } else {
      setTodoInput(todo.description);
    }
    setEditMode(false);
  };

  const getTodoDescription = () => {
    return !editMode ? (
      <p className="task-description">{todo.description}</p>
    ) : (
      <Input
        id="filled-basic"
        label="Filled"
        variant="filled"
        onBlur={handleUpdateTodo}
        autoComplete="off"
        autoFocus={true}
        onClick={(event) => event.stopPropagation()}
        onChange={(event) => setTodoInput(event.target.value)}
        value={todoInput}
        disabled={disableCard}
      />
    );
  };

  const getChipLabel = () => {
    if (todo.completed) {
      return <GreenChip label="Completed" />;
    } else if (todo.prioritized) {
      return <Chip label="Prioritized" color="secondary" />;
    } else {
      return <EmptyDiv />;
    }
  };

  return (
    <Accordion
      expanded={expanded === `panel${todo.id}`}
      onChange={handleExpandChange(`panel${todo.id}`)}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls={`panel${todo.id}-content`}
        id={`panel${todo.id}-header`}
      >
        <SummaryWrapper completed={completedChecked}>
          <GreenCheckbox
            name="CompletedCheck"
            onClick={handleCompletedClick}
            onChange={(event) => event.stopPropagation()}
            checked={completedChecked}
            disabled={disableCard}
          />
          {getTodoDescription()}
          {getChipLabel()}
        </SummaryWrapper>
      </AccordionSummary>
      <AccordionDetails>
        <DetailsWrapper>
          <FormControlLabel
            control={
              <Checkbox
                name="PriorityCheck"
                color="secondary"
                onClick={handlePriorityClick}
                onChange={(event) => event.stopPropagation()}
                checked={priorityChecked}
                disabled={completedChecked || disableCard}
              />
            }
            label="Prioritize"
            labelPlacement="right"
          />
          <div>
            <Button
              color="default"
              onClick={() => setEditMode(true)}
              disabled={completedChecked || editMode || disableCard}
            >
              Edit
            </Button>
            <Button color="secondary" onClick={() => deleteTodo(todo.id)} disabled={disableCard}>
              Delete
            </Button>
          </div>
        </DetailsWrapper>
      </AccordionDetails>
    </Accordion>
  );
};

export default TodoCard;
