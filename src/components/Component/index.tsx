import React, { useContext } from 'react';
import styled from 'styled-components';
import { BuilderFieldOperator, BuilderContext } from '../Builder';
import { FieldSelect } from '../Widgets/FieldSelect';
import { Boolean } from '../Widgets/Boolean';
import { Select } from '../Widgets/Select';
import { SelectMulti } from '../Widgets/SelectMulti';
import { OperatorSelect } from '../Widgets/OperatorSelect';
import { Input } from '../Widgets/Input';
import {
  isBoolean,
  isReactText,
  isReactTextArray,
  isOptionList,
} from '../../utils/types';
import { clone } from '../../utils/clone';

const BooleanContainer = styled.div`
  align-self: center;
`;

export interface ComponentProps {
  field: string;
  value?: React.ReactText | React.ReactText[] | boolean;
  operator?: BuilderFieldOperator;
  id: string;
}

export const Component: React.FC<ComponentProps> = ({
  field: fieldRef,
  value: selectedValue,
  operator,
  id,
}) => {
  const { fields, data, setData, onChange, components } = useContext(
    BuilderContext
  );
  const { Component: ComponentContainer, Remove } = components;

  const handleDelete = () => {
    let clonedData = clone(data);
    const index = clonedData.findIndex((item: any) => item.id === id);
    const parentIndex = clonedData.findIndex(
      (item: any) => item.id === clonedData[index].parent
    );
    const parent = clonedData[parentIndex];

    parent.children = parent.children.filter((item: string) => item !== id);
    clonedData = clonedData.filter((item: any) => item.id !== id);

    setData(clonedData);
    onChange(clonedData);
  };

  if (fields) {
    if (fieldRef === '') {
      return (
        <ComponentContainer
          controls={<Remove label="Delete" onClick={handleDelete} />}
        >
          <FieldSelect selectedValue={''} id={id} />
        </ComponentContainer>
      );
    } else {
      try {
        const fieldIndex = fields.findIndex(item => item.field === fieldRef);
        const { field, operators, type, value: fieldValue } = fields[
          fieldIndex
        ];

        const operatorsOptionList =
          operators && operators.map(item => ({ value: item, label: item }));

        return (
          <ComponentContainer controls={<Remove label="Delete" onClick={handleDelete} />}>
            <FieldSelect selectedValue={field} id={id} />

            {type === 'BOOLEAN' && isBoolean(selectedValue) && (
              <BooleanContainer>
                <Boolean id={id} selectedValue={selectedValue} />
              </BooleanContainer>
            )}

            {type === 'LIST' &&
              isReactText(selectedValue) &&
              isOptionList(fieldValue) &&
              isOptionList(operatorsOptionList) && (
                <>
                  <OperatorSelect
                    id={id}
                    values={operatorsOptionList}
                    selectedValue={operator}
                  />
                  <Select
                    id={id}
                    selectedValue={selectedValue}
                    values={fieldValue}
                  />
                </>
              )}

            {type === 'MULTI_LIST' &&
              isOptionList(fieldValue) &&
              isOptionList(operatorsOptionList) &&
              isReactTextArray(selectedValue) && (
                <>
                  <OperatorSelect
                    id={id}
                    values={operatorsOptionList}
                    selectedValue={operator}
                  />
                  <SelectMulti
                    id={id}
                    values={fieldValue}
                    selectedValue={selectedValue}
                  />
                </>
              )}

            {type === 'TEXT' &&
              isOptionList(operatorsOptionList) &&
              (isReactText(selectedValue) ||
                isReactTextArray(selectedValue)) && (
                <>
                  <OperatorSelect
                    id={id}
                    values={operatorsOptionList}
                    selectedValue={operator}
                  />
                  <Input type="text" value={selectedValue} id={id} />
                </>
              )}

            {type === 'NUMBER' &&
              isOptionList(operatorsOptionList) &&
              (isReactText(selectedValue) ||
                isReactTextArray(selectedValue)) && (
                <>
                  <OperatorSelect
                    id={id}
                    values={operatorsOptionList}
                    selectedValue={operator}
                  />
                  <Input type="number" value={selectedValue} id={id} />
                </>
              )}

            {type === 'DATE' &&
              isOptionList(operatorsOptionList) &&
              (isReactText(selectedValue) ||
                isReactTextArray(selectedValue)) && (
                <>
                  <OperatorSelect
                    id={id}
                    values={operatorsOptionList}
                    selectedValue={operator}
                  />
                  <Input type="date" value={selectedValue} id={id} />
                </>
              )}
          </ComponentContainer>
        );
      } catch (e) {
        console.error(`Field "${fieldRef}" not found in fields definition.`);
      }
    }
  }

  return null;
};
