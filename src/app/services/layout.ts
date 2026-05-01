import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LayoutService {
  isSidebarCollapsed = signal(true);

  toggleSidebar() {
    this.isSidebarCollapsed.update(v => !v);
  }
}
