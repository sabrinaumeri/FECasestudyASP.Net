<template>
  <div>
    <img class="product-image-cart" style="margin-top: 2vh" src="/mouse.png" />
    <div class="heading">Brands</div>
    <div class="status">{{ state.status }}</div>
    <Dropdown
      v-if="state.brands.length > 0"
      v-model="state.selectedBrand"
      style="text-align: left"
      :options="state.brands"
      optionLabel="name"
      optionValue="id"
      placeholder="Select Brand"
      @change="loadProductitems"
    />
    <div style="margin-top: 2vh" v-if="state.productitems.length > 0">
      <DataTable
        :value="state.productitems"
        :scrollable="true"
        scrollHeight="60vh"
        selectionMode="single"
        class="p-datatable-striped"
        @row-select="onRowSelect"
      >
        <Column style="margin-right: 0vw" >
          <template #body="slotProps">
            <img
              :src="`${slotProps.data.graphicName}`"
              :alt="slotProps.data.ProductName"
              class="product-image"
            />
          </template>
        </Column>
        <Column field="productName" header="Product Name"></Column>
      </DataTable>
      <Dialog v-model:visible="state.itemSelected" class="dialog-border">
        <div style="text-align: center">
          <div style="margin-bottom: 2vh; font-size: larger; fontweight: bold">
            <!-- {{ state.selectedItem.graphicName }} -->
          </div>

          <img
            :src="state.selectedItem.graphicName"
            :alt="state.selectedItem.productName"
            class="product-image2"
          />
        </div>
        <table>
          <br />
          <tr>
            <!-- <td style="width: 20%; font-weight: bold"></td> -->
            <td style="width: 10%; text-align: left; font-weight: bold">
              {{ state.selectedItem.productName }} -
              {{ formatCurrency(state.selectedItem.msrp) }}
            </td>
          </tr>
        </table>
        <br />
        <table>
          <tr>
            <td style="width: 10%; text-align: left; padding-right: 3vw">
              {{ state.selectedItem.description }}
            </td>
          </tr>
          <tr>
            <td colspan="4">&nbsp;</td>
          </tr>
        </table>
        <div style="margin-top: 2vh; text-align: center">
          <span style="margin-left: 0vw; margin-right: 2vw">Enter Qty:</span>
          <br />
          <span>
            <InputNumber
              id="qty"
              :min="0"
              v-model="state.qty"
              :step="1"
              incrementButtonClass="plus"
              showButtons
              buttonLayout="horizontal"
              decrementButtonIcon="pi pi-minus"
              incrementButtonIcon="pi pi-plus"
            />
          </span>
        </div>
        <div style="text-align: center; margin-top: 2vh">
          <Button
            label="Add To Cart"
            @click="addToCart"
            class="p-button-outlined margin-button1"
          />
          &nbsp;
          <Button
            label="View Cart"
            class="p-button-outlined margin-button1"
            v-if="state.cart.length > 0"
            @click="viewCart"
          />
        </div>

        <div
          style="text-align: center"
          v-if="state.dialogStatus !== ''"
          class="dialog-status"
        >
          {{ state.dialogStatus }}
        </div>
      </Dialog>
    </div>

    <!-- <DataTable
 v-if="state.productitems.length > 0"
 :value="state.productitems"
 :scrollable="true"
 scrollHeight="55vh"
 selectionMode="single"
 class="p-datatable-striped"
 >
 <Column field="description" header="Items"></Column>
 </DataTable> -->
  </div>
</template>
<script>
import { reactive, onMounted } from "vue";
import { fetcher } from "../util/apiutil";
import { useRouter } from "vue-router";
export default {
  setup() {
    const router = useRouter();
    onMounted(() => {
      loadBrands();
    });
    let state = reactive({
      status: "",
      brands: [],
      productitems: [],
      selectedBrand: {},
      selectedItem: {},
      dialogStatus: "",
      itemSelected: false,
      qty: 0,
      cart: [],
    });
    const loadBrands = async () => {
      try {
        state.status = "loading brands...";
        const payload = await fetcher(`Brand`);
        if (payload.error === undefined) {
          state.brands = payload;
          state.status = `loaded ${state.brands.length} brands`;
        } else {
          state.status = payload.error;
        }
      } catch (err) {
        console.log(err);
        state.status = `Error has occured: ${err.message}`;
      }
      if (sessionStorage.getItem("cart")) {
        state.cart = JSON.parse(sessionStorage.getItem("cart"));
      }
    };
    const loadProductitems = async () => {
      try {
        state.status = `finding productitems for category ${state.selectedBrand}...`;
        let payload = await fetcher(`Productitem/${state.selectedBrand}`);
        state.productitems = payload;
        state.status = `loaded ${state.productitems.length} product items`;
      } catch (err) {
        console.log(err);
        state.status = `Error has occured: ${err.message}`;
      }
    };
    const onRowSelect = (event) => {
      try {
        state.selectedItem = event.data;
        state.dialogStatus = "";
        state.itemSelected = true;
      } catch (err) {
        console.log(err);
        state.status = `Error has occured: ${err.message}`;
      }
    };

    const addToCart = () => {
      const index = state.cart.findIndex(
        // is item already on the cart
        (item) => item.id === state.selectedItem.id
      );
      if (state.qty !== 0) {
        index === -1 // add
          ? state.cart.push({
              id: state.selectedItem.id,
              qty: state.qty,
              item: state.selectedItem,
            })
          : (state.cart[index] = {
              // replace
              id: state.selectedItem.id,
              qty: state.qty,
              item: state.selectedItem,
            });
        state.dialogStatus = `${state.qty} item(s) added`;
      } else {
        index === -1 ? null : state.cart.splice(index, 1); // remove
        state.dialogStatus = `item(s) removed`;
      }
      sessionStorage.setItem("cart", JSON.stringify(state.cart));
      state.qty = 0;
    };

    const formatCurrency = (value) => {
      return value.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      });
    };
    const viewCart = () => {
      router.push("cart");
    };

    return {
      state,
      loadProductitems,
      onRowSelect,
      addToCart,
      formatCurrency,
      viewCart,
    };
  },
};
</script>