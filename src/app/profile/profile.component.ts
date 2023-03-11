import { Component, OnDestroy, OnInit } from '@angular/core';
import { SidebarService } from '../share/services/sidebar/sidebar.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit, OnDestroy{

  constructor(private sidebarService:SidebarService){
    this.sidebarService.disable();
  }

  ngOnInit(): void {
  }
  
  ngOnDestroy(): void {
    this.sidebarService.enable()
  }

}
