import * as bcrypt from 'bcrypt';

export const _hash = (password: string, salts = 10) =>
  bcrypt.hashSync(password, salts);

export const _compare = (password: string, hash: string) =>
  bcrypt.compareSync(password, hash);
