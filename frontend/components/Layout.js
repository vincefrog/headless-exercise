import React from 'react';
import Header from './Header';

const Layout = props => {
  const { children } = props;
  return (
    <div>
      <Header />
      <main>
        {children}
      </main>
    </div>
  );
};

export default Layout;
