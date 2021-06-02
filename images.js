const imageBtn = document.querySelector('#image_btn');
const editBtn = document.querySelector('#edit_image_btn');
const imageContainer = document.querySelector('#image_container');
const randomImage = document.querySelector('#random_img');
const grayScale = document.querySelector('#grayscale');
const blurLevel = document.querySelector('#blur');
const width = document.querySelector('#width');
const height = document.querySelector('#height');
const addImage = document.querySelector('#add_img_btn');
const showImages = document.querySelector('#show_imgs_btn');
const deleteImages = document.querySelector('#delete_imgs_btn');
const assignedImagesContainer = document.querySelector('#assigned_imgs_container');
let picId;

function generateUrl(id, width, height, grayscale, blurLevel, image) {
  let link = 'https://picsum.photos/'
  link += 'id/' + id + '/' + width + '/' + height;
        if (grayscale === 'true' || grayscale === true) {
          link += '?grayscale'
          if (blurLevel > 0) {
            link += '&blur=' + blurLevel;
          }
        } else if (blurLevel > 0) {
          link += '?blur=' + blurLevel;
        }
  image.setAttribute('src', link);
}

function getImage(url, callback) {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', url);
  xhr.onload = function() {
    if(xhr.status === 200) {
      picId = xhr.getResponseHeader('picsum-id');
    return callback(picId, width.value, height.value, grayScale.checked, blurLevel.value, randomImage);
    }
  };
  xhr.send();
}

function showAssignedImages() {
  const emailRegexp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (emailRegexp.test(email.value)) {
    let userImages = getCookie(email.value);
    if (userImages != "") {
      assignedImagesContainer.textContent = '';
      let imagesList = userImages.split(',');
      let totalImages = imagesList.length - 1;
      for (let i = 0; i < totalImages; i++) {
        let img = document.createElement('img');
        let attrs = imagesList[i].split('_');
        generateUrl(attrs[0], attrs[1], attrs[2], attrs[3], attrs[4], img);
        assignedImagesContainer.appendChild(img);
      }
    } else {
      assignedImagesContainer.textContent = 'No images assigned to this email address.';
    }
  } else {
    assignedImagesContainer.textContent = 'Invalid email address';
  }
}

function setCookie(cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
  var expires = "expires="+d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
  var name = cname + "=";
  var ca = document.cookie.split(';');
  for(var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

imageBtn.addEventListener('click', function() {
  getImage('https://picsum.photos/100', generateUrl);
})

editBtn.addEventListener('click', function() {
  generateUrl(picId, width.value, height.value, grayScale.checked, blurLevel.value, randomImage);
})

addImage.addEventListener('click', function() {
  const emailRegexp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (emailRegexp.test(email.value)) {
    let imageToAdd = getCookie(email.value) + picId + '_' + width.value + '_' + height.value + '_' + grayScale.checked + '_' + blurLevel.value + ',';
    setCookie(email.value, imageToAdd);
    getImage('https://picsum.photos/100', generateUrl);
  } else {
    assignedImagesContainer.textContent = 'Invalid email address';
  }
})

showImages.addEventListener('click', showAssignedImages);

deleteImages.addEventListener('click', function() {
  const emailRegexp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (emailRegexp.test(email.value)) {
    setCookie(email.value, "", -30);
    showAssignedImages();
  } else {
    assignedImagesContainer.textContent = 'Invalid email address';
  }
})

getImage('https://picsum.photos/100', generateUrl);