import { Pipe, PipeTransform } from '@angular/core';

declare const _: any;

@Pipe({
  name: 'filterOutByArrayAndPropertyPipe'
})
export class FilterOutByArrayAndPropertyPipe implements PipeTransform {
  transform(collection, arrayToExclude, property): any {
    return collection.filter(item => !arrayToExclude.includes(item[property]));
  }
}

@Pipe({
  name: 'mapByPropertyPipe'
})
export class MapByPropertyPipe implements PipeTransform {
  transform(collection, property): any {
    return collection.map(item => {
      return item && item[property] ? item[property] : '--';
    });
  }
}
