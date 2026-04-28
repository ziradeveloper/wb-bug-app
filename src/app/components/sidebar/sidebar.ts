import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

interface MenuItem {
  id: string;
  label: string;
  icon?: string;
  route?: string;
  children?: MenuItem[];
  isExpanded?: boolean;
}

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, RouterLink],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css'
})
export class SidebarComponent {
  isCollapsed = false;

  menuItems: MenuItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: 'bi-speedometer2',
      route: '/dashboard',
      isExpanded: false
    },
    {
      id: 'users',
      label: 'Users',
      icon: 'bi-people',
      route: '/users',
      isExpanded: false
    },
    {
      id: 'content',
      label: 'Content',
      icon: 'bi-file-text',
      isExpanded: false,
      children: [
        {
          id: 'posts',
          label: 'Posts',
          icon: 'bi-pencil-square',
          route: '/content/posts',
          isExpanded: false
        },
        {
          id: 'categories',
          label: 'Categories',
          icon: 'bi-list',
          isExpanded: false,
          children: [
            {
              id: 'cat-main',
              label: 'Main Categories',
              icon: 'bi-folder',
              route: '/content/categories/main',
              isExpanded: false
            },
            {
              id: 'cat-sub',
              label: 'Subcategories',
              icon: 'bi-folder-plus',
              route: '/content/categories/sub',
              isExpanded: false
            }
          ]
        },
        {
          id: 'comments',
          label: 'Comments',
          icon: 'bi-chat-left-quote',
          route: '/content/comments',
          isExpanded: false
        }
      ]
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: 'bi-gear',
      isExpanded: false,
      children: [
        {
          id: 'general',
          label: 'General',
          icon: 'bi-sliders2',
          route: '/settings/general',
          isExpanded: false
        },
        {
          id: 'security',
          label: 'Security',
          icon: 'bi-shield-lock',
          isExpanded: false,
          children: [
            {
              id: 'access',
              label: 'Access Control',
              icon: 'bi-lock',
              route: '/settings/security/access',
              isExpanded: false
            },
            {
              id: 'permissions',
              label: 'Permissions',
              icon: 'bi-key',
              route: '/settings/security/permissions',
              isExpanded: false
            }
          ]
        },
        {
          id: 'notifications',
          label: 'Notifications',
          icon: 'bi-bell',
          route: '/settings/notifications',
          isExpanded: false
        }
      ]
    }
  ];

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }

  toggleMenuExpand(item: MenuItem) {
    if (item.children && item.children.length > 0) {
      item.isExpanded = !item.isExpanded;
    }
  }

  hasChildren(item: MenuItem): boolean {
    return item.children !== undefined && item.children.length > 0;
  }
}
