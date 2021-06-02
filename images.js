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

function generateUrl(id, width, height, grayscale, blurLevel) {
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
  return link;
}

function getImage() {
  console.log('clicked');
  axios.get('https://picsum.photos/600/400')
      .then(function(response) {
        //console.log(response.headers["picsum-id"])
        picId = response.headers["picsum-id"]

        let link = generateUrl(picId, width.value, height.value, grayScale.checked, blurLevel.value);
        randomImage.setAttribute('src', link);
});
}

function showAssignedImages() {
  const emailRegexp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (emailRegexp.test(email.value)) {
    console.log('validemail');
    console.log(document.cookie);
    let userImages = getCookie(email.value);
    if (userImages != "") {
      assignedImagesContainer.textContent = '';
      console.log(userImages)
      let imagesList = userImages.split(',');
      console.log(imagesList);
      let totalImages = imagesList.length - 1;
      for (let i = 0; i < totalImages; i++) {
        let img = document.createElement('img');
        let attrs = imagesList[i].split('_');
        console.log(attrs[3]);
        let link = generateUrl(attrs[0], attrs[1], attrs[2], attrs[3], attrs[4]);
        img.setAttribute('src', link);
        assignedImagesContainer.appendChild(img);
      }

    } else {
      assignedImagesContainer.textContent = 'No images assigned to this email address.';
    }
     

  } else {
    document.write('Invalid email address');
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

/*function checkCookie() {
  const acceptCookies = getCookie("acceptCookies");
  if (acceptCookies != 'true') {
    document.querySelector('body').style.overflow = 'hidden';
    document.querySelector('.cookie_consent').style.display = 'flex';
    document.querySelector('.cookie_consent a').onclick = function() {
      setCookie('acceptCookies', true, 30)
      document.querySelector('.cookie_consent').style.display = 'none';
      document.querySelector('body').style.overflow = 'auto';
  };
  }
}*/

imageBtn.addEventListener('click', function() {
  getImage();
})

editBtn.addEventListener('click', function() {
  let link = generateUrl(picId, width.value, height.value, grayScale.checked, blurLevel.value);
  randomImage.setAttribute('src', link);
})

addImage.addEventListener('click', function() {
  const emailRegexp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (emailRegexp.test(email.value)) {
    console.log('validemail');
    console.log(document.cookie);
    let imageToAdd = getCookie(email.value) + picId + '_' + width.value + '_' + height.value + '_' + grayScale.checked + '_' + blurLevel.value + ',';
    setCookie(email.value, imageToAdd);
    //if (getCookie(email.value) 
    console.log(document.cookie)
    getImage();
  } else {
    document.write('Invalid email address');
  }
})

showImages.addEventListener('click', showAssignedImages);

deleteImages.addEventListener('click', function() {
  const emailRegexp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (emailRegexp.test(email.value)) {
    console.log('validemail');
    console.log(document.cookie);
    setCookie(email.value, "", -30);
    console.log(document.cookie);
    showAssignedImages();
  } else {
    document.write('Invalid email address');
  }
})

getImage();