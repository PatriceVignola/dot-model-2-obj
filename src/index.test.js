import fs from 'fs';
import path from 'path';
import {TextDecoder} from 'text-encoding';
import dotModel2Obj from './index';

describe('dotModel2Obj', () => {
  const dotModelPath = path.resolve(__dirname, '../models', 'demon.model');
  const {buffer} = fs.readFileSync(dotModelPath);

  it('generates a valid .obj buffer', () => {
    const objBuffer = dotModel2Obj(buffer);
    const decoder = new TextDecoder();
    expect(decoder.decode(objBuffer)).toMatchSnapshot();
  });
});
