<!-- components/slides/NameEmailSlide.vue -->
<template>
  <div>
    <h2 class="text-2xl font-bold mb-4">Personal Information</h2>
    <Form @submit="onSubmit" :validation-schema="schema">
      <div class="mb-4">
        <label for="name" class="block text-sm font-medium text-gray-700"
          >Name</label
        >
        <Field
          name="name"
          type="text"
          id="name"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
        <ErrorMessage name="name" class="text-red-500 text-sm" />
      </div>
      <div class="mb-4">
        <label for="email" class="block text-sm font-medium text-gray-700"
          >Email</label
        >
        <Field
          name="email"
          type="email"
          id="email"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
        <ErrorMessage name="email" class="text-red-500 text-sm" />
      </div>
      <Button type="submit" label="Next" class="w-full" />
    </Form>
  </div>
</template>

<script setup>
import * as Yup from "yup";
const userStore = useUserStore();

const schema = Yup.object({
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
});

const emit = defineEmits(["next"]);

const onSubmit = (values) => {
  userStore.updateUserData(values);
  emit("next");
};
</script>
