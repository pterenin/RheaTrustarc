export interface FilterNonLeafNode {
  operand?: 'OR' | 'AND';
  filters?: Array<FilterLeafNode | FilterNonLeafNode>;
}

export interface FilterLeafNode {
  fieldName: string;
  values: string[];
}
