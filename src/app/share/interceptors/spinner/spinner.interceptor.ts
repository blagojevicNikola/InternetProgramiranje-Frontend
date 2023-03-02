import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse
} from '@angular/common/http';
import { finalize, Observable, tap } from 'rxjs';
import { SpinnerService } from '../../services/spinner/spinner.service';

@Injectable()
export class SpinnerInterceptor implements HttpInterceptor {

  constructor(private service: SpinnerService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.service.count++;
    this.service.show();

    return next.handle(request)
      .pipe(finalize(() => {
        this.service.count--;
        if (this.service.count === 0) {
          this.service.hide();
        }
      }));
  }
}
