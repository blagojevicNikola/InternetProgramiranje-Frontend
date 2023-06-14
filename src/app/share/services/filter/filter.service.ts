import { HttpParams } from '@angular/common/http';
import { ThisReceiver } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { Params } from '@angular/router';
import { CategoryState } from 'src/app/articles-overeview/models/category-state';

@Injectable({
  providedIn: 'root'
})
export class FilterService {

  search: string = ''
  category: string | undefined = undefined;
  priceFromState: CategoryState = { viewName: 'Price[min]', queryName: 'priceFrom', multivalue: false, content: [], value: undefined }
  priceToState: CategoryState = { viewName: 'Price[max]', queryName: 'priceTo', multivalue: false, content: [], value: undefined }
  articleState: string = "all";
  sortState: { sort: string, direction: string } = { sort: "date", direction: "desc" };
  private pageNo: number = 0;
  attrState: CategoryState[] = []
  constructor() { }


  public setParam(params: Params) {
    if (params['q'] != null && params['q'] !== '') {
      this.search = params['q'];
    }
    if (params['s'] != null) {
      this.articleState = params['s'];
    }
    if (params['pageNo'] != null) {
      this.pageNo = +params['pageNo'];
    }
    if (params['priceFrom'] != null) {
      this.priceFromState.value = params['priceFrom']
    }
    if (params['priceTo'] != null) {
      this.priceToState.value = params['priceTo'];
    }
    if (params['sort'] != null) {
      let data = params['sort'].split(',')
      this.sortState.sort = data[0];
      this.sortState.direction = data[1];
    }
    Object.keys(params).forEach((key) => {
      let tmp = this.attrState.find(a => a.queryName === key)
      if (params[key] != null && tmp !== undefined) {
        tmp.value = params[key];
      }
    })
  }

  public setCategory(cat: string) {
    this.category = cat;
  }

  public setState(options: CategoryState[]) {
    this.attrState = options;
    for (var i = 0; i < this.attrState.length; i++) {
      this.attrState[i].queryName = this.attrState[i].viewName;
    }
  }

  public getPageNo(): number {
    return this.pageNo;
  }

  public setPageNo(num: number) {
    this.pageNo = num;
  }

  public getSelectedFilters(): { name: string, value: string }[] {
    let result: { name: string, value: string }[] = [];
    if (!(this.sortState.sort === 'date' && this.sortState.direction === 'desc')) {
      result.push({ name: 'Sort', value: this.sortState.sort + '(' + this.sortState.direction + ')' });
    }
    if (this.priceFromState.value !== undefined && this.priceFromState.value !== '') {
      result.push({ name: this.priceFromState.viewName, value: this.priceFromState.value })
    }
    if (this.priceToState.value !== undefined && this.priceToState.value !== '') {
      result.push({ name: this.priceToState.viewName, value: this.priceToState.value })
    }
    for (const key of this.attrState) {
      if (key.value != undefined) {
        result.push({ name: key.viewName, value: key.value })
      }
    }
    return result;
  }

  public restartSort() {
    this.sortState = { sort: "date", direction: "desc" };
  }

  public restartPriceStates() {
    this.priceFromState = { viewName: 'Price[min]', queryName: 'priceFrom', multivalue: false, content: [], value: undefined }
    this.priceToState = { viewName: 'Price[max]', queryName: 'priceTo', multivalue: false, content: [], value: undefined }
  }

  public restartState() {
    this.restartSort();
    this.restartPriceStates();
    this.attrState = [];
    this.pageNo = 0;
    this.category = undefined;
    this.articleState = 'all';
    this.search = '';
  }

  public restartSearch() {
    this.search = '';
  }

  public getUrlQuery(): { [key: string]: string } {
    let result: { [key: string]: string } = {}
    if (this.search !== '') {
      result['q'] = this.search;
    }
    if (this.articleState !== 'all') {
      result['s'] = this.articleState;
    }
    if (!(this.sortState.sort === 'date' && this.sortState.direction === 'desc')) {
      result['sort'] = this.sortState.sort + ',' + this.sortState.direction;
    }
    if (this.priceFromState.value !== undefined && this.priceFromState.value !== '') {
      result[this.priceFromState.queryName] = this.priceFromState.value;
    }
    if (this.priceToState.value !== undefined && this.priceToState.value !== '') {
      result[this.priceToState.queryName] = this.priceToState.value;
    }
    if (this.pageNo !== 0) {
      result['pageNo'] = this.pageNo.toString()
    }
    if (this.category != null) {
      result['category'] = this.category;
    }
    for (const key of this.attrState) {
      if (key.value !== undefined) {
        result[key.queryName] = key.value
      }
    }
    return result;
  }

  public getHttpParam(): HttpParams {
    let result = new HttpParams();
    if (this.search !== '') {
      result = result.append('q', this.search);
    }
    if (this.articleState !== 'all') {
      result = result.append('s', this.articleState);
    }
    if (!(this.sortState.sort === 'date' && this.sortState.direction === 'desc')) {
      result = result.append('sort', this.sortState.sort + ',' + this.sortState.direction);
    }
    if (this.priceFromState.value !== undefined && this.priceFromState.value !== '') {
      result = result.append(this.priceFromState.queryName, this.priceFromState.value);
    }
    if (this.priceToState.value !== undefined && this.priceToState.value !== '') {
      result = result.append(this.priceToState.queryName, this.priceToState.value);
    }
    if (this.pageNo !== 0) {
      result = result.append('pageNo', this.pageNo.toString());
    }
    if (this.category != null) {
      result = result.append('category', this.category);
    }
    for (const key of this.attrState) {
      if (key.value !== undefined) {
        result = result.append(key.queryName, key.value);
      }
    }
    return result;
  }
}
