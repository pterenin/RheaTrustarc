import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  TaBadgeModule,
  TaDropdownModule,
  TaActiveModal
} from '@trustarc/ui-toolkit';
import { TagsSelectorComponent } from 'src/app/shared/components/tags-selector/tags-selector.component';
import { TagsComponent } from './tags.component';
import { DropdownFieldModule } from 'src/app/shared/components/dropdown/dropdown-field.module';

describe('TagsComponent', () => {
  let component: TagsComponent;
  let fixture: ComponentFixture<TagsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TagsComponent, TagsSelectorComponent],
      imports: [
        TaBadgeModule,
        ReactiveFormsModule,
        FormsModule,
        DropdownFieldModule,
        TaDropdownModule,
        HttpClientTestingModule
      ],
      providers: [TaActiveModal],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TagsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
