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

let typed = new Typed('#typed', {
  stringsElement: '#typed-strings',
  typeSpeed: 20, // Скорость печати
  startDelay: 500, // Задержка перед стартом анимации // Скорость удаления
  fadeOut: false,
  showCursor: false,
  loop: false
});

let flag = true;
imageUploader.addEventListener("click", function() {
  if(fileInput.files.length === 0){
    flag = false;
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
  imageUploader.querySelector("img").src = "";
  imageUploader.innerHTML = "<div><span>+</span><br>Загрузить изображение</div>";
  info.innerHTML = 'Нейросеть определяет наличие огнестрельного оружия у людей на фото';
  type.innerHTML = '';
  typed = new Typed('#typed', {
    stringsElement: '#typed-strings',
    typeSpeed: 60, // Скорость печати
    startDelay: 0, // Задержка перед стартом анимации // Скорость удаления
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
          // sendImageToBackend(selectedFile);
          
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
  updateInfo();
  fetch("/photo", {
    method: "POST",
    body: formData,
  })
    .then(response => {
      if (response.ok) {
        console.log("Изображение успешно отправлено на бекенд.");
      } else {
        console.error("Ошибка при отправке изображения на бекенд.");
      }
    })
    .catch(error => {
      console.error("Произошла ошибка при выполнении fetch запроса:", error);
    });
}

function updateInfo(){
  let weaponNum = 7; //Количество оружия
  for(let i = 0; i < weaponNum; i++){
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
    
    newCol.classList.add("col-md-4");
    newPerson.classList.add("output__person", "wow", "animate__animated", "animate__fadeInUp");
    newFace.classList.add("face");
    newPercent.classList.add("percent");


    newPercent.innerHTML = "Вероятность 30%";
  }
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
 
}

function loadAnimation(){
  worm.style.transition = "2s all";
  worm.style.width = "300px";
  setTimeout(()=> worm.style.animation = "load 1.2s infinite", 1000);
  
}