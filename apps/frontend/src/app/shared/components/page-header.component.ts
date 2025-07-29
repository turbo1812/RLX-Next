import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-page-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page-header">
      <div class="page-header-content">
        <div class="page-title-container">
          <h1 class="page-title">{{ title }}</h1>
          <p class="page-subtitle" *ngIf="subtitle">{{ subtitle }}</p>
        </div>
        <div class="page-actions" *ngIf="showActions">
          <ng-content select="[slot=actions]"></ng-content>
        </div>
      </div>
      <div class="page-breadcrumb" *ngIf="breadcrumbs && breadcrumbs.length > 0">
        <nav aria-label="breadcrumb">
          <ol class="breadcrumb">
            <li class="breadcrumb-item" *ngFor="let crumb of breadcrumbs; let last = last" 
                [class.active]="last">
              <a *ngIf="!last && crumb.link" [href]="crumb.link">{{ crumb.label }}</a>
              <span *ngIf="last || !crumb.link">{{ crumb.label }}</span>
            </li>
          </ol>
        </nav>
      </div>
    </div>
  `,
  styles: [`
    .page-header {
      background: white;
      border-bottom: 1px solid #e9ecef;
      padding: 1.5rem 0;
      margin-bottom: 2rem;
    }

    .page-header-content {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 1rem;
    }

    .page-title-container {
      flex: 1;
    }

    .page-title {
      font-size: 2rem;
      font-weight: 600;
      color: #2d3748;
      margin: 0 0 0.5rem 0;
    }

    .page-subtitle {
      color: #718096;
      margin: 0;
      font-size: 1rem;
    }

    .page-actions {
      display: flex;
      gap: 0.75rem;
      align-items: center;
    }

    .breadcrumb {
      display: flex;
      list-style: none;
      margin: 0;
      padding: 0;
      background: none;
    }

    .breadcrumb-item {
      display: flex;
      align-items: center;
    }

    .breadcrumb-item + .breadcrumb-item::before {
      content: '/';
      margin: 0 0.5rem;
      color: #a0aec0;
    }

    .breadcrumb-item a {
      color: #4299e1;
      text-decoration: none;
    }

    .breadcrumb-item a:hover {
      text-decoration: underline;
    }

    .breadcrumb-item.active {
      color: #718096;
    }
  `]
})
export class PageHeaderComponent {
  @Input() title: string = '';
  @Input() subtitle?: string;
  @Input() showActions: boolean = false;
  @Input() breadcrumbs?: { label: string; link?: string }[];
}