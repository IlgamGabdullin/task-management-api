import { Test } from "@nestjs/testing";
import { UserRepository } from "./user.repository";
import { ConflictException, InternalServerErrorException } from "@nestjs/common";
import { UserEntity } from "./user.entity";

const mockCredentialsDto = {username: 'Alex Guard', password: 'Ww112233.'}

describe('UserRepository', () => {
  let userRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UserRepository
      ]
    }).compile();

    userRepository = (await module).get<UserRepository>(UserRepository);
  });


  describe('Sign Up', () => {
    let save;
    beforeEach(() => {
      save = jest.fn();
      userRepository.create = jest.fn().mockReturnValue({save});
    });


    it('succesfully signs up user', () => {
      save.mockResolvedValue(undefined);
      expect(userRepository.signUp(mockCredentialsDto)).resolves.not.toThrow();
    });


    it('throws a conflict exceptions that user already exists', () => {
      save.mockRejectedValue({code: '23505'});
      expect(userRepository.signUp(mockCredentialsDto)).rejects.toThrow(ConflictException);
    })

    it('throws a conflict exceptions with internal server error', () => {
      save.mockRejectedValue({code: '1212'});
      expect(userRepository.signUp(mockCredentialsDto)).rejects.toThrow(InternalServerErrorException);
    })
  })

  describe('Validate user password', () => {
    let user;

    beforeEach(() => {
      userRepository.findOne = jest.fn();

      user = new UserEntity();
      user.username = 'testname';
      user.validatePassword = jest.fn();
    });

    it('returns the username as validation is succesfull', async () => {
      userRepository.findOne.mockResolvedValue(user);
      user.validatePassword.mockResolvedValue(true);

      const result = await userRepository.validateUserPassword(mockCredentialsDto);
      expect(result).toEqual('testname')
    })

    it('return null as user cannot be find', async () => {
      userRepository.findOne.mockResolvedValue(null);
      const result = await userRepository.validateUserPassword(mockCredentialsDto);
      expect(user.validatePassword).not.toHaveBeenCalled();
      expect(result).toBeNull();
    })


    it('return null as password is invalid', async () => {
      userRepository.findOne.mockResolvedValue(user);
      user.validatePassword.mockResolvedValue(false);

      const result = await userRepository.validateUserPassword(mockCredentialsDto);
      expect(result).toEqual(null);
    })
  })
})