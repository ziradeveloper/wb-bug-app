import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar';
import { SidebarComponent } from '../sidebar/sidebar';
import { FooterComponent } from '../footer/footer';
import { ThemeControllerComponent } from '../../theme-controller/theme-controller';

@Component({
  selector: 'app-main-layout',
  imports: [NavbarComponent, SidebarComponent, FooterComponent, ThemeControllerComponent, RouterOutlet],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css'
})
export class MainLayoutComponent { }
