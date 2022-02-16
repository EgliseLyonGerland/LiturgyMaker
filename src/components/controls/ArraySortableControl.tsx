import React from 'react';

import { DndContext } from '@dnd-kit/core';
import { useSortable, SortableContext } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import DeleteIcon from '@mui/icons-material/Delete';
import DragHandleIcon from '@mui/icons-material/DragHandle';
import { useTheme, Box } from '@mui/material';
import Button from '@mui/material/Button';
import { useFieldArray } from 'react-hook-form';

interface Props<T = any> {
  name: string;
  maxItems?: number;
  disabled: boolean;
  defaultItem: T;
  gutters?: number;
  renderItem: (item: T, index: number) => JSX.Element;
}

function SortableItem({
  id,
  index,
  gutters,
  children,
  onRemoveClicked,
}: {
  id: string;
  index: number;
  gutters: number;
  children: JSX.Element;
  onRemoveClicked: () => void;
}) {
  const theme = useTheme();
  const { listeners, setNodeRef, transform, transition } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <Box
      ref={setNodeRef}
      style={style}
      sx={{
        position: 'relative',
        marginTop: index === 0 ? 0 : theme.spacing(gutters),
      }}
    >
      <Box
        component={DragHandleIcon}
        color="disabled"
        sx={{
          position: 'absolute',
          top: theme.spacing(2),
          right: '100%',
          marginRight: theme.spacing(2),
        }}
        {...listeners}
      />

      {children}

      <DeleteIcon
        color="disabled"
        onClick={onRemoveClicked}
        sx={{
          position: 'absolute',
          top: theme.spacing(2),
          left: '100%',
          marginLeft: theme.spacing(2),
        }}
      />
    </Box>
  );
}

function ArraySortableControl<T = any>({
  name,
  maxItems = Infinity,
  disabled,
  gutters = 0,
  defaultItem,
  renderItem,
}: Props<T>) {
  const theme = useTheme();
  const { fields, append, remove, move } = useFieldArray({ name });

  return (
    <div>
      <div>
        <DndContext
          onDragEnd={({ active, over }) => {
            if (over) {
              move(
                fields.findIndex((field) => field.id === active.id),
                fields.findIndex((field) => field.id === over.id),
              );
            }
          }}
        >
          <SortableContext items={fields.map((field) => field.id)}>
            {fields.map(({ id, ...item }, index) => (
              <SortableItem
                key={id}
                id={id}
                index={index}
                gutters={gutters}
                onRemoveClicked={() => {
                  if (!disabled) {
                    remove(index);
                  }
                }}
              >
                {renderItem(item as T, index)}
              </SortableItem>
            ))}
          </SortableContext>
        </DndContext>
      </div>

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
