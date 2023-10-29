
const imageUploader = document.getElementById("imageUploader");
const fileInput = document.getElementById("fileInput");
const oldDesc = document.querySelector('.main__description');
const newDesc = document.querySelector('.output');
const worm = document.querySelector('.header__download');
const startPage = document.querySelector('.startPage');
const backBtn = document.getElementById('backBtn');
const type = document.getElementById("typed");
const info = document.getElementById("typed-strings").querySelector('span');
const mainButton = document.querySelector(".main__buttons");
const newImgButton = document.getElementById("newImg_button");
let imageToBack;

let typed = new Typed('#typed', {
  stringsElement: '#typed-strings',
  typeSpeed: 20, // Скорость печати
  startDelay: 500, // Задержка перед стартом анимации // 
  fadeOut: false,
  showCursor: false,
  loop: false
});
fileInput.value = '';

newImgButton.addEventListener("click", function() {
  fileInput.value = '';
  fileInput.click();
});

imageUploader.addEventListener("click", function() {
  if(fileInput.files.length === 0){
    fileInput.click();
  }
});

backBtn.addEventListener("click", function(){
  const detectedImg = document.querySelector('.img_400x200');
  detectedImg.firstChild.remove();
  newDesc.classList.remove("animate__fadeInRight");
  newDesc.classList.add("animate__fadeOutRight");
  setTimeout(function(){
    newDesc.style.display = "none";
    startPage.classList.remove("animate__fadeOutLeft");
    startPage.classList.add("animate__fadeInLeft");
  }, 500);
  for(let i = newDesc.children.length - 1; i > 0; i--){
    newDesc.removeChild(newDesc.children[i]);
  }
  imageUploader.querySelector("img").src = "";
  imageUploader.innerHTML = "<div><span>+</span><br>Загрузить изображение</div>";
  info.innerHTML = 'Нейросеть определяет наличие огнестрельного оружия у людей на фото';
  type.innerHTML = '';
  typed = new Typed('#typed', {
    stringsElement: '#typed-strings',
    typeSpeed: 20, // Скорость печати
    startDelay: 10, // Задержка перед стартом анимации // Скорость удаления
    fadeOut: false,
    showCursor: false,
    loop: false
  });
});


fileInput.addEventListener("change", function() {
  
  const selectedFile = fileInput.files[0];
  if (selectedFile) {
    // Проверка, что выбран только один файл
    if (fileInput.files.length === 1) {
      const fileReader = new FileReader();
      fileReader.onload = function(event) {
        imageUploader.innerHTML = "";
        const newImage = document.createElement("img");
        newImage.src = event.target.result;
        imageToBack = event.target.result;
        imageUploader.appendChild(newImage);
        mainButton.style.display = 'flex';
        mainButton.classList.remove("animate__fadeOutDown");
        mainButton.classList.add("animate__fadeInUp");   
      };
      fileReader.readAsDataURL(selectedFile);
    } else {
      alert("Пожалуйста, выберите только один файл.");
    }      
  }
});

function sendImageToBackend() {
  loadAnimation();
  imageFile = imageToBack;
  console.log(imageToBack);
  fileInput.value = '';
  // Получаем элемент изображения по его id или другому селектору
  const imageElement = document.getElementById('imageUploader').querySelector("img"); // Замените 'yourImageId' на актуальный идентификатор элемента изображения

  // Создаем холст (canvas) для рисования
  const canvas = document.createElement('canvas');
  canvas.width = imageElement.width; // Устанавливаем ширину холста равной ширине изображения
  canvas.height = imageElement.height; // Устанавливаем высоту холста равной высоте изображения

  // Получаем контекст холста для рисования
  const context = canvas.getContext('2d');

  // Рисуем изображение на холсте
  context.drawImage(imageElement, 0, 0, imageElement.width, imageElement.height);

  // Получаем данные изображения в формате Base64 (imageData)
  const imageData = canvas.toDataURL('image/jpeg'); // Здесь 'image/jpeg' можно заменить на желаемый MIME-тип изображения


  const base64Data = imageData.replace(/^data:image\/jpeg;base64,/, '');
  const blob = base64ToBlob(base64Data, 'image/jpeg');

  const formData = new FormData();
  formData.append('file', blob, imageToBack);

  function base64ToBlob(base64Data, contentType) {
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: contentType });
  }

  
  
  fetch("http://localhost:1001/photo", {
    method: "POST",
    body: formData,
  })
    .then(response => {
      if (response.status === 204) {
        info.innerHTML = 'Оружие на фото не найдено';
        type.innerHTML = '';
        typed = new Typed('#typed', {
          stringsElement: '#typed-strings',
          typeSpeed: 60, // Скорость печати
          startDelay: 0, // Задержка перед стартом анимации // Скорость удаления
          fadeOut: false,
          showCursor: false,
          loop: false
        });
      } else if(!response.ok){
        // throw new Error('Ошибка при загрузке архива');
      }else if(response.ok){
        return response.arrayBuffer();
      }
    })
    .then(zipData => {
      return JSZip.loadAsync(zipData);
    })
    .then(zip => {
      let counter = 0;
      zip.forEach((relativePath, file) => {
        
        
        file.async('blob').then(blobData => {
          const imageUrl = URL.createObjectURL(blobData);
          console.log(relativePath);
          if(relativePath == 'result.jpg'){
            const detectedImg = document.querySelector('.img_400x200');
            const newImg = document.createElement("img");
            newImg.src = imageUrl;
            detectedImg.appendChild(newImg);
          } else {
            updateInfo(imageUrl);
          }

        })
        counter++;
      });
      var counterText = document.getElementById("counter-strings").querySelector("span");
      counterText.innerHTML = "Обнаруженных лиц с оружием: " +  (counter-1);
      document.getElementById("count").innerHTML = '';
      typed = new Typed('#count', {
          stringsElement: '#counter-strings',
          typeSpeed: 30, // Скорость печати
          startDelay: 1000, // Задержка перед стартом анимации // Скорость удаления
          fadeOut: false,
          showCursor: false,
          loop: false
      });

      startPage.classList.remove("animate__fadeInLeft");
      startPage.classList.add("animate__fadeOutLeft");
      setTimeout(function(){
          newDesc.classList.remove("animate__fadeOutRight");
          newDesc.classList.add("animate__fadeInRight");
          newDesc.style.display = 'flex';
          mainButton.classList.remove("animate__fadeInUp");
          mainButton.classList.add("animate__fadeInOut"); 
          mainButton.style.display = "none";
      }, 500);
      worm.style.animation = 'start 2s';
      worm.style.width = '100%';
      
    })
    .catch(error => {
      console.error("Произошла ошибка при выполнении fetch запроса:", error);
    });
    
    
   

}

function updateInfo(imageUrl){
  let newCol = document.createElement("div");
  let newPerson = document.createElement("div");
  let newFace = document.createElement("div");
  let newImg = document.createElement("img");

  newPerson.appendChild(newFace);
  newFace.appendChild(newImg);
  newCol.appendChild(newPerson);
  newDesc.appendChild(newCol);
  newImg.src = imageUrl;

  newCol.classList.add("col-md-4");
  newPerson.classList.add("output__person", "wow", "animate__animated", "animate__fadeInUp");
  newFace.classList.add("face");
}

function loadAnimation(){
  worm.style.transition = "2s all";
  worm.style.animation = "toLoad 1s";
  setTimeout(()=> worm.style.animation = "load 1.2s infinite", 1000);
  
}