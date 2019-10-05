import React, { FC, useState } from 'react';
import { useRegisterMutation } from '../generated/graphql';
import { RouteComponentProps } from 'react-router-dom';

const Register: FC<RouteComponentProps> = ({ history }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [register] = useRegisterMutation();

  return (
    <form
      onSubmit={async e => {
        e.preventDefault();
        console.log(email, password);
        const response = await register({ variables: { email, password } });
        console.log('Form submitted!!!', response);

        history.push('/');
      }}
    >
      <div>
        <input
          type="email"
          value={email}
          placeholder="Email"
          onChange={e => setEmail(e.target.value)}
        />
      </div>
      <div>
        <input
          type="password"
          value={password}
          placeholder="Password"
          onChange={e => setPassword(e.target.value)}
        />
      </div>
      <div>
        <button type="submit"> Register </button>
      </div>
    </form>
  );
};

export default Register;
