import React, { FC } from 'react';
import { useUsersQuery } from '../generated/graphql';

export interface HomeProps {}

const Home: FC<HomeProps> = props => {
  const { data, loading } = useUsersQuery({ fetchPolicy: 'network-only' });

  if (loading || !data) return <div> Loading... </div>;

  return (
    <section>
      <h1> Home </h1>
      <h3> Our Users: </h3>
      <ul>
        {data.users.map(user => (
          <li key={user.id}> {user.email} </li>
        ))}
      </ul>
    </section>
  );
};

export default Home;
