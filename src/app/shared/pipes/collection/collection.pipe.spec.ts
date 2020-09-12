import {
  FilterOutByArrayAndPropertyPipe,
  MapByPropertyPipe
} from './collection.pipe';

describe('Collection pipes', () => {
  describe('FilterOutByArrayAndPropertyPipe', () => {
    it('Create an instance', () => {
      const pipe = new FilterOutByArrayAndPropertyPipe();
      expect(pipe).toBeTruthy();
    });
  });
  describe('MapByPropertyPipe', () => {
    it('Create an instance', () => {
      const pipe = new MapByPropertyPipe();
      expect(pipe).toBeTruthy();
    });
  });
});
