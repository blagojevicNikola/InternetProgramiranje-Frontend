import { Component, OnDestroy, OnInit } from '@angular/core';
import { SidebarService } from '../share/services/sidebar/sidebar.service';

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.css']
})
export class ReviewComponent implements OnInit, OnDestroy {

  constructor(private sidebarService: SidebarService){}

  ngOnDestroy(): void {
    this.sidebarService.enable();
  }
  ngOnInit(): void {
    this.sidebarService.disable();
  }

}
