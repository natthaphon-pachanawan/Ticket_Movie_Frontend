import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MovieService, Movie } from '../../services/movie.service';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-movie-detail',
  imports: [CommonModule, RouterModule],
  templateUrl: './movie-detail.component.html',
  styleUrls: ['./movie-detail.component.scss']
})
export class MovieDetailComponent implements OnInit {
  movie!: Movie;

  constructor(
    private route: ActivatedRoute,
    private movieService: MovieService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.movieService.getMovieById(+id).subscribe((res) => {
        this.movie = res.data;
      });
    }
  }
}
