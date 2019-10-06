import React, { FC, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { useLoginMutation, MeDocument, MeQuery } from '../generated/graphql';
import { setAccessToken } from '../accessToken';

const Login: FC<RouteComponentProps> = ({ history }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [login] = useLoginMutation();

  return (
    <form
      onSubmit={async e => {
        e.preventDefault();
        console.log(email, password);
        const { data } = await login({
          variables: { email, password },
          update: (store, { data }) => {
            if (!data) {
              return null;
            }

            store.writeQuery<MeQuery>({
              query: MeDocument,
              data: { me: data.login.user },
            });
          },
        });
        console.log('Form submitted!!!', data);

        if (data && data.login) {
          setAccessToken(data.login.accessToken);
        }

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
        <button type="submit"> Login </button>
      </div>
    </form>
  );
};

export default Login;
