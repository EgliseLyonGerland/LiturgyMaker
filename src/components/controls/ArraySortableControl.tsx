/* eslint-disable react/prop-types */
import React from 'react';

import DeleteIcon from '@mui/icons-material/Delete';
import DragHandleIcon from '@mui/icons-material/DragHandle';
import type { Theme } from '@mui/material';
import { Box, useTheme } from '@mui/material';
import Button from '@mui/material/Button';
import { useFieldArray, useFormContext } from 'react-hook-form';
import {
  SortableContainer as ReactSortableContainer,
  SortableElement as ReactSortableElement,
  SortableHandle as ReactSortableHandle,
} from 'react-sortable-hoc';

interface Props<T = any> {
  name: string;
  maxItems?: number;
  disabled: boolean;
  defaultItem: T;
  gutters?: number;
  renderItem: (item: T, index: number) => void;
}

const SortableContainer = ReactSortableContainer(
  ({ children }: { children: JSX.Element }) => <div>{children}</div>,
);

const DragHandle = ReactSortableHandle(({ theme }: { theme: Theme }) => (
  <Box
    component={DragHandleIcon}
    color="disabled"
    sx={{
      position: 'absolute',
      top: theme.spacing(2),
      right: '100%',
      marginRight: theme.spacing(2),
    }}
  />
));

const SortableItem = ReactSortableElement(
  ({
    children,
    style,
    theme,
  }: {
    children: JSX.Element;
    style: React.CSSProperties;
    theme: Theme;
  }) => (
    <Box style={style} sx={{ position: 'relative' }}>
      <DragHandle theme={theme} />
      {children}
    </Box>
  ),
);

function ArraySortableControl<T = any>({
  name,
  maxItems = Infinity,
  disabled,
  gutters = 0,
  defaultItem,
  renderItem,
}: Props<T>) {
  const theme = useTheme();
  const { control } = useFormContext();
  const { fields, append, remove, move } = useFieldArray({
    name,
    control,
    keyName: 'key',
  });

  return (
    <div>
      <SortableContainer
        onSortEnd={({ oldIndex, newIndex }) => {
          move(oldIndex, newIndex);
        }}
        useDragHandle
      >
        <div>
          {fields.map(({ key, ...item }, index) => (
            <SortableItem
              key={key}
              index={index}
              theme={theme}
              disabled={disabled}
              style={{
                marginBottom:
                  index === fields.length - 1 ? 0 : theme.spacing(gutters),
              }}
            >
              <>
                {renderItem(item as T, index)}

                <DeleteIcon
                  color="disabled"
                  onClick={() => {
                    if (!disabled) {
                      remove(index);
                    }
                  }}
                  sx={{
                    position: 'absolute',
                    top: theme.spacing(2),
                    left: '100%',
                    marginLeft: theme.spacing(2),
                  }}
                />
              </>
            </SortableItem>
          ))}
        </div>
      </SortableContainer>

      <Button
        variant="contained"
        color="primary"
        size="small"
        disabled={disabled || maxItems === fields.length}
        onClick={() => {
          append(defaultItem);
        }}
        sx={{ marginTop: theme.spacing(2) }}
      >
        Ajouter
      </Button>
    </div>
  );
}

export default ArraySortableControl;
