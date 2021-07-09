<template>
<div>
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
 <div style="margin-top:2vh;" v-if="state.productitems.length > 0">
 <DataTable
 :value="state.productitems"
 :scrollable="true"
 scrollHeight="60vh"
 selectionMode="single"
 class="p-datatable-striped"
 >
 <Column style="margin-right:-35vw;">
 <template #body="slotProps" >
 <img
 :src="`${slotProps.data.graphicName}`"
 :alt="slotProps.data.productName"
 class="product-image"
 />
 </template>
 </Column>
 <Column field="description" header="Select an Item"></Column>
 </DataTable>
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
export default {
setup() {
onMounted(() => {
loadBrands();
});
let state = reactive({
status: "",
brands: [],
productitems: [],
selectedBrand: {},
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
return {
state,
loadProductitems,
};
}
}
</script>