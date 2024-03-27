import { DndContext } from "@dnd-kit/core";
import { useSortable, SortableContext } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import DeleteIcon from "@mui/icons-material/Delete";
import DragHandleIcon from "@mui/icons-material/DragHandle";
import { useTheme, Box } from "@mui/material";
import Button from "@mui/material/Button";
import { useFieldArray } from "react-hook-form";

interface Props<T = unknown> {
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
        position: "relative",
        marginTop: index === 0 ? 0 : theme.spacing(gutters),
      }}
    >
      <Box
        color="disabled"
        component={DragHandleIcon}
        sx={{
          position: "absolute",
          top: theme.spacing(2),
          right: "100%",
          marginRight: theme.spacing(2),
        }}
        {...listeners}
      />

      {children}

      <DeleteIcon
        color="disabled"
        onClick={onRemoveClicked}
        sx={{
          position: "absolute",
          top: theme.spacing(2),
          left: "100%",
          marginLeft: theme.spacing(2),
        }}
      />
    </Box>
  );
}

function ArraySortableControl<T = unknown>({
  name,
  maxItems = Infinity,
  disabled,
  gutters = 0,
  defaultItem,
  renderItem,
}: Props<T>) {
  const theme = useTheme();
  const { fields, append, remove, move } = useFieldArray({
    name,
    keyName: "key",
  });

  return (
    <div>
      <div>
        <DndContext
          onDragEnd={({ active, over }) => {
            if (over) {
              move(
                fields.findIndex((field) => field.key === active.id),
                fields.findIndex((field) => field.key === over.id),
              );
            }
          }}
        >
          <SortableContext items={fields.map((field) => field.key)}>
            {fields.map(({ key, ...item }, index) => (
              <SortableItem
                gutters={gutters}
                id={key}
                index={index}
                key={key}
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
        color="primary"
        disabled={disabled || maxItems === fields.length}
        onClick={() => {
          append(defaultItem);
        }}
        size="small"
        sx={{ marginTop: theme.spacing(2) }}
        variant="contained"
      >
        Ajouter
      </Button>
    </div>
  );
}

export default ArraySortableControl;
