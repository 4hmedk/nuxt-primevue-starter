<!-- components/slides/NameEmailSlide.vue -->
<template>
  <div>
    <h2 class="text-2xl mb-4">Just few steps away</h2>
    <Form
      @submit="onSubmit"
      :initial-values="initialValues"
      :validation-schema="schema"
      v-slot="{ errors }"
    >
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
        <div class="flex items-center">
          <Field
            name="terms"
            type="checkbox"
            v-slot="{ field }"
            :value="true"
            :unchecked-value="false"
          >
            <!-- primevue checkbox does not work with vee-validate -->
            <input
              type="checkbox"
              name="terms"
              v-bind="field"
              :value="true"
              class="w-4 h-4 text-primary-600 bg-surface-100 border-surface-300 rounded focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-surface-800 focus:ring-2 dark:bg-surface-700 dark:border-surface-600"
            />
          </Field>
          <label for="terms" class="ml-2 block text-sm">
            I agree to the
            <a href="#" class="text-blue-600 hover:underline"
              >Terms and Conditions</a
            >
          </label>
        </div>
        <small class="p-error">{{ errors.terms }}</small>
        <div class="w-full">
          <Button type="submit" label="Next" class="w-full mt-4" />
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
  terms: Yup.bool()
    .required("Please read and accept the terms and conditions")
    .oneOf([true], "Please read and accept the terms and conditions"),
});
const initialValues = {
  name: user.user_metadata.full_name,
  terms: true,
};
const emit = defineEmits(["next"]);

const onSubmit = async (values) => {
  console.log(values);
  emit("next", values);
};
</script>
