(function() {
    emailjs.init({
        publicKey: "L2TpAWii3f2NfAU9d",
    });
})();

document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contact-form');

    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault();

            const btn = this.querySelector('.btn-submit');
            const originalText = btn.innerHTML;
            btn.innerHTML = '<span>Sending...</span>';

            emailjs.sendForm('service_nkfp5ew', 'template_5satk2f', this)
                .then(() => {
                    console.log('SUCCESS!');
                    // alert("Thank you! Your message has been sent successfully.");
                    this.reset();
                    btn.innerHTML = originalText;
                }, (error) => {
                    console.log('FAILED...', error);
                    // alert("Oops! Something went wrong. Please try again later.");
                    btn.innerHTML = originalText;
                });
        });
    }
});