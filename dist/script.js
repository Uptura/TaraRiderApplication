$(document).ready(function () {
  $("#form2").on("submit", function (e) {
    e.preventDefault();

    let formData = {
      LegalName: $("#legal_name").val(),
      dl_id: $("#dl_id").val(),
      dl_expiration: $("#dl_expiration").val(),
      address: $("#address").val(),
      phone_number: $("#phone_number").val(),
      email: $("#email").val(),
      vehicle_type: $("#vehicle_type").val(),
      color: $("#color").val(),
      plate: $("#plate").val(),
      tgid: $("#tgid").val(),
    };

    const idImageFile = $("#selfie_file")[0]?.files[0]; 
    const orcrFile = $("#id_photo_file")[0]?.files[0]; 

    function uploadFile(file, apiUrl, callback) {
      let fileUploadFormData = new FormData();
      fileUploadFormData.append("image", file);

      $.ajax({
        url: apiUrl,
        type: "POST",
        processData: false,
        contentType: false,
        data: fileUploadFormData,
        success: function (fileResponse) {
          console.log(`File Upload to ${apiUrl} Response:`, fileResponse);
          if (fileResponse.status === "success" && fileResponse.file_url) {
            let uploadedUrl = fileResponse.file_url;


            if (!uploadedUrl.startsWith("https://dwayon.tech/api/Storage/")) {
              console.error("Invalid file URL received:", uploadedUrl);
              callback("Invalid file URL", null);
              return;
            }

            callback(null, uploadedUrl);
          } else {
            callback(fileResponse.message || "Unknown error", null);
          }
        },
        error: function (xhr, status, error) {
          console.error(`File Upload to ${apiUrl} Error Details:`, {
            status: status,
            error: error,
            responseText: xhr.responseText,
          });
          callback(xhr.responseText, null);
        },
      });
    }

    function handleUploads() {
      if (idImageFile) {
        uploadFile(idImageFile, "https://dwayon.tech/api/Storage/create/ID.php", function (err, url) {
          if (err) {
            alert("ID Image upload failed: " + err);
            return;
          }
          formData.id_image = url; 

          if (orcrFile) {
            uploadFile(orcrFile, "https://dwayon.tech/api/Storage/create/ORCR.php", function (err, url) {
              if (err) {
                alert("ORCR Image upload failed: " + err);
                return;
              }
              formData.orcr_image = url; 
              console.log("Final Form Data Before Submission:", formData);
              sendFormData(formData); 
            });
          } else {
            console.log("Final Form Data Before Submission:", formData);
            sendFormData(formData); 
          }
        });
      } else {
        console.log("Final Form Data Before Submission:", formData);
        sendFormData(formData); 
      }
    }

    handleUploads();
  });

  function sendFormData(data) {
    console.log("Sending Form Data to API:", data);

    $.ajax({
      url: "https://dwayon.tech/api/RiderApplication/create/api.php",
      type: "POST",
      contentType: "application/json",
      data: JSON.stringify(data),
      success: function (response) {
        console.log("API Response:", response);
        if (response.status === "success") {
          alert(response.message);
          $("#form2")[0].reset();
        } else {
          console.error("Form Submission Failed:", response);
          alert("Error: " + response.message);
        }
      },
      error: function (xhr, status, error) {
        console.error("Form Submission Error Details:", {
          status: status,
          error: error,
          responseText: xhr.responseText,
        });
        alert("An error occurred: " + xhr.responseText);
      },
    });
    
  }
});
