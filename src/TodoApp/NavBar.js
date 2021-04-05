import React from 'react';
import styled from 'styled-components';
import { Box, Button, Tab, Tabs } from '@material-ui/core';

const NavWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  align-self: auto;
  position: relative;
  .nav-center {
    flex: 0 1 auto;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
  }
  .nav-right {
    flex: 0 1 auto;
    margin: 0.5rem 0.5rem 0 auto;
  }
`;

const NavBar = ({ onTabChange, tabValue, isTodosLoading, onLogOut }) => {
  return (
    <NavWrapper>
      <Box className="nav-center" sx={{ width: '100%' }}>
        <Tabs
          textColor="primary"
          indicatorColor="primary"
          onChange={(event, value) => {
            onTabChange(value);
          }}
          value={tabValue}
          centered
        >
          <Tab label="show all" disabled={isTodosLoading} />
          <Tab label="prioritized" disabled={isTodosLoading} />
          <Tab label="completed" disabled={isTodosLoading} />
        </Tabs>
      </Box>
      <Button className="nav-right" color="primary" onClick={() => onLogOut()}>
        Logout
      </Button>
    </NavWrapper>
  );
};

export default NavBar;
