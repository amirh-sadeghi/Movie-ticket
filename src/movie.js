export class Movie{
    constructor(id, title, genre, poster, price, availableSeats){
        this.id = id;
        this.title = title;
        this.genre = genre;
        this.poster = poster;
        this.price = price;
        this.availableSeats = availableSeats;
    }

    isAvailable(){
        if(this.availableSeats === 0){
            return false;
        }
        else{
            return true;
        }
    }
}
