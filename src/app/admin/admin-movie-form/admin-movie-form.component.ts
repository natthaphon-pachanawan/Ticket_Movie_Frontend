import { Component, OnInit } from '@angular/core';
import { CommonModule }       from '@angular/common';
import { FormsModule }        from '@angular/forms';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  standalone: true,
  selector: 'app-admin-movie-form',
  imports: [CommonModule, FormsModule, RouterModule, HttpClientModule],
  templateUrl: './admin-movie-form.component.html',
  styleUrls: ['./admin-movie-form.component.scss']
})
export class AdminMovieFormComponent implements OnInit {
  movie: any = {
    title: '',
    description: '',
    genre: '',
    director: '',
    cast: '',
    duration: null,
    release_date: '',
    poster_url: ''
  };
  isEdit = false;
  previewUrl: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.http.get<{ data: any }>(`http://localhost:8000/api/movies/detail/${id}`)
        .subscribe(res => {
          this.movie = res.data;
          // ฝั่ง poster_url นำไป preview
          this.previewUrl = `http://localhost:8000/storage/${this.movie.poster_url}`;
        });
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = e => this.previewUrl = (e.target as any).result;
      reader.readAsDataURL(file);
    }
  }

  save() {
    const form = new FormData();
    form.append('title', this.movie.title);
    form.append('description', this.movie.description);
    form.append('genre', this.movie.genre);
    form.append('director', this.movie.director);
    form.append('cast', this.movie.cast);
    form.append('duration', this.movie.duration);
    form.append('release_date', this.movie.release_date);
    if (this.selectedFile) {
      form.append('poster_url', this.selectedFile);
    }

    const url = this.isEdit
      ? `http://localhost:8000/api/movies/update/${this.movie.id}`
      : 'http://localhost:8000/api/movies/create';

    this.http.post(url, form).subscribe({
      next: () => {
        alert('บันทึกสำเร็จ!');
        this.router.navigate(['/admin/movies']);
      },
      error: err => {
        console.error(err);
        alert('เกิดข้อผิดพลาดในการบันทึก');
      }
    });
  }
}
