// src/app/pages/home/home.component.ts

import { Component, OnInit } from '@angular/core';
import { MovieService, Movie } from '../../services/movie.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-home',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  movies: Movie[] = [];
  searchTerm = '';

  constructor(private movieService: MovieService) {}

  ngOnInit(): void {
    this.loadMovies();
  }

  loadMovies() {
    this.movieService.getMovies(this.searchTerm)
      .subscribe(res => this.movies = res.data);
  }

  // เรียกเมื่อ user พิมพ์
  onSearch() {
    this.loadMovies();
  }
}
