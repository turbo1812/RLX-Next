import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { InventoryItem, CreateInventoryItemRequest, UpdateInventoryItemRequest } from '../../../../../../libs/shared-types/inventory';

@Injectable({
  providedIn: 'root'
})
export class InventoryRepository {
  private readonly baseUrl = '/api/inventory';

  constructor(private http: HttpClient) { }

  getAll(): Observable<InventoryItem[]> {
    return this.http.get<InventoryItem[]>(this.baseUrl);
  }

  getById(id: string): Observable<InventoryItem> {
    return this.http.get<InventoryItem>(`${this.baseUrl}/${id}`);
  }

  create(request: CreateInventoryItemRequest): Observable<InventoryItem> {
    return this.http.post<InventoryItem>(this.baseUrl, request);
  }

  update(id: string, request: UpdateInventoryItemRequest): Observable<InventoryItem> {
    return this.http.put<InventoryItem>(`${this.baseUrl}/${id}`, request);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  search(query: string): Observable<InventoryItem[]> {
    return this.http.get<InventoryItem[]>(`${this.baseUrl}/search`, {
      params: { query }
    });
  }

  getByCategory(category: string): Observable<InventoryItem[]> {
    return this.http.get<InventoryItem[]>(`${this.baseUrl}/category/${category}`);
  }

  getLowStockItems(threshold: number = 10): Observable<InventoryItem[]> {
    return this.http.get<InventoryItem[]>(`${this.baseUrl}/low-stock`, {
      params: { threshold: threshold.toString() }
    });
  }
}