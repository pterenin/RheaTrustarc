import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  QueryList,
  ViewChildren
} from '@angular/core';
import { TaDropdown, TaPopover } from '@trustarc/ui-toolkit';
import { Subscription } from 'rxjs';
import { InlineTagEditorService } from './inline-tag-editor.service';

declare const _: any;

@Component({
  selector: 'ta-inline-tag-editor',
  templateUrl: './inline-tag-editor.component.html',
  styleUrls: ['./inline-tag-editor.component.scss']
})
export class InlineTagEditorComponent implements OnInit, OnChanges {
  @ViewChildren(TaPopover) popover: QueryList<TaPopover>;
  @ViewChildren(TaDropdown) dropdown: QueryList<TaPopover>;

  @Output() activePopover: EventEmitter<any>;
  @Output() editModeChanges: EventEmitter<any>;
  @Output() selectionChanges: EventEmitter<any>;
  @Input() bpItem: {};
  @Input() bpId = '';
  @Input() flatTags = [];
  @Input() treeTags = [];
  @Input() userTags = [];

  public searchTerm: string;
  public editMode = false;
  public initialSelectionSet = false;
  public currentStateTree = null;
  public columnText = '';
  public truncated = false;

  private _getSearchedUsersSubscription$: Subscription;
  private cachedOpenPopovers = [];
  private selectedTagGroup: any = {};

  constructor(private inlineTagEditorService: InlineTagEditorService) {
    this.activePopover = new EventEmitter();
    this.editModeChanges = new EventEmitter();
    this.selectionChanges = new EventEmitter();
  }
  public onSearch(search) {
    this.searchTerm = search;
  }

  public onTextUpdate(event, tag, isNew = false) {
    tag.tag = event.target.value;
    tag.name = event.target.value;
    if (isNew) {
      tag.id = tag.name;
      tag.children = [];
    }
    tag.selected = true;
    this.selectedTagGroup.values = [tag];
  }

  public isTextInputUpdate(tagGroup) {
    return this.flatTags.some(tag => tagGroup.id === tag.tagGroupId);
  }
  public cleanUp() {
    this.searchTerm = '';
    this.editMode = false;
    this.cachedOpenPopovers = [];
    this.selectedTagGroup = {};
  }

  ngOnInit() {
    this.columnText = this.getColumnText();
  }

  ngOnChanges() {
    if (this.currentStateTree) {
      return;
    }
    this.currentStateTree = _.cloneDeep(this.treeTags);
    this.setInitialSelection();
    this.columnText = this.getColumnText();
  }

  public navigateBack() {
    this.selectedTagGroup = this.selectedTagGroup.parent;
  }

  private recursiveSelection = tagArray => {
    tagArray.forEach(tag => {
      const tagExists = this.flatTags.some(ftag => {
        if (tag.isUserTag) {
          return ftag.id === tag.id || ftag.name === tag.tag.trim();
        }
        return ftag.id === tag.id;
      });
      if (tagExists) {
        tag.selected = true;
      }
      if (tag.children && tag.children.length) {
        this.recursiveSelection(tag.children);
      }
      if (tag.values && tag.values.length) {
        this.recursiveSelection(tag.values);
      }
    });
  };

  public setInitialSelection() {
    this.flatTags = _.sortBy(this.flatTags, ['name']);
    this.recursiveSelection(this.currentStateTree);
    this.initialSelectionSet = true;
  }

  public toggleEditMode(bool) {
    this.inlineTagEditorService.triggerUnsetEditMode();
    this.editMode = bool;

    const unsetEditMode = () => this.cleanUp();
    this.inlineTagEditorService.editModeChanges({
      editMode: this.editMode,
      unset: unsetEditMode.bind(this)
    });

    const openDropdown = () => {
      if (this.editMode && this.dropdown.first) {
        this.dropdown.first.open();
      }
    };
    _.delay(openDropdown.bind(this), 100);
  }

  public triggerPopover(popover) {
    this.cachedOpenPopovers.push(popover);
    this.inlineTagEditorService.triggerPopover(popover);
    popover.open();
  }

  public closePopovers() {
    if (this.cachedOpenPopovers.length) {
      this.cachedOpenPopovers.forEach(pop => {
        if (pop) {
          pop.close();
        }
      });
      this.cleanUp();
    }
  }

  public prevent(event) {
    if (this.dropdown.first) {
      event.stopPropagation();
      event.preventDefault();
    }
  }

  public onCancel() {
    const unsetEditMode = () => this.cleanUp();
    this.editMode = false;
    this.inlineTagEditorService.editModeChanges({
      editMode: this.editMode,
      unset: unsetEditMode.bind(this)
    });
    this.backToPreviousState();
  }

  private backToPreviousState() {
    this.currentStateTree = _.cloneDeep(this.treeTags);
    this.setInitialSelection();
  }

  private getSelectedTags(tag, selecgtedTags) {
    if (tag.selected) {
      selecgtedTags.push(tag);
    }
    if (tag.children) {
      tag.children.forEach(child => this.getSelectedTags(child, selecgtedTags));
    }
  }

  public onSave() {
    // The overview API expects all selected tags to be sent flat, so selected in this case is an array of all tags selected.
    // we copy the selected to the values property the last minute before saving and then render data again so values is set right.
    const tagsToSave = _.cloneDeep(this.currentStateTree);
    const tagsToRemove = _.cloneDeep(
      this.currentStateTree.filter(tg => tg.remove)
    );
    const remove = [];

    tagsToSave.forEach(parentTag => {
      if (parentTag.remove) {
        remove.push(parentTag);
      }
      const selectedTags = [];
      parentTag.values.forEach(tag => {
        this.getSelectedTags(tag, selectedTags);
      });
      parentTag.values = selectedTags;
    });

    const selectedTagGroups = tagsToSave.filter(
      category => category.values.length || category.updated
    );

    // the final payload object is sent to the record grid handler, which will use the overview API to push changes
    this.selectionChanges.emit({
      bpItem: this.bpItem,
      selectedTagGroups: selectedTagGroups,
      remove: tagsToRemove
    });
  }

  public selectChildren(event, tagGroup) {
    event.preventDefault();
    event.stopPropagation();
    if (tagGroup.tagGroupType === 'USER') {
      const selectedMap = {};
      tagGroup.values.forEach(userTag => {
        if (userTag.selected) {
          selectedMap[userTag.tag] = userTag.id;
        }
      });
      this.userTags.forEach(userTag => {
        if (selectedMap[userTag.tag]) {
          userTag.id = selectedMap[userTag.tag];
        }
      });
      tagGroup.values = this.userTags;
      this.recursiveSelection(tagGroup.values);
    }

    tagGroup.parent = this.selectedTagGroup;
    if (this.selectedTagGroup.multipleValuesAllowed) {
      tagGroup.multipleValuesAllowed = this.selectedTagGroup.multipleValuesAllowed;
    }
    this.selectedTagGroup = tagGroup;
  }

  public onSelect(tag, tagGroup) {
    tagGroup.updated = true;
    if (tag.selected) {
      tag.selected = false;
    } else {
      tag.selected = true;
    }
  }

  public secondLevelClick(event, tag, tagGroup) {
    tagGroup.updated = true;
    event.preventDefault();
    event.stopPropagation();
    tag.updated = true;
    if (tag.hasOwnProperty('selected')) {
      tag.selected = !tag.selected;
    } else {
      tag.selected = true;
    }

    this.toggleSelection(tag, this.selectedTagGroup);
  }

  private toggleSelection(tag, tagGroup) {
    const recursiveSelection = tagsArray => {
      tagsArray.forEach(ta => {
        if (
          tagGroup.tagGroupType === 'SELECTABLE' &&
          !tagGroup.multipleValuesAllowed
        ) {
          ta.selected = false;
        }
        if (ta.id === tag.id) {
          ta.selected = tag.selected;
        }

        if (!ta.selected && ta.values && ta.values.length) {
          recursiveSelection(ta.values);
        } else if (!ta.selected && ta.children && ta.children.length) {
          recursiveSelection(ta.children);
        }
      });
    };
    recursiveSelection(this.currentStateTree);

    if (
      (tagGroup.tagGroupType === 'SELECTABLE' &&
        !tagGroup.multipleValuesAllowed) ||
      tagGroup.tagGroupType === 'USER'
    ) {
      const recursiveReset = tagsArray => {
        tagsArray.forEach(t => {
          if (tag.id !== t.id) {
            t.selected = false;
          }
          if (t.children.length) {
            recursiveReset(t.children);
          }
        });
      };

      recursiveReset(this.selectedTagGroup.values);
    }
  }

  isAllChildrenSelected(tagGroup) {
    return (tagGroup.values || tagGroup.children).every(
      value => value.selected
    );
  }

  isIndeterminate(tagGroup) {
    return (
      !this.isAllChildrenSelected(tagGroup) &&
      (tagGroup.values || tagGroup.children).some(value => value.selected)
    );
  }

  selectAllChildren($event, tagGroup) {
    $event.stopPropagation();
    $event.preventDefault();
    const everyChildrenSelected = (tagGroup.values || tagGroup.children).every(
      value => value.selected
    );

    (tagGroup.values || tagGroup.children).forEach(value => {
      value.selected = !everyChildrenSelected;
    });

    const allUnselected = (tagGroup.values || tagGroup.children).every(
      value => value.selected === false
    );

    allUnselected ? (tagGroup.remove = true) : (tagGroup.remove = false);
  }

  getSelectAllCount(tagGroup) {
    let count = 0;
    let selected = 0;

    (tagGroup.values || tagGroup.children).forEach(tag => {
      count++;
      if (tag.selected) {
        selected++;
      }
    });

    return [selected.toString(), count.toString()];
  }

  getSelectUsersCount() {
    return this.userTags.filter(userTag => userTag.selected).length;
  }

  public truncate(string, overflow: string[], maxLength) {
    const more = overflow.length ? `, +${overflow.length} more` : '';
    const moreTrunc = string.slice(0, maxLength);
    const normalTrunc = string.slice(0, maxLength + 5);
    const trunc = overflow.length ? moreTrunc : normalTrunc;

    return `${trunc}...${more}`;
  }
  public getColumnText() {
    let string = '';
    const list = [];
    const overflow = [];
    const maxLength = 15;

    this.flatTags.forEach(tag => {
      if (list.join(',').length < maxLength) {
        list.push(tag.name);
      } else {
        overflow.push(tag.name);
      }
    });
    string = list.join(', ');

    if (string.length > maxLength || overflow.length) {
      string = this.truncate(string, overflow, maxLength);
      this.truncated = true;
    } else if (list.length > 1) {
      string = string.slice(0, string.length - 1);
      this.truncated = false;
    }
    return string;
  }
}
