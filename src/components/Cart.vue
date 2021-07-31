<template>
  <div class="container">
    <img class="product-image-cart" style="margin-top: 2vh" src="/cart.png" />
    <div class="heading">Cart Contents</div>
    <div class="status">{{ state.status }}</div>
    <div v-if="state.cart.length > 0" id="cart">
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

    <div v-if="state.cart.length > 0">
      <div class="cart-head"></div>
      <Button
        style="margin-top: 2vh"
        label="Save Cart"
        @click="saveCart"
        class="p-button-outlined margin-button1"
      />
      <Button
        style="margin-top: 2vh"
        label="Empty Cart"
        @click="clearCart"
        class="p-button-outlined margin-button1"
      />
    </div>
  </div>
</template>
<script>
import { reactive, onMounted } from "vue";
import { useRouter } from "vue-router";
import { poster } from "../util/apiutil";
export default {
  setup() {
    // const router = useRouter();
    let state = reactive({
      status: "",
      Name: 0,
      Extended: 0,
      Qty: 0,
      Price: 0,
      subTot: 0,
      taxTot: 0,
      total: 0,
      cart: [],
    });

    onMounted(() => {
      if (sessionStorage.getItem("cart")) {
        state.cart = JSON.parse(sessionStorage.getItem("cart"));
        state.cart.map((cartItem) => {
          state.Name += cartItem.item.Name * cartItem.qty;
          state.Qty += cartItem.item.Qty * cartItem.qty;
          state.subTot += cartItem.item.msrp * cartItem.qty;
          state.taxTot = state.subTot * 0.13;
          state.total = state.subTot + state.taxTot;
        });
      } else {
        state.cart = [];
      }
    });

    const clearCart = () => {
      sessionStorage.removeItem("cart");
      state.cart = [];
      state.status = "cart cleared";
    };

    const saveCart = async () => {
      let customer = JSON.parse(sessionStorage.getItem("customer"));
      let cart = JSON.parse(sessionStorage.getItem("cart"));
      try {
        state.status = "sending cart info to server";
        let orderHelper = { email: customer.email, selections: cart };
        let payload = await poster("order", orderHelper);
        if (payload.indexOf("not") > 0) {
          state.status = payload;
        } else {
          clearCart();
          state.status = payload;
        }
      } catch (err) {
        console.log(err);
        state.status = `Error add order: ${err}`;
      }
    };

    const formatCurrency = (value) => {
      console.log("extended: ", value);
      return value.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      });
    };

    return {
      state,
      clearCart,
      formatCurrency,
      saveCart,
    };
  },
};
</script>
<style>
#cartcontents th:nth-child(2) {
  margin-left: 45vw;
}
</style>