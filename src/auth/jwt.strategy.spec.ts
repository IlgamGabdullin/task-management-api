import { JwtStrategy } from "./jwt.strategy"
import { Test } from "@nestjs/testing"
import { UserRepository } from "./user.repository"
import { UserEntity } from "./user.entity"
import { UnauthorizedException } from "@nestjs/common"

const mockUserRepositoryFactory = () => ({
  findOne: jest.fn()
})

describe('JWT Strategy', () => {
  let jwtStrategy: JwtStrategy;
  let userRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        {
          provide: UserRepository,
          useFactory: mockUserRepositoryFactory
        }
      ]
    }).compile();

    userRepository = (await module).get<UserRepository>(UserRepository);
    jwtStrategy = (await module).get<JwtStrategy>(JwtStrategy);
  });

  describe('validate method', () => {
    it('validates and return user', async () => {
      const user = new UserEntity();
      user.username = 'test';

      userRepository.findOne.mockResolvedValue(user);

      const result = await jwtStrategy.validate({username: 'test'});
      expect(userRepository.findOne).toHaveBeenCalledWith({username: 'test'});
      expect(result).toEqual(user);
    })

    it('throws UnauthorizedException as user cannot be found', () => {
      userRepository.findOne.mockResolvedValue(null);
      expect(jwtStrategy.validate({username: 'test'})).rejects.toThrow(UnauthorizedException)
    })
  })
})