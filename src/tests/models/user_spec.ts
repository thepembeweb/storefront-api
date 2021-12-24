import { User, UserStore } from '../../models/user';
import { mockPassword, mockUser, mockUpdatedFirstName } from '../../mocks/user';
import { TIMEOUT_INTERVAL } from '../../utils/common-utils';

const DEFAULT_TIMEOUT_INTERVAL = jasmine.DEFAULT_TIMEOUT_INTERVAL;

let user: User;
const store = new UserStore();

describe('Tests for User Model', () => {
  beforeAll(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT_INTERVAL;
  });

  afterAll(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = DEFAULT_TIMEOUT_INTERVAL;
  });

  it('should have an index method', () => {
    expect(store.index).toBeDefined();
  });

  it('should have a show method', () => {
    expect(store.show).toBeDefined();
  });

  it('should have a create method', () => {
    expect(store.create).toBeDefined();
  });

  it('should have a update method', () => {
    expect(store.update).toBeDefined();
  });

  it('should have a delete method', () => {
    expect(store.delete).toBeDefined();
  });

  it('should have a authenticate method', () => {
    expect(store.authenticate).toBeDefined();
  });

  it('create method should add a user', async () => {
    user = await store.create({
      username: mockUser.username,
      firstName: mockUser.firstName,
      lastName: mockUser.lastName,
      password: mockPassword
    });

    expect(user).toBeDefined();
    expect(user.username).toEqual(mockUser.username);
    expect(user.firstName).toEqual(mockUser.firstName);
    expect(user.lastName).toEqual(mockUser.lastName);
  });

  it('index method should return a list of users', async () => {
    const result = await store.index();

    expect(result).toBeDefined();
    expect(result.length).toEqual(1);
    expect(result[0].username).toEqual(mockUser.username);
    expect(result[0].firstName).toEqual(mockUser.firstName);
    expect(result[0].lastName).toEqual(mockUser.lastName);
  });

  it('show method should return the correct user', async () => {
    const result = await store.show(String(user.id));

    expect(result).toBeDefined();
    expect(result.username).toEqual(mockUser.username);
    expect(result.firstName).toEqual(mockUser.firstName);
    expect(result.lastName).toEqual(mockUser.lastName);
  });

  it('create method should authenticate a user', async () => {
    const result = await store.authenticate(mockUser.username, mockPassword);

    expect(result).toBeDefined();
    expect(result!.username).toEqual(mockUser.username);
    expect(result!.firstName).toEqual(mockUser.firstName);
    expect(result!.lastName).toEqual(mockUser.lastName);
  });

  it('update method should update a user', async () => {
    const result = await store.update(String(user.id), {
      ...mockUser,
      firstName: mockUpdatedFirstName,
      password: mockPassword
    });

    expect(result).toBeDefined();
    expect(result.username).toEqual(mockUser.username);
    expect(result.firstName).toEqual(mockUpdatedFirstName);
    expect(result.lastName).toEqual(mockUser.lastName);
  });

  it('delete method should remove the user', async () => {
    const result = await store.delete(String(user.id));

    expect(result).toBeDefined();
    expect(result.id).toEqual(user.id);
  });
});
