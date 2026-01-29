import { currencyToNumber } from "@/Composables/formatters";
import useSwalAlert from "@/Composables/useSwalAlert.js"

export default {
    data() {
        return {
            modalMode: null,
            showSaveModal: false,
            itemToEdit: null,
            items: [],
        }
    },
    async mounted() {
        this.toast = useSwalAlert({}, 1500)
    },
    methods: {
        handleNewItem() {
            this.itemToEdit = null;
            this.modalMode = 'create';
            this.showSaveModal = true;
        },
        handleUpdateItem(item) {
            this.itemToEdit = item;
            this.modalMode = 'edit';
            this.showSaveModal = true;
        },
        onModalClose() {
            this.showSaveModal = false;
            this.itemToEdit = null;
        },
        onItemSaved() {
            this.onModalClose();
            this.fetchData();
        },
        async handleUpdateStatus(item, newStatus) {
            try {
                const payload = { ...item, status: newStatus };
                let updateFunction = this.service.update;

                if (this.statusUpdateMethod && typeof this.service[this.statusUpdateMethod] === 'function') {
                    updateFunction = this.service[this.statusUpdateMethod];
                    payload.cost_price = currencyToNumber(payload.cost_price);
                    payload.sale_price = currencyToNumber(payload.sale_price);

                }
                const response = await updateFunction.bind(this.service)(this.toRoute, item.id, payload);
                item.status = newStatus
                this.toast.fire({
                    icon: 'success',
                    title: response.message || response.data.message
                });
            } catch (errors) {
                // if (errors.response.status === 422) {
                //     const inputsIds = errors.response.data.errors;
                //     await useFormatInputError(inputsIds)
                // }

                this.errors = errors.response.data.message;
                this.toast.fire({
                    icon: 'error',
                    title: this.errors
                });
            }
        },
        handleActivateItem(item) {
            this.handleUpdateStatus(item, 'active');
        },
        handleDeactivateItem(item) {
            this.handleUpdateStatus(item, 'inactive');
        },
        getMenuItems(item) {
            if (typeof this.getBaseActions !== 'function') {
                console.error("O componente precisa definir um método getBaseActions(item).");
                return [];
            }
            const actions = this.getBaseActions(item);

            actions.push({
                label: 'Alterar', icon: 'pi pi-pencil', command: () => this.handleUpdateItem(item),
            });
            if (item.status === 'active') {

                actions.push({
                    label: 'Inativar', icon: 'pi pi-ban', command: () => this.handleDeactivateItem(item)
                });
            } else if (item.status === 'inactive') {
                actions.push({
                    label: 'Ativar', icon: 'pi pi-check-circle', command: () => this.handleActivateItem(item)
                });
            }
            return actions;
        },
        toggleMenu(event, item) {
            this[this.itemModelName] = item;
            this.items = this.getMenuItems(item);
            this.$refs.menu.toggle(event);
        }
    },
}
