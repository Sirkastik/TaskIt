<template>
  <div class="loader">
    <FingerprintSpinner
      :animation-duration="1500"
      :size="100"
      :color="'#2f2e41'"
    />
  </div>
</template>

<script>
import FingerprintSpinner from "epic-spinners/src/components/lib/FingerprintSpinner";
export default {
  name: "Loader",
  components: {
    FingerprintSpinner,
  },
};
</script>
