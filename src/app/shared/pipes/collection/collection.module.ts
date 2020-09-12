import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FilterOutByArrayAndPropertyPipe,
  MapByPropertyPipe
} from './collection.pipe';

@NgModule({
  declarations: [FilterOutByArrayAndPropertyPipe, MapByPropertyPipe],
  imports: [CommonModule],
  exports: [FilterOutByArrayAndPropertyPipe, MapByPropertyPipe]
})
export class CollectionPipeModule {}
