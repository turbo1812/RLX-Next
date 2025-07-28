import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, retry, tap } from 'rxjs/operators';

// Basic types for now - will be replaced with proper imports
interface InventoryItem {
  id: string;
  name: string;
  SKU: string;
  quantity: number;
  location: string;
  category: string;
  lastUpdated: Date;
  minStockLevel: number;
  maxStockLevel: number;
  supplier: string;
  cost: number;
}

interface CreateInventoryItemRequest {
  name: string;
  SKU: string;
  quantity: number;
  location: string;
  category: string;
  minStockLevel: number;
  maxStockLevel: number;
  supplier: string;
  cost: number;
}

interface UpdateInventoryItemRequest extends Partial<CreateInventoryItemRequest> {}

interface Order {
  orderNumber: string;
  customerName: string;
  orderDate: Date;
  status: string;
  items: OrderItem[];
  totalAmount: number;
  shippingAddress: string;
  priority: string;
}

interface OrderItem {
  SKU: string;
  quantity: number;
  unitPrice: number;
}

interface CreateOrderRequest {
  customerName: string;
  items: OrderItem[];
  shippingAddress: string;
  priority: string;
}

interface FleetVehicle {
  vehicleNumber: string;
  make: string;
  model: string;
  year: number;
  type: string;
  status: string;
  currentLocation: string;
  lastMaintenance: Date;
  nextMaintenance: Date;
  driver: string;
  capacity: number;
}

interface CreateFleetVehicleRequest {
  make: string;
  model: string;
  year: number;
  type: string;
  capacity: number;
}

interface UpdateFleetVehicleRequest extends Partial<CreateFleetVehicleRequest> {
  nextMaintenance?: Date;
  lastMaintenance?: Date;
}

interface WarehouseLayout {
  id: string;
  name: string;
  width: number;
  height: number;
  description: string;
  zones: WarehouseZone[];
}

interface WarehouseZone {
  id: string;
  name: string;
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
  capacity: number;
  currentOccupancy: number;
}

// API Endpoints
const API_ENDPOINTS = {
  INVENTORY: {
    GET_ALL: '/inventory',
    GET_BY_ID: '/inventory/{id}',
    CREATE: '/inventory',
    UPDATE: '/inventory/{id}',
    DELETE: '/inventory/{id}'
  },
  ORDERS: {
    GET_ALL: '/orders',
    GET_BY_ID: '/orders/{id}',
    CREATE: '/orders',
    UPDATE: '/orders/{id}',
    DELETE: '/orders/{id}'
  },
  FLEET: {
    GET_ALL: '/fleet',
    GET_BY_ID: '/fleet/{id}',
    CREATE: '/fleet',
    UPDATE: '/fleet/{id}',
    DELETE: '/fleet/{id}'
  },
  WAREHOUSE: {
    GET_LAYOUT: '/warehouse',
    UPDATE_LAYOUT: '/warehouse',
    GET_ZONE: '/warehouse/zone/{id}'
  }
};

// HTTP Status Codes
const HTTP_STATUS_CODES = {
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500
};

// Error Messages
const ERROR_MESSAGES = {
  UNKNOWN_ERROR: 'An unknown error occurred',
  BAD_REQUEST: 'Invalid request data',
  UNAUTHORIZED: 'Authentication required',
  FORBIDDEN: 'Access denied',
  NOT_FOUND: 'Resource not found',
  INTERNAL_SERVER_ERROR: 'Internal server error'
};

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly baseUrl = 'http://localhost:7071/api';
  private readonly httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    })
  };

  // Loading state management
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();

  // Error state management
  private errorSubject = new BehaviorSubject<string | null>(null);
  public error$ = this.errorSubject.asObservable();

  constructor(private http: HttpClient) {}

  // Generic error handler
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = ERROR_MESSAGES.UNKNOWN_ERROR;

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Client Error: ${error.error.message}`;
    } else {
      // Server-side error
      switch (error.status) {
        case HTTP_STATUS_CODES.BAD_REQUEST:
          errorMessage = ERROR_MESSAGES.BAD_REQUEST;
          break;
        case HTTP_STATUS_CODES.UNAUTHORIZED:
          errorMessage = ERROR_MESSAGES.UNAUTHORIZED;
          break;
        case HTTP_STATUS_CODES.FORBIDDEN:
          errorMessage = ERROR_MESSAGES.FORBIDDEN;
          break;
        case HTTP_STATUS_CODES.NOT_FOUND:
          errorMessage = ERROR_MESSAGES.NOT_FOUND;
          break;
        case HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR:
          errorMessage = ERROR_MESSAGES.INTERNAL_SERVER_ERROR;
          break;
        default:
          errorMessage = `Server Error: ${error.status} - ${error.message}`;
      }
    }

    this.errorSubject.next(errorMessage);
    return throwError(() => new Error(errorMessage));
  }

  // Generic request wrapper with loading state
  private request<T>(requestFn: () => Observable<T>): Observable<T> {
    this.loadingSubject.next(true);
    this.errorSubject.next(null);

    return requestFn().pipe(
      tap(() => this.loadingSubject.next(false)),
      catchError(error => {
        this.loadingSubject.next(false);
        return this.handleError(error);
      }),
      retry(1) // Retry once on failure
    );
  }

  // Clear error state
  public clearError(): void {
    this.errorSubject.next(null);
  }

  // ===== INVENTORY API =====
  
  public getInventoryItems(): Observable<InventoryItem[]> {
    return this.request(() => 
      this.http.get<InventoryItem[]>(`${this.baseUrl}${API_ENDPOINTS.INVENTORY.GET_ALL}`)
    );
  }

  public getInventoryItem(id: string): Observable<InventoryItem> {
    return this.request(() => 
      this.http.get<InventoryItem>(`${this.baseUrl}${API_ENDPOINTS.INVENTORY.GET_BY_ID.replace('{id}', id)}`)
    );
  }

  public createInventoryItem(item: CreateInventoryItemRequest): Observable<InventoryItem> {
    return this.request(() => 
      this.http.post<InventoryItem>(`${this.baseUrl}${API_ENDPOINTS.INVENTORY.CREATE}`, item, this.httpOptions)
    );
  }

  public updateInventoryItem(id: string, item: UpdateInventoryItemRequest): Observable<InventoryItem> {
    return this.request(() => 
      this.http.put<InventoryItem>(`${this.baseUrl}${API_ENDPOINTS.INVENTORY.UPDATE.replace('{id}', id)}`, item, this.httpOptions)
    );
  }

  public deleteInventoryItem(id: string): Observable<void> {
    return this.request(() => 
      this.http.delete<void>(`${this.baseUrl}${API_ENDPOINTS.INVENTORY.DELETE.replace('{id}', id)}`)
    );
  }

  // ===== ORDERS API =====

  public getOrders(): Observable<Order[]> {
    return this.request(() => 
      this.http.get<Order[]>(`${this.baseUrl}${API_ENDPOINTS.ORDERS.GET_ALL}`)
    );
  }

  public getOrder(id: string): Observable<Order> {
    return this.request(() => 
      this.http.get<Order>(`${this.baseUrl}${API_ENDPOINTS.ORDERS.GET_BY_ID.replace('{id}', id)}`)
    );
  }

  public createOrder(order: CreateOrderRequest): Observable<Order> {
    return this.request(() => 
      this.http.post<Order>(`${this.baseUrl}${API_ENDPOINTS.ORDERS.CREATE}`, order, this.httpOptions)
    );
  }

  public updateOrder(id: string, order: Partial<Order>): Observable<Order> {
    return this.request(() => 
      this.http.put<Order>(`${this.baseUrl}${API_ENDPOINTS.ORDERS.UPDATE.replace('{id}', id)}`, order, this.httpOptions)
    );
  }

  public deleteOrder(id: string): Observable<void> {
    return this.request(() => 
      this.http.delete<void>(`${this.baseUrl}${API_ENDPOINTS.ORDERS.DELETE.replace('{id}', id)}`)
    );
  }

  // ===== FLEET API =====

  public getFleetVehicles(): Observable<FleetVehicle[]> {
    return this.request(() => 
      this.http.get<FleetVehicle[]>(`${this.baseUrl}${API_ENDPOINTS.FLEET.GET_ALL}`)
    );
  }

  public getFleetVehicle(id: string): Observable<FleetVehicle> {
    return this.request(() => 
      this.http.get<FleetVehicle>(`${this.baseUrl}${API_ENDPOINTS.FLEET.GET_BY_ID.replace('{id}', id)}`)
    );
  }

  public createFleetVehicle(vehicle: CreateFleetVehicleRequest): Observable<FleetVehicle> {
    return this.request(() => 
      this.http.post<FleetVehicle>(`${this.baseUrl}${API_ENDPOINTS.FLEET.CREATE}`, vehicle, this.httpOptions)
    );
  }

  public updateFleetVehicle(id: string, vehicle: UpdateFleetVehicleRequest): Observable<FleetVehicle> {
    return this.request(() => 
      this.http.put<FleetVehicle>(`${this.baseUrl}${API_ENDPOINTS.FLEET.UPDATE.replace('{id}', id)}`, vehicle, this.httpOptions)
    );
  }

  public deleteFleetVehicle(id: string): Observable<void> {
    return this.request(() => 
      this.http.delete<void>(`${this.baseUrl}${API_ENDPOINTS.FLEET.DELETE.replace('{id}', id)}`)
    );
  }

  // ===== WAREHOUSE API =====

  public getWarehouseLayout(): Observable<WarehouseLayout> {
    return this.request(() => 
      this.http.get<WarehouseLayout>(`${this.baseUrl}${API_ENDPOINTS.WAREHOUSE.GET_LAYOUT}`)
    );
  }

  public updateWarehouseLayout(layout: WarehouseLayout): Observable<WarehouseLayout> {
    return this.request(() => 
      this.http.post<WarehouseLayout>(`${this.baseUrl}${API_ENDPOINTS.WAREHOUSE.UPDATE_LAYOUT}`, layout, this.httpOptions)
    );
  }

  public getWarehouseZone(id: string): Observable<any> {
    return this.request(() => 
      this.http.get<any>(`${this.baseUrl}${API_ENDPOINTS.WAREHOUSE.GET_ZONE.replace('{id}', id)}`)
    );
  }

  public getServiceStatuses(): Observable<any[]> {
    return this.request(() => 
      this.http.get<any[]>(`${this.baseUrl}/services/status`)
    );
  }

  public getRoutePlanningData(): Observable<any> {
    return this.request(() => 
      this.http.get<any>(`${this.baseUrl}/route-planning/data`)
    );
  }

  public getSchedulingData(): Observable<any> {
    return this.request(() => 
      this.http.get<any>(`${this.baseUrl}/scheduling/data`)
    );
  }
} 