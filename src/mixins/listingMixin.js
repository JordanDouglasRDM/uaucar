import useTranslateText from "@/composables/useTranslateText.js";
import useSwalAlert from "@/composables/useSwalAlert.js";
import { formatCpf, formatPhone, useFormatDate, useFormatName } from "@/composables/formatters.js";

export default {
    // O 'data' do mixin será mesclado com o 'data' do componente que o usar
    data() {
        return {
            // Estado reativo
            toast: useSwalAlert({}, 1500),
            data: [],
            loading: true,
            totalRecords: 0,
            currentPage: 1,

            // O componente que usar o mixin DEVE fornecer 'initialRowsPerPage' em seu 'data'
            rowsPerPage: this.initialRowsPerPage ?? 25,

            // O componente também deve fornecer 'initialSortBy' e 'initialSortOrder'
            sortBy: this.initialSortBy ?? 'created_at',
            sortOrder: this.initialSortOrder ?? 'desc',

            // O componente deve fornecer um objeto 'initialFilters'
            filters: { ...(this.initialFilters ?? {}) },

            // Estado não-reativo
            debounceTimer: null,
        };
    },

    // As funções do composable se tornam métodos do mixin
    methods: {
        useFormatName,
        useTranslateText,
        useFormatDate,
        formatCpf,
        formatPhone,
        async fetchData() {
            this.loading = true;
            const queryParams = {
                page: this.currentPage,
                per_page: this.rowsPerPage,
                order_by: this.sortBy,
                order_direction: this.sortOrder,
                filters: { ...this.filters },
            };

            try {
                // O mixin espera que o componente forneça um 'service'
                const paginatedResponse = await this.service.getAll(this.toRoute, queryParams);
                this.data = paginatedResponse.data;
                this.totalRecords = paginatedResponse.meta.total;
                if (this.totalRecords === 0) {
                    this.toast.fire({
                        icon: 'warning',
                        title: 'Nenhum registro encontrado.',
                    });
                }
            } catch (error) {
                console.error('Erro ao buscar dados:', error);
                this.toast.fire({
                    icon: 'error',
                    title: 'Não foi possível carregar a lista de registros.',
                    life: 3000,
                });
                this.data = [];
            } finally {
                this.loading = false;
            }
        },

        onPageChange(event) {
            this.currentPage = event.page + 1;
            this.rowsPerPage = event.rows;
            this.fetchData();
        },
        onRefreshChange() {
            this.tableKey += 1;
            if (this.$refs.value) {
                this.$refs.value.clear();
            }
            this.sortBy = 'created_at';
            this.sortOrder = 'desc';
            this.clearAllFilters();
            this.refreshData();
        },
        onSortChange(event) {
            if (event.sortField === null) {
                this.sortBy = this.initialSortBy ?? 'created_at';
                this.sortOrder = this.initialSortOrder ?? 'desc';
            } else {
                this.sortBy = event.sortField;
                this.sortOrder = event.sortOrder === 1 ? 'asc' : 'desc';
            }
            this.refreshData();
        },

        async handleSearch(val) {
            if (val === '') {
                return this.toast.fire({
                    icon: 'warning',
                    title: 'Insira algum valor para continuar.',
                });
            }

            this.clearAllFilters();
            this.filters.search = useTranslateText(val, 'en');
            await this.refreshData()
        },

        async clearFilterButton() {
            this.clearAllFilters();
            await this.refreshData();
        },

        clearAllFilters() {
            const filters = this.filters;
            Object.keys(filters).forEach(key => {
                filters[key] = null;
            });
        },

        async refreshData() {
            this.currentPage = 1;
            await this.fetchData();
        },
    },

    // O mixin pode ter seus próprios hooks de ciclo de vida
    mounted() {
        // Inicia a busca de dados quando o componente que usa o mixin é montado
        this.fetchData();
    }
};
