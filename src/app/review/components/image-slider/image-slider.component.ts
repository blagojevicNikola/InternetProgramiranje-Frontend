import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-image-slider',
  templateUrl: './image-slider.component.html',
  styleUrls: ['./image-slider.component.css']
})
export class ImageSliderComponent {

  @Input() images:string[] = ["assets/laptop.jpg", "assets/laptop.jpg","assets/laptop.jpg","assets/laptop.jpg"]
  @Input() indicators = true;
  currentIndex:number = 0;

  getCurrentUrl():string{
    return this.images[this.currentIndex];
  }

}
