import { Component, Input } from '@angular/core';
import { Photo } from '../../models/photo';

@Component({
  selector: 'app-image-slider',
  templateUrl: './image-slider.component.html',
  styleUrls: ['./image-slider.component.css']
})
export class ImageSliderComponent {

  @Input() images:Photo[] = []
  @Input() indicators = true;
  currentIndex:number = 0;

  selectImage(index:number) : void{
    this.currentIndex=index;
  }

  nextImage():void{
    if(this.currentIndex<this.images.length-1)
    {
      this.currentIndex+=1;
    }
  }

  prevImage():void{
    if(this.currentIndex>0)
    {
      this.currentIndex-=1;
    }
  }

}
