$(document).ready(function () {
    $("#login-form").on("submit", function (e) {
        e.preventDefault();

        const email = $("#email").val();
        const tgid = $("#tgid").val();

        // Validate TGID and Email using the provided API
        $.ajax({
            url: `https://dwayon.tech/api/RiderApplication/get/?Email=${encodeURIComponent(email)}&TGID=${encodeURIComponent(tgid)}`, // API endpoint with Email and TGID
            type: "GET",
            success: function (response) {
                console.log("API Response:", response);

                // Check if the API returned a success status and valid data
                if (response.status === 1 && response.data) {
                    const userEmail = response.data.Email;
                    const userTGID = response.data.TGID;

                    // Validate the email and TGID from the API response
                    if (userEmail === email && userTGID === tgid) {
                        alert("Login successful!");
                        window.location.href = "https://taranapo.com/"; // Redirect to dashboard or homepage
                    } else {
                        alert("Login failed: Incorrect Email or TGID.");
                    }
                } else {
                    alert("Login failed: Invalid Email or TGID.");
                }
            },
            error: function (xhr, status, error) {
                console.error("Login Error:", xhr.responseText);
                alert("An error occurred while validating your credentials. Please try again.");
            },
        });
    });
});