import { MiddlewareFn } from 'type-graphql';
import { MyContext } from './MyContext';
import { verify } from 'jsonwebtoken';

// We expect from user to send authorization header which is Bearer token
export const isAuth: MiddlewareFn<MyContext> = ({ context }, next) => {
	const authorization = context.req.headers['authorization'];

	if (!authorization) {
		throw new Error('Not authorized');
	}

	try {
		const token = authorization.split(' ')[1];
		const payload = verify(token, process.env.ACCESS_TOKEN_SECRET!);
		context.payload = payload as any;
	} catch (err) {
		console.error('Authorization error: ', err);
		throw new Error('Not authorized');
	}

	return next();
};
