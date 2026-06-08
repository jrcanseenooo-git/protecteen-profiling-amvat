<template>
  <div class="step-progress-wrapper">
    <div class="step-progress-track">
      <div v-for="(step, i) in steps" :key="step.key" class="step-item">

        <!-- Step node -->
        <div class="step-node-wrap">
          <!-- Connector line before (except first) -->
          <div v-if="i > 0" class="step-connector"
               :class="getStatus(i) !== 'pending' ? 'done' : ''"></div>

          <!-- Circle -->
          <div class="step-circle" :class="getStatus(i)">
            <span v-if="getStatus(i) === 'done'" class="step-check">✓</span>
            <span v-else class="step-num">{{ i + 1 }}</span>
          </div>
        </div>

        <!-- Label below -->
        <div class="step-label" :class="getStatus(i)">
          {{ step.label }}
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  currentStep: { type: Number, required: true }, // 1-based active step index
  steps: {
    type: Array,
    default: () => [
      { key: 'profile',  label: 'Profile' },
      { key: 'housing',  label: 'Housing' },
      { key: 'health',   label: 'Health' },
      { key: 'social',   label: 'Social' },
      { key: 'family',   label: 'Family' },
    ]
  }
})

function getStatus(index) {
  const stepNum = index + 1
  if (stepNum < props.currentStep) return 'done'
  if (stepNum === props.currentStep) return 'active'
  return 'pending'
}
</script>

<style scoped>
.step-progress-wrapper {
  margin-bottom: 28px;
  padding: 0 4px;
}

.step-progress-track {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  position: relative;
}

/* Each step column */
.step-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  position: relative;
}

/* Node row: connector + circle */
.step-node-wrap {
  display: flex;
  align-items: center;
  width: 100%;
  justify-content: center;
  position: relative;
}

/* Connector line */
.step-connector {
  position: absolute;
  right: 50%;
  top: 50%;
  transform: translateY(-50%);
  width: 100%;
  height: 3px;
  background: #e0e0e0;
  border-radius: 2px;
  z-index: 0;
  transition: background 0.4s ease;
}
.step-connector.done { background: #059669; }

/* Circle */
.step-circle {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 13px;
  position: relative;
  z-index: 1;
  transition: all 0.3s ease;
  border: 3px solid #e0e0e0;
  background: #fff;
  color: #bbb;
}
.step-circle.done {
  background: #059669;
  border-color: #059669;
  color: #fff;
  box-shadow: 0 3px 10px rgba(5,150,105,0.25);
}
.step-circle.active {
  background: #7c3aed;
  border-color: #7c3aed;
  color: #fff;
  box-shadow: 0 3px 12px rgba(124,58,237,0.35);
  transform: scale(1.15);
}
.step-circle.pending {
  background: #fff;
  border-color: #e0e0e0;
  color: #bbb;
}

.step-check { font-size: 14px; }
.step-num   { font-size: 13px; }

/* Label */
.step-label {
  margin-top: 8px;
  font-size: 11px;
  font-weight: 600;
  text-align: center;
  white-space: nowrap;
  color: #bbb;
  transition: color 0.3s;
}
.step-label.done   { color: #059669; }
.step-label.active { color: #7c3aed; }
.step-label.pending{ color: #bbb; }

@media (max-width: 480px) {
  .step-label { font-size: 9px; }
  .step-circle { width: 28px; height: 28px; font-size: 11px; }
}
</style>
