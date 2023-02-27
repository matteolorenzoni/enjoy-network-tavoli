import { Component } from '@angular/core';
import { environment } from '../environments/environment';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(private userService: UserService) {}

  ngOnInit(): void {
    if (environment.production) document.addEventListener('contextmenu', (event) => event.preventDefault());
  }
}
