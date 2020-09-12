import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryTagsComponent } from './inventory-tags.component';
import { ReactiveFormsModule } from '@angular/forms';
import { TagsSelectorModule } from 'src/app/shared/components/tags-selector/tags-selector.module';
import { Subject } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DataInventoryService } from '../../data-inventory.service';
import { RouterTestingModule } from '@angular/router/testing';

describe('InventoryTagsComponent', () => {
  let component: InventoryTagsComponent;
  let fixture: ComponentFixture<InventoryTagsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [InventoryTagsComponent],
      imports: [
        ReactiveFormsModule,
        TagsSelectorModule,
        HttpClientTestingModule,
        RouterTestingModule
      ],
      providers: [DataInventoryService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryTagsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
