import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { AuthInterceptor } from './interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),

    // ✅ เพิ่ม HttpClient พร้อมเปิดให้ใช้ Interceptor
    provideHttpClient(withInterceptorsFromDi()),

    // ✅ ลงทะเบียน Interceptor ที่สร้าง
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ]
};
