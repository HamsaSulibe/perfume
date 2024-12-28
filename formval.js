$(document).ready(function () {
  $("#formMessage").text("");

  $("#contactForm").on("submit", function (e) {
    e.preventDefault(); // Prevent actual form submission

    const email = $.trim($("#email").val());
    const phone = $.trim($("#phone").val());
    const name = $.trim($("#name").val());
    const message = $.trim($("#message").val());

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phonePattern = /^[0-9+\-\s()]+$/;

    if (!email) {
      $("#formMessage").css("color", "red").text("Please enter your email.");
      return;
    } else if (!emailPattern.test(email)) {
      $("#formMessage").css("color", "red").text("Please enter a valid email address.");
      return;
    }

    if (!phone) {
      $("#formMessage").css("color", "red").text("Please enter your phone number.");
      return;
    } else if (!phonePattern.test(phone)) {
      $("#formMessage").css("color", "red").text("Please enter a valid phone number.");
      return;
    }
    if (!name) {
      $("#formMessage").css("color", "red").text("Please enter your name.");
      return;
    } else if (name.length < 3) {
      $("#formMessage").css("color", "red").text("Name should be at least 3 characters long.");
      return;
    }

    if (!message) {
      $("#formMessage").css("color", "red").text("Please enter a message.");
      return;
    } else if (message.length < 5) {
      $("#formMessage").css("color", "red").text("Message should be at least 5 characters long.");
      return;
    }

    $("#formMessage").css("color", "green").text("Form submitted successfully!");


    $.post("path-to-your-server-api", {
      email: email,
      phone: phone,
      name: name,
      message: message
    }).done(function (response) {
    }).fail(function () {
    });

  });
});