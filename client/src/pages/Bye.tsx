import React, { FC } from 'react';
import { useByeQuery } from '../generated/graphql';

export interface ByeProps {}

const Bye: FC<ByeProps> = props => {
  const { data, loading, error } = useByeQuery();

  if (loading) return <p> Loading!!! </p>;

  if (error) {
    console.log('ERROR', error);
    return <p>Error: {JSON.stringify(error)} </p>;
  }

  if (!data) {
    return <p> No Data! </p>;
  }

  return <p>Bye! {data.bye} </p>;
};

export default Bye;
