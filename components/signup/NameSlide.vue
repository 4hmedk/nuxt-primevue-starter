<!-- components/slides/NameEmailSlide.vue -->
<template>
  <div>
    <h2 class="text-2xl mb-4">Just some details</h2>
    <Form @submit="onSubmit" :validation-schema="schema" v-slot="{ errors }">
      <div class="space-y-4">
        <div>
          <label for="name" class="block text-sm font-medium">Name</label>
          <Field name="name" v-slot="{ field }">
            <InputText
              v-bind="field"
              id="name"
              class="mt-1 block w-full"
              :invalid="errors.name"
            />
          </Field>
          <small class="text-red-500">{{ errors.name }}</small>
        </div>
        <div>
          <label for="email" class="block text-sm font-medium">Email</label>
          <InputText
            id="email"
            class="mt-1 block w-full"
            v-model="user.email"
            :readonly="true"
            :disabled="true"
          />
        </div>
        <div class="w-full">
          <Button type="submit" label="Submit" class="w-full mt-4" />
        </div>
      </div>
    </Form>
  </div>
</template>

<script setup>
import * as Yup from "yup";
import InputText from "primevue/inputtext";
const userStore = useUserStore();
const user = await userStore.getUserData();

const schema = Yup.object({
  name: Yup.string().required("Name is required"),
  // email: Yup.string().email("Invalid email").required("Email is required"),
});

const emit = defineEmits(["next"]);

const onSubmit = async (values) => {
  console.log(values);
  await userStore.updateUserData({ tags: values });
  emit("next");
};
</script>
