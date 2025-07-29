import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { InventoryItem, CreateInventoryRequest } from '../../../../../../libs/shared-types/inventory';
import { InventoryRepository } from './inventory.repository';
import { ErrorHandlerService } from '../../core/services/error-handler.service';

@Injectable({ providedIn: 'root' })
export class InventoryService {
  private readonly repository = inject(InventoryRepository);
  private readonly errorHandler = inject(ErrorHandlerService);
  
  private readonly _items$ = new BehaviorSubject<InventoryItem[]>([]);
  private readonly _loading$ = new BehaviorSubject<boolean>(false);
  private readonly _error$ = new BehaviorSubject<string | null>(null);

  readonly items$ = this._items$.asObservable();
  readonly loading$ = this._loading$.asObservable();
  readonly error$ = this._error$.asObservable();

  async loadItems(): Promise<void> {
    this._loading$.next(true);
    this._error$.next(null);
    
    try {
      const items = await firstValueFrom(this.repository.getAll());
      this._items$.next(items);
    } catch (error) {
      const errorMessage = 'Failed to load inventory items';
      this._error$.next(errorMessage);
      this.errorHandler.handleError(error, 'InventoryService.loadItems');
      throw error;
    } finally {
      this._loading$.next(false);
    }
  }

  async createItem(request: CreateInventoryRequest): Promise<InventoryItem> {
    try {
      const newItem = await firstValueFrom(this.repository.create(request));
      const currentItems = this._items$.value;
      this._items$.next([...currentItems, newItem]);
      return newItem;
    } catch (error) {
      this.errorHandler.handleError(error, 'InventoryService.createItem');
      throw error;
    }
  }

  async updateItem(id: string, updates: Partial<CreateInventoryRequest>): Promise<InventoryItem> {
    try {
      const updatedItem = await firstValueFrom(this.repository.update(id, updates));
      const currentItems = this._items$.value;
      const updatedItems = currentItems.map(item => 
        item.id === id ? updatedItem : item
      );
      this._items$.next(updatedItems);
      return updatedItem;
    } catch (error) {
      this.errorHandler.handleError(error, 'InventoryService.updateItem');
      throw error;
    }
  }

  async deleteItem(id: string): Promise<void> {
    try {
      await firstValueFrom(this.repository.delete(id));
      const currentItems = this._items$.value;
      const filteredItems = currentItems.filter(item => item.id !== id);
      this._items$.next(filteredItems);
    } catch (error) {
      this.errorHandler.handleError(error, 'InventoryService.deleteItem');
      throw error;
    }
  }

  getItemById(id: string): InventoryItem | undefined {
    return this._items$.value.find(item => item.id === id);
  }

  refreshItems(): Promise<void> {
    return this.loadItems();
  }
}