const imageUploader = document.getElementById("imageUploader");
const fileInput = document.getElementById("fileInput");

imageUploader.addEventListener("click", function() {
  if(fileInput.files.length == 0){
    fileInput.click();
  }
});

fileInput.addEventListener("change", function() {
    const selectedFile = fileInput.files[0];
    if (selectedFile) {
      // Проверка, что выбран только один файл
      if (fileInput.files.length === 1) {
        const fileReader = new FileReader();
        fileReader.onload = function(event) {
          // Очистить содержимое блока imageUploader
          imageUploader.innerHTML = "";
          
          // Создать элемент изображения и установить его как потомка блока
          const newImage = document.createElement("img");
          newImage.src = event.target.result;
          imageUploader.appendChild(newImage);
          sendImageToBackend(selectedFile);
        };
        fileReader.readAsDataURL(selectedFile);
      } else {
        alert("Пожалуйста, выберите только один файл.");
        // Очистить input
        fileInput.value = "";
      }
    }
  });

  function sendImageToBackend(imageFile) {
    const formData = new FormData();
    formData.append("image", imageFile);
  
    fetch("/neuro", {
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

  