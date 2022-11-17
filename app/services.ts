import { type Authenticator } from "remix-auth";

export interface Item {
	id: string;
	label: string;
}

export interface ItemsService {
	getAllItems(): Promise<Item[]>;
	getItemById(id: string): Promise<Item | undefined>;
	createItem({ label }: { label: string }): Promise<string>;
	deleteItemById(id: string): Promise<void>;
}

export interface User {
	id: string;
}

export interface AuthService {
	authenticator: Authenticator<User>;
	getUser(request: Request): Promise<User | undefined>;
	requireUser(request: Request): Promise<User>;
	// setUser(request: Request, user: User): Promise<string>;
	destroySession(request: Request): Promise<string>;
}
