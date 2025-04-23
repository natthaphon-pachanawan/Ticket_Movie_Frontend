// main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig }          from './app/app.config';
import { AppComponent }       from './app/app.component';
import { registerLocaleData } from '@angular/common';
import localeTh               from '@angular/common/locales/th';
registerLocaleData(localeTh, 'th');
import { LOCALE_ID } from '@angular/core';

bootstrapApplication(AppComponent, {
  ...appConfig,
  providers: [
    ...(appConfig.providers ?? []),
    { provide: LOCALE_ID, useValue: 'th' },
  ]
})
.catch((err) => console.error(err));
