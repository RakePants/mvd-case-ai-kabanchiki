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
  loadAnimation();
  const selectedFile = fileInput.files[0];
  if (selectedFile) {
    // Проверка, что выбран только один файл
    if (fileInput.files.length === 1) {
      const fileReader = new FileReader();
      fileReader.onload = function(event) {
        imageUploader.innerHTML = "";
        const newImage = document.createElement("img");
        newImage.src = event.target.result;
        imageUploader.appendChild(newImage);
        mainButton.style.display = 'flex';
        mainButton.classList.remove("animate__fadeOutDown");
        mainButton.classList.add("animate__fadeInUp");   
      };
      fileReader.readAsDataURL(selectedFile);
    } else {
      alert("Пожалуйста, выберите только один файл.");
      // Очистить input
      fileInput.value = "";
    }      
  }
});

function sendImageToBackend() {
  imageFile = fileInput.files[0];
  fileInput.value = '';
  console.log(fileInput.files.length); 
  
  const formData = new FormData();
  formData.append("image", imageFile);
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
        counter++;
        file.async('blob').then(blobData => {
          const imageUrl = URL.createObjectURL(blobData);
          updateInfo(imageUrl);
        })
      });
      
    })
    .catch(error => {
      console.error("Произошла ошибка при выполнении fetch запроса:", error);
    });
    var counterText = document.getElementById("counter-strings").querySelector("span");
    counterText.innerHTML = "Обнаруженных лиц с оружием: " +  2;
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

}

function updateInfo(imageUrl){
  let newCol = document.createElement("div");
  let newPerson = document.createElement("div");
  let newFace = document.createElement("div");
  let newPercent = document.createElement("div");
  let newImg = document.createElement("img");

  newPerson.appendChild(newFace);
  newPerson.appendChild(newPercent);
  newFace.appendChild(newImg);
  newCol.appendChild(newPerson);
  newDesc.appendChild(newCol);
  newImg.src = imageUrl;

  newCol.classList.add("col-md-4");
  newPerson.classList.add("output__person", "wow", "animate__animated", "animate__fadeInUp");
  newFace.classList.add("face");
  newPercent.classList.add("percent");


  newPercent.innerHTML = "Вероятность 30%"; 
}

function loadAnimation(){
  worm.style.transition = "2s all";
  worm.style.animation = "toLoad 1s";
  setTimeout(()=> worm.style.animation = "load 1.2s infinite", 1000);
  
}