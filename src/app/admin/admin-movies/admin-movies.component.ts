import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  standalone: true,
  selector: 'app-admin-movies',
  imports: [CommonModule, RouterModule, HttpClientModule],
  templateUrl: './admin-movies.component.html',
  styleUrls: ['./admin-movies.component.scss']
})
export class AdminMoviesComponent implements OnInit {
  movies: any[] = [];

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadMovies();
  }

  loadMovies() {
    this.http.get<{ data: any[] }>('http://localhost:8000/api/movies/list')
      .subscribe(res => this.movies = res.data);
  }

  goCreate() {
    this.router.navigate(['/admin/movies/create']);
  }

  goEdit(id: number) {
    this.router.navigate(['/admin/movies/edit', id]);
  }

  delete(id: number) {
    if (!confirm('ลบภาพยนตร์นี้?')) {
      return;
    }
    this.http.delete(`http://localhost:8000/api/movies/delete/${id}`)
      .subscribe(() => this.loadMovies());
  }
}
