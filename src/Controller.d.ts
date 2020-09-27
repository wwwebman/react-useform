import React from 'react';
import { Control, Rules } from './useForm';

export interface ControllerChildrenProps {
  name: string;
  onBlur(e: React.FocusEvent<HTMLInputElement>): void;
  onChange(e: React.ChangeEvent<HTMLInputElement>): void;
}

export interface ControllerProps {
  allowOnly?: 'numbers';
  children: (props: ControllerChildrenProps) => React.ReactElement;
  control: Control;
  name: string;
  rules: Rules;
}

export default function Controller(props: ControllerProps): React.ReactElement;
