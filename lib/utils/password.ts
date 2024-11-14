import argon2 from 'argon2';

export const verifyPassword = async (
	enteredPassword: string,
	storedPassword: string
) => {
	try {
		const isMatch = await argon2.verify(storedPassword, enteredPassword);
		return isMatch;
	} catch (error) {
		throw new Error('Password verification failed');
	}
};

export const encryptPassword = async (password: string) => {
	const hashedPassword = await argon2.hash(password);
	return hashedPassword;
};
