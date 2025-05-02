import animationCurves from "./animationCurves.js";

class carroussel {
    images = null; // Imagens do carrossel
    infosContainer = null; // Container das informações
    imagesContainer = null; // Container das imagens
    carousselContainer = null; // Container do carrossel

    lastTouchX = 0; // Última posição do toque
    aceleretion = 0; // Aceleração do movimento do dedo
    imagesCount = 0; // Número de imagens no carrossel
    touchStartX = 0; // Posição inicial do toque
    touchDiff = 0; // Diferença entre o toque inicial e o final
    currentImage = 0; // Imagem atual exibida no carrossel
    touchTimeStamp = 0; // Timestamp do toque inicial
    minAceleretion = 0.3; // Aceleração mínima para considerar um swipe

    constructor(carousselContainer, imagesContainer, infosContainer, dotsContainer) {
        this.carousselContainer = carousselContainer;
        this.imagesContainer = imagesContainer;
        this.infosContainer = infosContainer;
        this.navDotsContainer = dotsContainer;

        this.images = imagesContainer.querySelectorAll('.img');
        this.imagesCount = this.images.length;
        this.currentImage = 0;

        this.infosContainer.querySelector('.descricaoLocal').addEventListener('click', (event) => this.trocarTexto(event.target));
        
        this.imagesContainer.addEventListener('transitionend', () => {
            this.imagesContainer.classList.remove('transition'); // Remove a classe de transição após a animação
        })
        this.imagesContainer.addEventListener('transitioncancel', () => {
            this.imagesContainer.classList.remove('transition'); // Remove a classe de transição após a animação
        })

        this.carousselContainer.addEventListener('touchmove', (event) => this.touchControl(event));
        this.carousselContainer.addEventListener('touchend', (event) => this.touchEnd(event));

        this.createCarousselDots()
        this.updateDots()
    }

    createCarousselDots() {
        this.images.forEach((image, index) => {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            dot.setAttribute('data-index', index);
            dot.addEventListener('click', () => this.goToImage(index));
            this.navDotsContainer.appendChild(dot);
        });
    }

    touchControl(event) {
        if (event.type === 'touchmove') {

            if (this.touchStartX === 0) {
                this.touchStartX = event.touches[0].clientX; // Posição inicial do toque
            }

            const touchEndX = event.touches[0].clientX;
            const lastTouchDiff = this.lastTouchX - touchEndX;
            this.lastTouchX = touchEndX; // Atualiza o valor de lastTouchX para evitar problemas de múltiplos swipes

            this.aceleretion = lastTouchDiff / (event.timeStamp - this.touchTimeStamp); // Aceleração do movimento do dedo
            
            this.touchTimeStamp = event.timeStamp;

            this.touchDiff = touchEndX - this.touchStartX; // Diferença entre o toque inicial e o final

            this.imagesContainer.style.transform = `translateX(calc(-${this.currentImage * 100}% + ${this.touchDiff}px))`;

        }
    }

    touchEnd(event) {
        if (this.aceleretion > this.minAceleretion || this.touchDiff < -this.carousselContainer.offsetWidth * 0.7) {

            this.nextImage();
        } else if (this.aceleretion < -this.minAceleretion || this.touchDiff > this.carousselContainer.offsetWidth * 0.7) {

            this.previousImage();
        } else {

            this.updateImage(); // Atualiza a imagem para a imagem atual
        }

        this.touchDiff = 0; // Reseta a diferença de toque para evitar problemas de múltiplos swipes
        this.touchStartX = 0; // Reseta a posição inicial do toque para evitar problemas de múltiplos swipes
        this.aceleretion = 0; // Reseta a aceleração para evitar problemas de múltiplos swipes
    }

    trocarTexto(element) {
        element.classList.toggle('expanded');
        this.imagesContainer.classList.toggle('low-brightness')
    }

    nextImage() {
        if (this.currentImage < this.imagesCount - 1) {
            this.currentImage++;
        }
        this.updateImage()
        this.updateDots()
    }

    previousImage() {
        if (this.currentImage > 0) {
            this.currentImage--;
        }
        this.updateImage()
        this.updateDots()
    }

    updateImage(isGoToImage = false) {

        if (this.touchDiff !== 0 || !isGoToImage) {
            this.imagesContainer.classList.add('transition'); // Adiciona a classe de transição para suavizar a animação
        }

        this.imagesContainer.style.transform = `translateX(calc(-${this.currentImage * 100}% + 0px))`;
    }

    goToImage(index) {
        this.currentImage = index;
        this.updateImage(true);
        this.updateDots();
    }

    updateDots() {
        const dots = this.navDotsContainer.querySelectorAll('.dot');
        dots.forEach((dot, index) => {
            if (index === this.currentImage) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }
}

window.addEventListener('DOMContentLoaded', function () {
    const carousselContainer = document.querySelector('.caroussel-container');
    const imagesContainer = document.querySelector('.images-container');
    const infosContainer = document.querySelector('.infos-container');
    const dotsContainer = document.querySelector('.dots-container');

    const caroussel = new carroussel(carousselContainer, imagesContainer, infosContainer, dotsContainer);
})