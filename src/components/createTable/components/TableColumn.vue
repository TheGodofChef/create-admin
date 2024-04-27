<template>
  <RenderTableColumn v-bind="column" />
</template>

<script lang="tsx" setup>
import type { TableColumnCtx } from "element-plus/es/components/table/src/table-column/defaults";
export interface ColumnProps<T = any> extends Partial<Omit<TableColumnCtx<T>, "children" | "renderHeader" | "renderCell">> {
	isShow?: boolean;
	render?: (scope: { row: T }) => any;
	_children?: ColumnProps<T>[];
}


defineProps<{ column: ColumnProps }>();

const slots = useSlots();

const RenderTableColumn = (item: ColumnProps) => {
	return (
		<>
			{
				item.isShow && <el-table-column
					{...item}
					align={item.align ?? "center"}
					showOverflowTooltip={item.showOverflowTooltip ?? item.prop !== "operation"}
				>
					{{
						default: (scope: any) => {
							if (item._children) return item._children.map(child => RenderTableColumn(child));
							if (item.render) {
                return item.render(scope)
              };
							if (slots[item.prop!]) return slots[item.prop!]!(scope);
						}
					}}
				</el-table-column>
			}

		</>
	);
};
</script>
