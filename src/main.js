import { ApiService } from "./apiService.js";
import { Movie } from "./movie.js";
import { MovieManager } from "./movieManager.js";

class App {
    constructor() {
        this.cartCounter = document.getElementById("cart-count");
        this.cartToggle = document.getElementById("cart-toggle");
        this.cartOverlay = document.getElementById("cart-overlay");
        this.cartSidebar = document.getElementById("cart-sidebar");
        this.cartClose = document.getElementById("cart-close");
        this.cartItems = document.getElementById("cart-items");
        this.cartTotal = document.getElementById("cart-total");
        this.cartCheckout = document.getElementById("cart-checkout");
        this.filterForm = document.getElementById("filter-form");
        this.searchInput = document.getElementById("search-input");
        this.genreSelect = document.getElementById("genre-select");
        this.priceInput = document.getElementById("max-price-input");
        this.priceValue = document.getElementById("max-price-value");
        this.isAvailableCheck = document.getElementById("available");
        this.isSoldCheck = document.getElementById("sold-out");
        this.availableContainer = document.getElementById(
            "available-movies-list",
        );
        this.soldContainer = document.getElementById(
            "non-available-movies-list",
        );
        this.availableCount = document.getElementById("available-count");
        this.soldCount = document.getElementById("non-available-count");
        this.apiService = new ApiService(
            "http://localhost:3000/movies",
            "http://localhost:3000/bookings",
        );
    }

    async init() {
        const movieData = await this.apiService.getMovies();
        const movies = movieData.map((movie) => {
            return this.movieInstance(
                parseInt(movie.id),
                movie.title,
                movie.genre,
                movie.poster,
                movie.price,
                movie.availableSeats,
            );
        });

        this.movieManager = new MovieManager(movies);
        this.bookingsArr = [];
        this.totalPrice = 0;
        this.cartEventListener();
        this.eventlistenerFilter();
        this.renderCard(movies);
    }

    movieInstance(
        movieId,
        movieTitle,
        movieGenre,
        moviePoster,
        moviePrice,
        movieAvailableSeats,
    ) {
        return new Movie(
            movieId,
            movieTitle,
            movieGenre,
            moviePoster,
            moviePrice,
            movieAvailableSeats,
        );
    }

    movieCard(movie, availability) {
        const div = document.createElement("div");
        const statusClass = availability ? "available" : "sold-out";
        const statusText = availability ? "Available" : "Sold Out";
        const buttonText = availability ? "Book Now" : "Sold Out";
        const buttonClass = availability
            ? "movie-card-button"
            : "movie-card-button sold-out";
        const buttonDisabled = availability ? "" : "disabled";
        const posterMarkup = movie.poster
            ? `<img class="movie-card-poster" src="${movie.poster}" alt="${movie.title} poster" loading="lazy" />`
            : `<div class="movie-poster-placeholder" data-initial="${movie.title[0]}"></div>`;

        div.classList.add("movie-card");
        div.innerHTML = `
            ${posterMarkup}
            <div class="movie-card-content">
                <h4 class="movie-card-title">${movie.title}</h4>
                <p class="movie-card-meta">${movie.genre}</p>
                <p class="movie-card-price">&euro;${movie.price}</p>
                <p class="movie-card-status ${statusClass}">${statusText}</p>
            </div>
            <button class="${buttonClass}" id="book-${parseInt(movie.id)}" ${buttonDisabled}>${buttonText}</button>
        `;
        const bookButton = div.querySelector(".movie-card-button");

        if (availability) {
            bookButton.addEventListener("click", () => {
                if (movie.availableSeats <= 0) {
                    return;
                }

                const cartItem = this.bookingsArr.find((item) => {
                    return item.movie.id === movie.id;
                });

                if (cartItem) {
                    if (cartItem.quantity >= movie.availableSeats) {
                        return;
                    }
                    cartItem.quantity++;
                } else {
                    this.bookingsArr.push({
                        movie: movie,
                        quantity: 1,
                    });
                }

                this.renderCardCart();
                this.cartCounter.textContent = this.bookingsArr.reduce(
                    (total, item) => {
                        return total + item.quantity;
                    },
                    0,
                );

                this.renderCard(
                    this.checkedHandler().filterMovies(this.filterObj()),
                );
            });
        }

        return div;
    }

    renderCard(movieArr) {
        this.availableContainer.textContent = "";
        this.soldContainer.textContent = "";

        movieArr.forEach((movie) => {
            const cartItem = this.bookingsArr.find((item) => {
                return item.movie.id === movie.id;
            });
            const cartQuantity = cartItem ? cartItem.quantity : 0;
            const remainingSeats = movie.availableSeats - cartQuantity;
            const movieIsAvailable = remainingSeats > 0;
            const movieCard = this.movieCard(movie, movieIsAvailable);

            if (movieIsAvailable) {
                this.availableContainer.append(movieCard);
            } else {
                this.soldContainer.append(movieCard);
            }
        });

        this.availableCount.textContent =
            this.availableContainer.children.length;
        this.soldCount.textContent = this.soldContainer.children.length;
    }

    filterObj() {
        const filterObject = {
            searchInp: this.searchInput.value,
            genre: this.genreSelect.value,
            price: this.priceInput.value,
            // "available": this.isAvailableCheck.checked,
            // "notAvailable": this.isSoldCheck.checked,
        };
        return filterObject;
    }

    eventlistenerFilter() {
        const inputElements = [...this.filterForm.elements];
        inputElements.forEach((input) => {
            input.addEventListener("change", () => {
                this.renderCard(
                    this.checkedHandler().filterMovies(this.filterObj()),
                );
                this.priceValue.innerHTML = `&euro;${this.priceInput.value}`;
            });
            input.addEventListener("input", () => {
                this.renderCard(
                    this.checkedHandler().filterMovies(this.filterObj()),
                );
                this.priceValue.innerHTML = `&euro;${this.priceInput.value}`;
            });
        });
    }

    checkedHandler() {
        if (this.isAvailableCheck.checked === this.isSoldCheck.checked) {
            return this.movieManager;
        }

        const movies = this.isAvailableCheck.checked
            ? this.movieManager.availableMovies()
            : this.movieManager.notAvailableMovies();

        return new MovieManager(movies);
    }

    cartEventListener() {
        this.cartToggle.addEventListener("click", () => {
            this.cartOverlay.classList.toggle("open");
            this.cartSidebar.classList.toggle("open");
            document.body.classList.toggle("no-scroll");
        });
        this.cartClose.addEventListener("click", () => {
            this.cartOverlay.classList.remove("open");
            this.cartSidebar.classList.remove("open");
            document.body.classList.remove("no-scroll");
        });
        window.addEventListener("click", (event) => {
            if (event.target === this.cartOverlay) {
                this.cartOverlay.classList.remove("open");
                this.cartSidebar.classList.remove("open");
                document.body.classList.remove("no-scroll");
            }
        });
        this.cartCheckout.addEventListener("click", async () => {
            if (this.bookingsArr.length === 0) {
                return;
            }

            const totalTickets = this.bookingsArr.reduce((total, item) => {
                return total + item.quantity;
            }, 0);
            const totalAmount = this.bookingsArr.reduce((total, item) => {
                return total + item.quantity * item.movie.price;
            }, 0);
            const finalAmount =
                totalTickets >= 5 ? (totalAmount * 90) / 100 : totalAmount;
            const bookingItems = this.bookingsArr.map((item) => {
                return {
                    movieId: item.movie.id,
                    title: item.movie.title,
                    quantity: item.quantity,
                    price: item.movie.price,
                    totalPrice: item.movie.price * item.quantity,
                };
            });

            for (const item of this.bookingsArr) {
                const newSeats = item.movie.availableSeats - item.quantity;

                await this.apiService.modifyMovie(item.movie.id, {
                    availableSeats: newSeats,
                });

                item.movie.availableSeats = newSeats;
            }

            await this.apiService.postBooking({
                items: bookingItems,
                totalTickets: totalTickets,
                discount: totalTickets >= 5 ? 10 : 0,
                totalAmount: totalAmount,
                finalAmount: finalAmount,
            });

            console.log(`Checkout total: &euro;${finalAmount.toFixed(2)}`);
            this.bookingsArr = [];
            this.renderCardCart();
            this.cartCounter.textContent = 0;
            this.renderCard(
                this.checkedHandler().filterMovies(this.filterObj()),
            );
        });
    }

    createCardCart(booking, quantity) {
        if (this.bookingsArr.length > 0) {
            const cardCart = document.createElement("div");
            const totalMoviePrice = booking.price * quantity;
            const increaseDisabled =
                quantity >= booking.availableSeats ? "disabled" : "";
            const posterMarkup = booking.poster
                ? `<img class="cart-card-poster" src="${booking.poster}" alt="${booking.title} poster" />`
                : `<div class="cart-card-poster-placeholder">${booking.title[0]}</div>`;
            cardCart.classList.add("cart-card");
            cardCart.innerHTML = `
                <div class="cart-card-left">
                    ${posterMarkup}
                    <div class="cart-card-content">
                        <h4 class="cart-item-title">${booking.title}</h4>
                        <p class="cart-item-price">${booking.genre}</p>
                        <p class="cart-item-price">&euro;${totalMoviePrice.toFixed(2)}</p>
                    </div>
                </div>
                <div class="cart-item-actions">
                    <button class="cart-quantity-btn" id="decrease-${booking.id}" type="button">-</button>
                    <span id="quantity-${booking.id}">${quantity}</span>
                    <button class="cart-quantity-btn" id="increase-${booking.id}" type="button" ${increaseDisabled}>+</button>
                    <button class="cart-remove" id="remove-${booking.id}" type="button">Remove</button>
                </div>
            `;
            const decreaseBtn = cardCart.querySelector(
                `#decrease-${booking.id}`,
            );
            const increaseBtn = cardCart.querySelector(
                `#increase-${booking.id}`,
            );
            const removeBtn = cardCart.querySelector(`#remove-${booking.id}`);

            decreaseBtn.addEventListener("click", () => {
                const cartItem = this.bookingsArr.find((item) => {
                    return item.movie.id === booking.id;
                });

                if (cartItem.quantity > 1) {
                    cartItem.quantity--;
                } else {
                    this.bookingsArr = this.bookingsArr.filter((item) => {
                        return item.movie.id !== booking.id;
                    });
                }

                this.renderCardCart();

                this.cartCounter.textContent = this.bookingsArr.reduce(
                    (total, item) => {
                        return total + item.quantity;
                    },
                    0,
                );
                this.renderCard(
                    this.checkedHandler().filterMovies(this.filterObj()),
                );
            });

            increaseBtn.addEventListener("click", () => {
                const cartItem = this.bookingsArr.find((item) => {
                    return item.movie.id === booking.id;
                });

                if (cartItem.quantity >= booking.availableSeats) {
                    return;
                }
                cartItem.quantity++;

                this.renderCardCart();

                this.cartCounter.textContent = this.bookingsArr.reduce(
                    (total, item) => {
                        return total + item.quantity;
                    },
                    0,
                );
                this.renderCard(
                    this.checkedHandler().filterMovies(this.filterObj()),
                );
            });
            removeBtn.addEventListener("click", () => {
                this.bookingsArr = this.bookingsArr.filter((item) => {
                    return item.movie.id !== booking.id;
                });
                this.renderCardCart();
                this.cartCounter.textContent = this.bookingsArr.reduce(
                    (total, item) => {
                        return total + item.quantity;
                    },
                    0,
                );
                this.renderCard(
                    this.checkedHandler().filterMovies(this.filterObj()),
                );
            });
            return cardCart;
        }
    }
    renderCardCart() {
        if (this.bookingsArr.length > 0) {
            this.cartCheckout.disabled = false;
            this.cartItems.textContent = "";
            this.bookingsArr.forEach((bookingInfo) => {
                this.cartItems.append(
                    this.createCardCart(
                        bookingInfo.movie,
                        bookingInfo.quantity,
                    ),
                );
            });
            const totalAmount = this.bookingsArr.reduce((total, item) => {
                    return total + item.quantity * item.movie.price;
                }, 0);
            const totTickets = this.bookingsArr.reduce((total, item) => {
                    return total + item.quantity;
                }, 0);
            if (totTickets >= 5) {
                const offTotalAmount = (totalAmount * 90) / 100;
                this.cartTotal.innerHTML = `
                    <span class="cart-discount">10% off</span>
                    <span class="cart-old-total">&euro;${totalAmount.toFixed(2)}</span>
                    &euro;${offTotalAmount.toFixed(2)}
                `;
            } else {
                this.cartTotal.innerHTML = `&euro;${totalAmount.toFixed(2)}`;
            }
        } else {
            this.cartCheckout.disabled = true;
            this.cartItems.innerHTML = "<p>Your cart is empty.</p>";
            this.cartTotal.innerHTML = `&euro;0`;
        }
    }
}

const app = new App();
app.init();
