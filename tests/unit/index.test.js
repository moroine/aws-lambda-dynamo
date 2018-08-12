import listResource from '../../src/api/resources/list';
import postResource from '../../src/api/resources/post';
import deleteResource from '../../src/api/resources/delete';
import getUser from '../../src/api/users/get';
import listUser from '../../src/api/users/list';
import postUser from '../../src/api/users/post';
import patchUser from '../../src/api/users/patch';
import deleteUser from '../../src/api/users/delete';
import * as index from '../../src/index';

test('Should exports "listResource"', () => {
  expect(index.listResource).toBe(listResource);
});

test('Should exports "postResource"', () => {
  expect(index.postResource).toBe(postResource);
});

test('Should exports "deleteResource"', () => {
  expect(index.deleteResource).toBe(deleteResource);
});

test('Should exports "getUser"', () => {
  expect(index.getUser).toBe(getUser);
});

test('Should exports "listUser"', () => {
  expect(index.listUser).toBe(listUser);
});

test('Should exports "postUser"', () => {
  expect(index.postUser).toBe(postUser);
});

test('Should exports "patchUser"', () => {
  expect(index.patchUser).toBe(patchUser);
});

test('Should exports "deleteUser"', () => {
  expect(index.deleteUser).toBe(deleteUser);
});
