<!-- components/slides/NameEmailSlide.vue -->
<template>
  <div>
    <h2 class="text-2xl mb-4">Confirm your phone number</h2>
    <div class="space-y-4">
      <Form
        v-if="!phoneVerified"
        @submit="verifyPhone"
        :validation-schema="phoneSchema"
        v-slot="{ errors }"
      >
        <div>
          <label for="phone" class="block text-sm font-medium"
            >Phone Number</label
          >
          <Field name="phone" v-slot="{ field }">
            <InputText
              v-bind="field"
              id="phone"
              class="mt-1 block w-full"
              :class="{ 'p-invalid': errors.phone }"
              placeholder="+1234567890"
            />
          </Field>
          <small class="p-error">{{ errors.phone }}</small>
        </div>
        <Button type="submit" label="Send OTP" class="w-full mt-4" />
      </Form>

      <Form
        v-else
        @submit="verifyOTP"
        :validation-schema="otpSchema"
        v-slot="{ errors }"
      >
        <div>
          <label for="otp" class="block text-sm font-medium"
            >One-Time Password</label
          >
          <Field name="otp" v-slot="{ field }">
            <InputOtp
              id="otp"
              class="mt-1 block w-full"
              v-bind="field"
              :invalid="errors.otp"
              integerOnly
              :length="6"
            />
          </Field>
          <small class="p-error">{{ errors.otp }}</small>
        </div>
        <Button type="submit" label="Verify OTP" class="w-full mt-4" />
      </Form>
    </div>
  </div>
</template>

<script setup>
import * as Yup from "yup";
import InputText from "primevue/inputtext";
const userStore = useUserStore();
const user = await userStore.getUserData();
const toast = useToast();

const phoneVerified = ref(false);
const phonenumber = ref(null);

const phoneSchema = Yup.object({
  phone: Yup.string()
    .required("Phone number is required")
    .matches(/^\+?[1-9]\d{1,14}$/, "Please enter a valid phone number"),
});

const otpSchema = Yup.object({
  otp: Yup.string().required("OTP is required"),
  // .matches(/^[0-9]{6}$/, "OTP must be 6 digits"),
});

const verifyPhone = (values) => {
  console.log("Sending OTP to:", values.phone);
  // Here you would typically make an API call to send the OTP
  // For this example, we'll just simulate it
  phoneVerified.value = true;
  phonenumber.value = values.phone;

  toast.add({
    severity: "info",
    summary: "OTP sent",
    detail: `OTP has been sent to ${values.phone}`,
    life: 3000,
  });
};
const emit = defineEmits(["next"]);

const verifyOTP = async (values) => {
  console.log("Verifying OTP:", values.otp);
  // Here you would typically make an API call to verify the OTP
  // For this example, we'll just simulate a successful verification
  toast.add({
    severity: "success",
    summary: "OTP verified",
    detail: `Your phone number has been verified.`,
    life: 3000,
  });

  emit("next", { phone: phonenumber.value });
};
</script>
