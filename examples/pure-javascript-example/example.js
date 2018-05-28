document.onreadystatechange = () => {
  if (document.readyState === 'complete') {
    document.getElementById('model-input').addEventListener(
      'change',
      handleModelFile,
      false
    );
  }
}

function handleModelFile(inputEventParams) {
  if (inputEventParams.target.files.length !== 1) return;

  const file = inputEventParams.target.files[0];
  const fileReader = new FileReader();

  fileReader.onload = (fileLoadParams) => {
    const objBuffer = dotModel2Obj(fileLoadParams.target.result);
    console.log(file);
    
    const blob = new Blob([objBuffer], {type: "octet/stream"});
    const bufferUrl = URL.createObjectURL(blob);
    const downloadLink = document.getElementById('download-link')
    downloadLink.href = bufferUrl;

    const dotIndex = file.name.lastIndexOf('.');

    downloadLink.download =
      dotIndex === -1
        ? `${file.name}.obj`
        : `${file.name.substr(0, dotIndex)}.obj`;
  }

  fileReader.readAsArrayBuffer(file);
}
