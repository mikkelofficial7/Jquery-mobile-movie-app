const maxSizeInBytes = 2 * 1024 * 1024; // 2 MB
let fileUploadedExt;

$(document).ready(function() {	
    fileUploadedExt = "";
    const dropzone = document.getElementById('upload-dropzone');
    const fileInput = document.getElementById('upload-file-input');

    // Click to upload
    dropzone.addEventListener('click', () => fileInput.click());

    // Drag-over effect
    dropzone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropzone.classList.add('border-[#6facd5]', 'border-[#6facd5]');
    });

    dropzone.addEventListener('dragleave', () => {
        dropzone.classList.remove('border-[#6facd5]', 'border-[#6facd5]');
    });

    // Drop file
    dropzone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropzone.classList.remove('border-[#6facd5]', 'border-[#6facd5]');
        const file = e.dataTransfer.files[0];
        handleFile(file);
    });

    // File input
    fileInput.addEventListener('change', () => {
        const file = fileInput.files[0];
        handleFile(file);
    });

    $(document).on("click", ".btn-search-image", function () {
        $("#movieListSearch").removeClass("grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-2");
		createElementDataLoading("#movieListSearch")

        const base64Data = $("#upload-preview").attr("src").split(',')[1];
        
        const requestBody = {
            contents: [{
                parts: [
                    { text: templateGeminiSearchImage },
                    { 
                        inlineData: { 
                            mimeType: "image/"+fileUploadedExt,
                            data: base64Data
                        } 
                    }
                ]
            }],
            generationConfig: {
                maxOutputTokens: maxGeminiOutputToken
            }
        };

        runGeminiSearch(requestBody, "image")
    });
});

function handleFile(file) {
    const preview = document.getElementById('upload-preview');
    const submitButton = document.querySelector('.btn-search-image');

    if (file && (file.type == 'image/png' || file.type == 'image/jpg' || file.type == 'image/jpeg')) {
        if (file.size <= maxSizeInBytes) {
            const fileName = file.name;
            fileUploadedExt = fileName.split('.').pop().toLowerCase();

            const reader = new FileReader();
            reader.onload = () => {
                preview.src = reader.result;
                preview.classList.remove('hidden');
                submitButton.classList.remove('hidden');
            };
            reader.readAsDataURL(file);
        } else {
            showSnackBar(3000, "Size cannot more than 2 MB!", "#fc0404")
        }
    } else {
        showSnackBar(3000, "Only .png/.jpg/.jpeg files are allowed!", "#fc0404")
    }
}