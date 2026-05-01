import { Component, inject } from '@angular/core';
import { LayoutService } from '../../../services/layout';

@Component({
  selector: 'app-navbar',
  imports: [],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class NavbarComponent {
  layout = inject(LayoutService);
}
