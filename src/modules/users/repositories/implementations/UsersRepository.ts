import { getRepository, Repository } from 'typeorm';

import { IFindUserWithGamesDTO, IFindUserByFullNameDTO } from '../../dtos';
import { User } from '../../entities/User';
import { IUsersRepository } from '../IUsersRepository';

export class UsersRepository implements IUsersRepository {
  private repository: Repository<User>;

  constructor() {
    this.repository = getRepository(User);
  }

  async findUserWithGamesById({
    user_id,
  }: IFindUserWithGamesDTO): Promise<User> {
      return this.repository.createQueryBuilder("U")
              .leftJoinAndSelect("U.games", "G")
              .where("U.id = :id", {id: user_id})
              .getOneOrFail();
              
  }

  async findAllUsersOrderedByFirstName(): Promise<User[]> {
    return this.repository.query(
      "SELECT * FROM USERS ORDER BY first_name ASC"
    ); // Complete usando raw query
  }

  async findUserByFullName({
    first_name,
    last_name,
  }: IFindUserByFullNameDTO): Promise<User[] | undefined> {
    return this.repository.query(
      "SELECT * FROM USERS WHERE LOWER(first_name) = LOWER($1) AND LOWER(last_name) = LOWER($2)",
      [first_name, last_name]
    ); 
  }
}
