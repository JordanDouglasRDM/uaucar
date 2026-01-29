<template>
  <DataTable
    :value="tableData"
    paginator
    paginatorPosition="bottom"
    :rows="rows"
    :rowsPerPageOptions="[25, 50, 100]"
    :totalRecords="totalRecords"
    removableSort
    stripedRows
    showGridlines
    size="small"
    scrollable
    scrollHeight="flex"
    :lazy="true"
    @refresh="refresh"
    @page="handlePageEvent"
    @sort="onSort"
    paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
    currentPageReportTemplate="Exibindo {first} a {last} de {totalRecords} registros"
  >
    <template #paginatorend>
      <Button type="button" severity="info" icon="pi pi-refresh" text @click="refresh" />
    </template>
    <Column
      v-for="col in columns"
      :key="col.field"
      :field="col.field"
      :header="col.header"
      :sortable="col.sortable"
    >
      <template #body="{ data: item }">
        <Skeleton v-if="loading"></Skeleton>
        <slot v-else :name="`cell-${col.field}`" :item="item">
          {{ mask(item[col.field], col?.mask ?? '') }}
        </slot>
      </template>
    </Column>

    <template #empty>
      <span v-if="!loading">Nenhum registro encontrado.</span>
    </template>
  </DataTable>
</template>

<script>
import { mask } from '@/utils/mask.js'

export default {
  name: 'BaseTable',
  components: {},
  props: {
    columns: { type: Array, required: true },
    data: { type: Array, default: () => [] },
    loading: { type: Boolean, default: false },
    rows: { type: Number, required: true },
    totalRecords: { type: Number, required: true },
  },
  computed: {
    tableData() {
      if (this.loading) {
        return Array.from({ length: 10 }, () => ({}))
      }
      return this.data
    },
  },
  emits: ['refresh-change', 'page-change', 'sort-change'],
  methods: {
    mask,
    refresh() {
      this.$emit('refresh-change')
    },
    handlePageEvent(event) {
      this.$emit('page-change', event)
    },
    onSort(event) {
      this.$emit('sort-change', event)
    },
  },
}
</script>
<style scoped>
:deep(.p-paginator-content) {
  width: 100%;
}

:deep(.p-paginator-content .p-paginator-current) {
  margin: auto;
}

:deep(.p-paginator-content .p-select) {
  margin: auto;
}

:deep(.p-datatable-flex-scrollable) {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

:deep(.p-datatable-flex-scrollable > .p-datatable-table-container) {
  flex-grow: 1;
  overflow: auto;
  height: unset;
}

:deep(.p-datatable-table) {
  height: 100%;
}

:deep(.p-datatable-tbody > tr > td) {
  vertical-align: middle;
}

:deep(.p-paginator) {
  flex-wrap: unset;
}
</style>
