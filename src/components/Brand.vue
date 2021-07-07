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
/>
</div>
</template>
<script>
import { reactive, onMounted } from "vue";
export default {
setup() {
onMounted(() => {
loadBrands();
});
let state = reactive({
status: "",
brands: [],
selectedBrand: {},
});
const loadBrands = async () => {
let url ="https://localhost:44352/api/Brand";
try {
state.status = "finding brands ..."
let response = await fetch(`${url}`);
state.brands = await response.json();
state.status = `loaded ${state.brands.length} brands`;
} catch (err) {
console.log(err);
state.status = `Error has occured: ${err.message}`;
}
};
return {
state,
};
}
}
</script>