import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  standalone: true,
  selector: 'app-admin-movie-form',
  imports: [CommonModule, FormsModule, RouterModule, HttpClientModule],
  templateUrl: './admin-movie-form.component.html',
  styleUrls: ['./admin-movie-form.component.scss']
})
export class AdminMovieFormComponent implements OnInit {
  isEdit = false;
  movie: any = {
    title: '',
    description: '',
    genre: '',
    director: '',
    cast: '',
    duration: null,
    release_date: '',
    poster_url: null
  };
  selectedFile: File | null = null;
  previewUrl: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.http.get<{ data: any }>(`http://localhost:8000/api/movies/detail/${id}`)
        .subscribe(res => this.movie = res.data);
    }
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0] || null;
    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onload = e => this.previewUrl = (e.target as any).result;
      reader.readAsDataURL(this.selectedFile);
    }
  }

  save() {
    const formData = new FormData();
    formData.append('title', this.movie.title);
    formData.append('description', this.movie.description);
    formData.append('genre', this.movie.genre);
    formData.append('director', this.movie.director);
    formData.append('cast', this.movie.cast);
    formData.append('duration', this.movie.duration);
    formData.append('release_date', this.movie.release_date);
    if (this.selectedFile) {
      formData.append('poster_url', this.selectedFile);
    }

    const url = this.isEdit
      ? `http://localhost:8000/api/movies/update/${this.movie.id}`
      : 'http://localhost:8000/api/movies/create';

    this.http.post(url, formData).subscribe(() => {
      this.router.navigate(['/admin/movies']);
    });
  }
}
