document.addEventListener('DOMContentLoaded', function() {
  const uploadButton = document.getElementById('upload-button');
  const clearButton = document.getElementById('clear-button');
  const dropArea = document.getElementById('drop-area');
  const compressButton = document.getElementById('compress-button');
  const progressBar = document.getElementById('progress-bar');
  const progressBarInner = document.getElementById('progress-bar-inner');
  const afterCompression = document.getElementById('after-compression');
  const downloadButton = document.getElementById('download-button');
  let originalFile = null;

  // Upload button click event
  uploadButton.addEventListener('click', function() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.addEventListener('change', handleFiles);
    input.click();
  });

  // Clear button click event
  clearButton.addEventListener('click', function() {
    dropArea.innerHTML = '<p>Drop Your Files Here</p>';
    compressButton.style.display = 'none';
    afterCompression.style.display = 'none';
    downloadButton.style.display = 'none';
    progressBar.style.display = 'none';
    progressBarInner.style.width = '0';
    originalFile = null;
  });

  // Handle files
    function handleFiles(event) {
  const files = event.target.files;
  if (files.length > 0) {
    originalFile = files[0];
    displayFiles(files);

    // Display the uploaded image
    const reader = new FileReader();
    reader.onload = (e) => {
      const uploadedImgElement = document.createElement('img');
      uploadedImgElement.id = 'uploaded-image';
      uploadedImgElement.src = e.target.result;
      dropArea.appendChild(uploadedImgElement);
    };
    reader.readAsDataURL(originalFile);
  }
}
    
    
    
    
    
    

  // Display files in drop area
  function displayFiles(files) {
    dropArea.innerHTML = '';
    Array.from(files).forEach(file => {
      const fileElement = document.createElement('p');
      fileElement.textContent = `${file.name} (${(file.size / 1024).toFixed(2)} KB)`;
      fileElement.className = 'file-info';
      dropArea.appendChild(fileElement);
    });
    compressButton.style.display = 'inline-block';
  }

  // Drop area drag and drop events
  dropArea.addEventListener('dragover', function(event) {
    event.preventDefault();
    dropArea.style.borderColor = '#000';
  });

  dropArea.addEventListener('dragleave', function(event) {
    dropArea.style.borderColor = '#ccc';
  });

  dropArea.addEventListener('drop', function(event) {
    event.preventDefault();
    const files = event.dataTransfer.files;
    if (files.length > 0) {
      originalFile = files[0];
      handleFiles({ target: { files } });
    }
    dropArea.style.borderColor = '#ccc';
  });

  // Compress button click event
  compressButton.addEventListener('click', function() {
    if (originalFile) {
      compressImage(originalFile);
    }
  });

  // Compress image
    
    
    
  function compressImage(file) {
  const reader = new FileReader();
  reader.onload = (e) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      // Show progress bar
      progressBar.style.display = 'block';
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        progressBarInner.style.width = `${progress}%`;
        if (progress >= 100) {
          clearInterval(interval);
        }
      }, 100);

      // Compress the image
      setTimeout(() => {
        canvas.toBlob(
          (blob) => {
            // Display compressed image
            const compressedImgElement = document.getElementById('compressed-image');
            compressedImgElement.src = URL.createObjectURL(blob);
            compressedImgElement.style.maxWidth = '100%';
            compressedImgElement.style.height = 'auto';
            afterCompression.style.display = 'block';

            // Set compressed file info
            const compressedFilename = document.getElementById('compressed-filename');
            const compressedFilesize = document.getElementById('compressed-filesize');
            compressedFilename.textContent = originalFile.name;
            compressedFilesize.textContent = `${(blob.size / 1024).toFixed(2)} KB`;

            // Create download link
            downloadButton.style.display = 'inline-block';
            downloadButton.onclick = () => {
              const link = document.createElement('a');
              link.href = URL.createObjectURL(blob);
              link.download = 'compressed-' + originalFile.name;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            };
          },
          'image/jpeg',
          0.7 // Change quality here (0 to 1)
        );
      }, 1000); // Simulate compression time
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

  // FAQ toggle functionality
  document.querySelectorAll('.faq-item h3').forEach(item => {
    item.addEventListener('click', () => {
      const answer = item.nextElementSibling;
      if (answer.style.display === 'block') {
        answer.style.display = 'none';
      } else {
        answer.style.display = 'block';
      }
    });
  });
});