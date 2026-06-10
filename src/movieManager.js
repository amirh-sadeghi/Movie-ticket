export class MovieManager{
    constructor(movieArr){
        this.movieArr = [...movieArr]
    }

    filterMovies(filterObj){
        let tempMovieArr = [...this.movieArr]
        if(filterObj.searchInp){
            tempMovieArr = tempMovieArr.filter(movie => {
                return movie.title.trim().toLowerCase().includes(filterObj.searchInp.trim().toLowerCase())
            })
        }
        if(filterObj.genre){
            tempMovieArr = tempMovieArr.filter(movie => {
                return movie.genre.trim().toLowerCase() === filterObj.genre.trim().toLowerCase();
            })
        }
        if(filterObj.price){
            tempMovieArr = tempMovieArr.filter(movie => {
                return movie.price <= filterObj.price;
            })
        }

        return tempMovieArr;
    }

    availableMovies(){
        return this.movieArr.filter(movie => {
            return movie.isAvailable();
        })
    }

    notAvailableMovies(){
        return this.movieArr.filter(movie => {
            return !(movie.isAvailable());
        })
    }
}
