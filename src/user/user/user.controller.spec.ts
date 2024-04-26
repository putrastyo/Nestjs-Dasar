import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import * as httpMock from 'node-mocks-http';
import { UserService } from './user.service';

describe('UserController', () => {
  let controller: UserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [UserService],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return name and age', () => {
    expect(controller.get('putra', 25)).toBe(
      'Nama adalah: putra, Umur adalah: 25',
    );
  });

  it('should return view', () => {
    const response = httpMock.createResponse();
    controller.getView('Eko', response);

    expect(response._getRenderView()).toBe('index.html');
    expect(response._getRenderData()).toEqual({
      name: 'Eko',
      title: 'Template Engine',
    });
  });

  it('should return name', () => {
    expect(controller.getName()).toBe('Ben10');
  });
});
