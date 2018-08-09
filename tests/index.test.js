import getResource from '../src/resources/get';
import listResource from '../src/resources/list';
import postResource from '../src/resources/post';
import deleteResource from '../src/resources/delete';
import * as index from '../src/index';

test('Should exports "getResource"', () => {
  expect(index.getResource).toBe(getResource);
});

test('Should exports "listResource"', () => {
  expect(index.listResource).toBe(listResource);
});

test('Should exports "postResource"', () => {
  expect(index.postResource).toBe(postResource);
});

test('Should exports "deleteResource"', () => {
  expect(index.deleteResource).toBe(deleteResource);
});
