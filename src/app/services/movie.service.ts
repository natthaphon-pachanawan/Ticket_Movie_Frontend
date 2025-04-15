import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Movie{
  id: number;
  title: string;
  description: string;
  genre: string;
  director: string;
  cast: string;
  duration: number;
  release_date: string;
  poster_url: string;
  created_at: string;
  updated_at: string;
}

export interface MovieResponse{
  data: Movie[];
}

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  private apiUrl = 'http://127.0.0.1:8000/api/movies/list';

  constructor(private http: HttpClient) { }

  getMovies(): Observable<MovieResponse> {
    return this.http.get<MovieResponse>(this.apiUrl);
  }

  getMovieById(id: number): Observable<{ data: Movie }> {
    return this.http.get<{ data: Movie }>(`http://127.0.0.1:8000/api/movies/detail/${id}`);
  }
  
}
