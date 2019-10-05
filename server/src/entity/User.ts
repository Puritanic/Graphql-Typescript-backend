import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';
import { ObjectType, Field, Int } from 'type-graphql';

@ObjectType()
@Entity('users')
export class User extends BaseEntity {
	@Field(() => Int)
	@PrimaryGeneratedColumn()
	id: number;

	@Field()
	@Column('text')
	email: string;

	@Column('text')
	password: string;

	// Whenever we create a refresh token we're going to pass what the curren version of the token is
	@Column('int', { default: 0 })
	tokenVersion: number;
}
