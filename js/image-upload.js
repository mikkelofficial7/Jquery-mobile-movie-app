const maxSizeInBytes = 2 * 1024 * 1024; // 2 MB
let fileUploadedExt;

$(document).ready(function() {	
    fileUploadedExt = "";
    const dropzone = document.getElementById('upload-dropzone');
    const fileInput = document.getElementById('upload-file-input');
    const dropdownModel = document.getElementById("dropdown-model");

    var selectModelValue = "";
    var selectedModelText = "";

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

    // Dropdown select model
    dropdownModel.addEventListener("change", function () {
        const selectedValue = this.value;
        const selectedText = this.options[this.selectedIndex].text;

        selectModelValue = selectedValue;
        selectedModelText = selectedText;

        if (selectedValue != "") {
            const submitButton = document.querySelector('.btn-search-image');
            submitButton.classList.remove('hidden');
            submitButton.textContent = `Ask ${selectedModelText}`;
        }
    });

    $(document).on("click", ".btn-search-image", function () {
        $("#movieListSearch").removeClass("grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-2");
		createElementDataLoading("#movieListSearch")

        const modelName = selectModelValue;
        const src = $("#upload-preview").attr("src");

        const base64Data = src && src.includes(",") ? src.split(",")[1] : null;        
            if (base64Data != null && modelName != "") {
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

            runGeminiSearch(requestBody, "image", modelName)
        } else {
            
        }
    });
});

function handleFile(file) {
    const preview = document.getElementById('upload-preview');
    const dropdownModel = document.getElementById('dropdown-parent-model');

    if (file && (file.type == 'image/png' || file.type == 'image/jpg' || file.type == 'image/jpeg')) {
        if (file.size <= maxSizeInBytes) {
            const fileName = file.name;
            fileUploadedExt = fileName.split('.').pop().toLowerCase();

            const reader = new FileReader();
            reader.onload = () => {
                preview.src = reader.result;
                preview.classList.remove('hidden');
                dropdownModel.classList.remove('hidden');
            };
            reader.readAsDataURL(file);
        } else {
            showSnackBar(3000, "Size cannot more than 2 MB!", "#fc0404")
        }
    } else {
        showSnackBar(3000, "Only .png/.jpg/.jpeg files are allowed!", "#fc0404")
    }
}