import { Injectable } from '@angular/core'; // تأكد من استيراد Injectable
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root' 
})
export class LoadingService {
  private loadingSubject = new BehaviorSubject<boolean>(true); // << لاحظ البداية بـ true
  loading$: Observable<boolean> = this.loadingSubject.asObservable();

  show() {
    this.loadingSubject.next(true);
  }

  hide() {
    this.loadingSubject.next(false);
  }

}