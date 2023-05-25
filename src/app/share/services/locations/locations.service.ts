import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Location } from '../../models/location';

@Injectable({
  providedIn: 'root'
})
export class LocationsService {

  constructor(private http:HttpClient) { }

  getLocations(){
    return this.http.get<Location[]>('/locations');
  }

}
