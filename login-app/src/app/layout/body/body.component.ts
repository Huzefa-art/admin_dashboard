import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-bodyofNew',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './body.component.html',
  styleUrl: './body.component.css'
})
export class BodyComponent {
  // @Input() collapsed = false;
  // @Input() screenwidth = 0;


  // getBodyClass(): string {

  //   let styleclass ='';
  //   if(this.collapsed && this.screenwidth > 768)[
  //     styleclass = 'bodyofNew-skimmed'
  //   ]
  //   else if(this.collapsed && this.screenwidth > 768 && this.screenwidth > 0){
  //     styleclass = 'bodyofNew-md-sreen'
  //   }
  //     return styleclass;
  // }
}
