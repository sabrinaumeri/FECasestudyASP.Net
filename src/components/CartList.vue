<template>
  <div class="container">
    <div class="heading">Your Orders</div>
    <div class="status">{{ state.status }}</div>
    <div id="cart-list">
      <DataTable
        v-if="state.carts.length > 0"
        :value="state.carts"
        :scrollable="true"
        scrollHeight="60vh"
        dataKey="id"
        class="p-datatable-striped"
        v-model:selection="state.cartSelected"
        selectionMode="single"
        @row-select="onRowSelect"
      >
        <Column header="Cart #" field="id" />
        <Column header="Date">
          <template #body="slotProps">
            {{ formatDate(slotProps.data.dateCreated) }}
          </template>
        </Column>
        <Column header="Total Cal." field="totalCalories" />
      </DataTable>


        <DataTable
        :value="state.cart"
        :scrollable="true"
        scrollHeight="55vh"
        dataKey="id"
        class="p-datatable-striped"
        id="cart-contents"
      >
        <Column header="Name" field="item.productName" />
        <Column header="Qty" field="qty" />
        <Column header="Price" field="item.">
          <template #body="slotProps">
            {{ formatCurrency(slotProps.data.item.msrp) }}
          </template>
        </Column>
        <Column header="Extended" field="item.msrp">
          <template #body="slotProps">
            {{
              formatCurrency(slotProps.data.item.msrp * slotProps.data.qty)
            }}
          </template>
        </Column>
        <ColumnGroup type="footer">
          <Row>
            <Column footer=""></Column>
            <Column footer=""></Column>
            <Column footer="Sub:"></Column>
            <Column :footer="formatCurrency(state.subTot)"></Column>
          </Row>
          <Row>
            <Column footer=""></Column>
            <Column footer=""></Column>
            <Column footer="Tax:"></Column>
            <Column :footer="formatCurrency(state.taxTot)"></Column>
          </Row>
          <Row>
            <Column footer=""></Column>
            <Column footer=""></Column>
            <Column footer="Total:"></Column>
            <Column :footer="formatCurrency(state.total)"></Column>
          </Row>
        </ColumnGroup>
      </DataTable>








    </div>
  </div>
</template>
<script>
import { reactive, onMounted } from "vue";
import { fetcher } from "../util/apiutil";
export default {
  setup() {
    let state = reactive({
      status: "",
      dialogStatus: "",
      carts: [],
      selectedACart: false,
      cartSelected: {},
      cartDetails: [],
    });
    onMounted(() => {
      loadOrders();
    });
    const loadOrders = async () => {
      try {
        let customer = JSON.parse(sessionStorage.getItem("customer"));
        const payload = await fetcher(`cart/${customer.email}`);
        if (payload.error === undefined) {
          state.carts = payload;
          state.status = `loaded ${state.carts.length} carts`;
          state.selectedACart = false;
        } else {
          state.status = payload.error;
        }
      } catch (err) {
        console.log(err);
        state.status = `Error has occured: ${err.message}`;
      }
    };
    const formatDate = (date) => {
      let d;
      // see if date is coming from server
      date === undefined ? (d = new Date()) : (d = new Date(Date.parse(date))); // from server
      let _day = d.getDate();
      let _month = d.getMonth() + 1;
      let _year = d.getFullYear();
      let _hour = d.getHours();
      let _min = d.getMinutes();
      if (_min < 10) {
        _min = "0" + _min;
      }
      return _year + "-" + _month + "-" + _day;
    };

    const onRowSelect = async (event) => {
      try {
        let customer = JSON.parse(sessionStorage.getItem("customer"));
        state.cartSelected = event.data;
        const payload = await fetcher(
          `cart/${state.cartSelected.id}/${customer.email}`
        );
        state.cartDetails = payload;
        state.dialogStatus = `details for cart ${state.cartSelected.id}`;
        state.selectedACart = true;
      } catch (err) {
        console.log(err);
        state.status = `Error has occured: ${err.message}`;
      }
    };
    return {
      state,
      formatDate,
      onRowSelect,
    };
  },
};
</script>