document.addEventListener('DOMContentLoaded', () => {
  const imageInput = document.getElementById('imageInput');
  const generateButton = document.getElementById('generateButton');

  // Event listener for the image input
  imageInput.addEventListener('change', () => {
    const selectedFiles = Array.from(imageInput.files);
    const fileCount = selectedFiles.length;
    const pluralSuffix = fileCount > 1 ? 's' : '';
    const labelText = `${fileCount} file${pluralSuffix} selected`;
  });

  // Event listener for the generate button
  generateButton.addEventListener('click', () => {
    const formData = new FormData();
    const selectedFiles = Array.from(imageInput.files);

    selectedFiles.forEach((file) => {
      formData.append('images', file);
    });

    fetch('/upload', {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        collageImage.src = data.path;
        collageImage.style.display = 'block';
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  });


});
