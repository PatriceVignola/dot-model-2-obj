import dotModel2Obj from './index';

describe('dotModel2Obj', () => {
  test('is ready to be tested', () => {
    expect(dotModel2Obj()).toEqual({
      test: 'test',
    });
  });
});
