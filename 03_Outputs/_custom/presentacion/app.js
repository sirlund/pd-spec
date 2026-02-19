document.addEventListener('DOMContentLoaded', () => {
    const slides = document.querySelectorAll('.slide');
    const nextBtn = document.getElementById('nextBtn');
    const prevBtn = document.getElementById('prevBtn');
    let currentSlide = 0;

    function showSlide(index) {
        slides.forEach(slide => slide.classList.remove('active'));
        slides[index].classList.add('active');
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }

    function prevSlide() {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(currentSlide);
    }

    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') nextSlide();
        if (e.key === 'ArrowLeft') prevSlide();
    });
});

// Theme toggle
(function () {
    var t = document.getElementById('theme-toggle'), i = t.querySelector('i'), s = localStorage.getItem('pd-theme');
    if (s === 'light') { document.documentElement.setAttribute('data-theme', 'light'); i.className = 'fa-solid fa-moon'; }
    t.addEventListener('click', function () {
        var c = document.documentElement.getAttribute('data-theme');
        if (c === 'light') { document.documentElement.removeAttribute('data-theme'); localStorage.setItem('pd-theme', 'dark'); i.className = 'fa-solid fa-sun'; }
        else { document.documentElement.setAttribute('data-theme', 'light'); localStorage.setItem('pd-theme', 'light'); i.className = 'fa-solid fa-moon'; }
    });
})();
