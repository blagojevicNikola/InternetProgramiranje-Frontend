import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AttributeStructure } from '../../models/attribute-structure';

@Injectable({
  providedIn: 'root'
})
export class AttributesService {

  constructor(private http:HttpClient) { }

  getAttributeStructuresByArticleTypeId(id: number)
  {
    return this.http.get<AttributeStructure[]>(`api/attribute/structure/${id}`)
  }
}
