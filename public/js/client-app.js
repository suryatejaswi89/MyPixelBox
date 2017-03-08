function uploadFile(file, signedRequest, url){
  const xhr = new XMLHttpRequest();
  xhr.open('PUT',signedRequest);
  xhr.onreadystatechange = ()=>{
    if(xhr.readystate === 4){
      if(xhr.status === 200){
        document.getElementById('preview').src = url;
        document.getElementById('avatar-url').value = url;

      }
      else{
        alert('couldnot upload the file');
      }
    }
  };
  xhr.send(file);
}

function getSignedRequest(file){
  const xhr = new XMLHttpRequest();
  xhr.open('GET', 'sign-s3?file-name='+file.name+'&file-type='+file.type);
  xhr.onreadystatechange = () =>
  {
    if(xhr.readyState === 4){
      if(xhr.status === 200){
        const response = JSON.parse(xhr.responseText);
        uploadFile(file, response.signedRequest, response.url)
      }
      else{
        alert('could not get signed url');
      }
    }
  };
  xhr.send();
}

document.getElementById('file-input').onchange = function(){
  const files =   document.getElementById('file-input').files;
  const file = files[0];
  if(file == null){
    return alert('No file selected');

  }
  getSignedRequest(file);
}

createBucket(username){
  const xhr = new XMLHttpRequest();
  xhr.open('POST', 'create-bucket?username='+username);
  xhr.onreadystatechange = () =>{
  if(xhr.readystate === 4){
    if(xhr.status === 200){
        const response = JSON.parse(xhr.responseText);
    }
    else{
      alert('could not create a bucket');
    }
  }
};
xhr.send();
}


document.getElementByID('Register-user-button').onchange = function(){
  cons username = document.getElementByID('username');
createBucket(username);
}
