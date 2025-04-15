import { Component, OnInit } from '@angular/core';
import { MovieService, Movie } from '../../services/movie.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-home',
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  movies: Movie[] = [];

  constructor(private movieService: MovieService) {}

  ngOnInit(): void {
    this.movieService.getMovies().subscribe((res) => {
      this.movies = res.data;
    });
  }
}
