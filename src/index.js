/**
 * @format
 * @flow
 */

import loadDotModel from 'load-dot-model';
import {TextEncoder} from 'text-encoding';
import type {DotModel} from 'load-dot-model';

function writeCoordinatesBlock(
  coordinates: number[],
  prefix: string,
  stride: number,
): string {
  let coordinatesBlock = '';
  let currentLine = prefix;

  coordinates.forEach((coordinate, i) => {
    currentLine += ` ${coordinate}`;

    // This is the last coordinate of the element
    if ((i + 1) % stride === 0) {
      coordinatesBlock += `\n ${currentLine}`;
      currentLine = prefix;
    }
  });

  return coordinatesBlock;
}

function writeFacesBlock(model: DotModel): string {
  let facesBlock = '';
  let currentLine = 'f';

  const {vertexCoordinates, uvCoordinates, normalCoordinates, indices} = model;

  indices.forEach((index, i) => {
    // TODO: Absolutize or relativize indices depending on a parameter
    // TODO: Don't write any slashes if UVs and normals are missing
    // TODO: Write nothing between the middle slashes if there are no UVs
    // TODO: Don't write the last slash if there are no normals
    currentLine += ` ${vertexCoordinates[index]}/${uvCoordinates[index]}/${
      normalCoordinates[index]
    }`;

    // This is the last vertex of the face
    if ((i + 1) % model.numVerticesPerFace === 0) {
      facesBlock += `\n ${currentLine}`;
      currentLine = 'f';
    }
  });

  return facesBlock;
}

function dotModel2Obj(buffer: ArrayBuffer): ArrayBuffer {
  // TODO: Add a parameter to use 'absolutize-obj' or 'relativize-obj'
  const model = loadDotModel(buffer);

  const vertexCoordinatesBlock = writeCoordinatesBlock(
    model.vertexCoordinates,
    'v',
    model.numVerticesPerFace,
  );

  const uvCoordinatesBlock = writeCoordinatesBlock(
    model.uvCoordinates,
    'vt',
    model.numVerticesPerFace,
  );

  const normalsBlock = writeCoordinatesBlock(
    model.normalCoordinates,
    'vn',
    model.numVerticesPerFace,
  );

  const facesBlock = writeFacesBlock(model);

  // TODO: Add support for space vertices ('vp' prefix)
  // TODO: Add support for line elements ('l' prefix)
  // TODO: Add support for interpolations (Taylor, B-splines, etc.)
  // TODO: Add support for mtllib

  const objData = `${vertexCoordinatesBlock}${uvCoordinatesBlock}${normalsBlock}${facesBlock}`;

  return new TextEncoder().encode(objData).buffer;
}

export default dotModel2Obj;
