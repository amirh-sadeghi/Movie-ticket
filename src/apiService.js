export class ApiService {
    constructor(moviesUrl, bookingsUrl) {
        this.movieUrl = moviesUrl;
        this.bookingsUrl = bookingsUrl;
    }

    async getMovies() {
        try {
            const response = await fetch(this.movieUrl);
            if (!response.ok) {
                throw new Error("Couldn't get the movies!");
            }
            return await response.json();
        } catch (err) {
            throw err;
        } finally {
            console.log("Request getMovie Completed!");
        }
    }

    async postMovie(movieData) {
        try {
            const response = await fetch(this.movieUrl, {
                method: "POST",
                headers: {
                    "content-type": "application/json",
                },
                body: JSON.stringify(movieData),
            });
            if (!response.ok) {
                throw new Error("Couldn't post the movie!");
            }
            return await response.json();
        } catch (err) {
            throw err;
        } finally {
            console.log("Request postMovie Completed!");
        }
    }

    async modifyMovie(movieId, movieData) {
        try {
            const response = await fetch(`${this.movieUrl}/${movieId}`, {
                method: "PATCH",
                headers: {
                    "content-type": "application/json",
                },
                body: JSON.stringify(movieData),
            });
            if (!response.ok) {
                throw new Error("Couldn't modify the movie!");
            }
            return await response.json();
        } catch (err) {
            throw err;
        } finally {
            console.log("Request modifyMovie Completed!");
        }
    }

    async deleteMovie(movieId) {
        try {
            const response = await fetch(`${this.movieUrl}/${movieId}`, {
                method: "DELETE",
            });
            if (!response.ok) {
                throw new Error("Couldn't delete the movie!");
            }
        } catch (err) {
            throw err;
        } finally {
            console.log("Request deleteMovie Completed!");
        }
    }

    async getBookings() {
        try {
            const response = await fetch(this.bookingsUrl);
            if (!response.ok) {
                throw new Error("Couldn't get the bookings!");
            }
            return await response.json();
        } catch (err) {
            throw err;
        } finally {
            console.log("Request getBookings Completed!");
        }
    }

    async postBooking(bookingData) {
        try {
            const response = await fetch(this.bookingsUrl, {
                method: "POST",
                headers: {
                    "content-type": "application/json",
                },
                body: JSON.stringify(bookingData),
            });
            if (!response.ok) {
                throw new Error("Couldn't post the booking!");
            }
            return await response.json();
        } catch (err) {
            throw err;
        } finally {
            console.log("Request postBooking Completed!");
        }
    }

    async modifyBooking(bookingId, bookingData) {
        try {
            const response = await fetch(`${this.bookingsUrl}/${bookingId}`, {
                method: "PATCH",
                headers: {
                    "content-type": "application/json",
                },
                body: JSON.stringify(bookingData),
            });
            if (!response.ok) {
                throw new Error("Couldn't modify the booking!");
            }
            return await response.json();
        } catch (err) {
            throw err;
        } finally {
            console.log("Request modifyBooking Completed!");
        }
    }

    async deleteMovie(bookingId) {
        try {
            const response = await fetch(`${this.bookingsUrl}/${bookingId}`, {
                method: "DELETE",
            });
            if (!response.ok) {
                throw new Error("Couldn't delete the booking!");
            }
        } catch (err) {
            throw err;
        } finally {
            console.log("Request deleteBooking Completed!");
        }
    }
}
