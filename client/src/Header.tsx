import React, { FC } from 'react';
import { Link } from 'react-router-dom';
import { useMeQuery, useLogoutMutation } from './generated/graphql';
import { setAccessToken } from './accessToken';

export interface HeaderProps {}

const Header: FC<HeaderProps> = props => {
  const { data, loading } = useMeQuery();
  const [logout, { client }] = useLogoutMutation();

  let body: any = null;

  if (loading) {
    body = null;
  } else if (data && data.me) {
    body = (
      <>
        <div>You are logged in as {data.me.email}</div>
        <button
          onClick={async () => {
            await logout();
            setAccessToken('');
            await client!.resetStore();
          }}
        >
          Logout
        </button>
      </>
    );
  } else {
    body = <div> You are not logged in </div>;
  }

  return (
    <header>
      <div>
        <Link to="/register"> Register </Link>
      </div>
      <div>
        <Link to="/login"> Login </Link>
      </div>
      <div>
        <Link to="/"> Home </Link>
      </div>
      <div>
        <Link to="/bye"> Bye </Link>
      </div>
      {body}
    </header>
  );
};

export default Header;
