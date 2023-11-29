const form = document.querySelector("#accountUpdateForm")
    form.addEventListener("change", function () {
      const updateBtn = document.querySelector("#submitButton")
      updateBtn.removeAttribute("disabled")
    })