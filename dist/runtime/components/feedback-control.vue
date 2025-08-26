<script setup>
import {
  PopoverClose,
  PopoverContent,
  PopoverPortal,
  PopoverRoot,
  PopoverTrigger
} from "reka-ui";
import { ref } from "vue";
const props = defineProps({
  defaultMail: { type: String, required: false, default: "" }
});
const feedbackText = ref("");
const selectedRating = ref("");
const emailAddress = ref(props.defaultMail);
const isSubmitting = ref(false);
const isSubmitted = ref(false);
const errorMessage = ref("");
const ratings = [
  { emoji: "\u{1F615}", label: "Schlecht", value: "poor" },
  { emoji: "\u{1F610}", label: "Okay", value: "okay" },
  { emoji: "\u{1F642}", label: "Gut", value: "good" },
  { emoji: "\u{1F600}", label: "Sehr gut", value: "great" },
  { emoji: "\u{1F929}", label: "Ausgezeichnet", value: "excellent" }
];
const submitFeedback = async () => {
  errorMessage.value = "";
  if (!feedbackText.value.trim() || !emailAddress.value.trim()) {
    errorMessage.value = "Bitte Textfeld und Mailadresse ausf\xFCllen.";
    return;
  }
  isSubmitting.value = true;
  try {
    await $fetch("/api/feedback", {
      method: "POST",
      body: {
        rating: selectedRating.value,
        message: feedbackText.value.trim(),
        email: emailAddress.value.trim()
      },
      headers: {
        "Content-Type": "application/json"
      }
    });
    isSubmitting.value = false;
    isSubmitted.value = true;
    setTimeout(() => {
      feedbackText.value = "";
      selectedRating.value = "";
      emailAddress.value = "";
      isSubmitted.value = false;
    }, 3e3);
  } catch (error) {
    isSubmitting.value = false;
    errorMessage.value = "Feedback konnte nicht gesendet werden. Bitte versuche es sp\xE4ter erneut.";
    console.error("Failed to submit feedback:", error);
  }
};
const resetForm = () => {
  feedbackText.value = "";
  selectedRating.value = "";
  emailAddress.value = "";
  isSubmitted.value = false;
  errorMessage.value = "";
};
</script>

<template>
    <div class="feedback-wrapper">
        <PopoverRoot>
            <PopoverTrigger class="feedback-trigger" aria-label="Feedback geben">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
                    class="feedback-icon">
                    <path
                        d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z"
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
                <span>Feedback</span>
            </PopoverTrigger>

            <PopoverPortal>
                <PopoverContent class="feedback-content" align="end" side="top" :side-offset="8">
                    <PopoverClose class="feedback-close" aria-label="Schließen" @click="resetForm">
                        <span>×</span>
                    </PopoverClose>

                    <div v-if="!isSubmitted" class="feedback-container">
                        <h3 class="feedback-title">Teile deine Gedanken</h3>

                        <div class="feedback-rating">
                            <p class="feedback-label">Wie würdest du deine Erfahrung bewerten?</p>
                            <div class="rating-options">
                                <button v-for="rating in ratings" :key="rating.value" type="button"
                                    class="rating-option" :class="{ 'selected': selectedRating === rating.value }"
                                    @click="selectedRating = rating.value" :aria-label="rating.label">
                                    <span class="rating-emoji">{{ rating.emoji }}</span>
                                    <span class="rating-label">{{ rating.label }}</span>
                                </button>
                            </div>
                        </div>

                        <div class="feedback-input-group">
                            <label for="feedback-text">Sag uns deine Meinung</label>
                            <textarea id="feedback-text" v-model="feedbackText"
                                placeholder="Dein Feedback hilft uns, besser zu werden..."></textarea>
                        </div>

                        <div class="feedback-input-group">
                            <label for="feedback-email">E-Mail (optional)</label>
                            <input type="email" id="feedback-email" v-model="emailAddress" placeholder="deine@email.de"
                                class="feedback-email-input" />
                            <small class="feedback-input-help">Damit wir dich erreichen können.</small>
                        </div>

                        <div v-if="errorMessage" class="feedback-error">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" />
                                <line x1="15" y1="9" x2="9" y2="15" stroke="currentColor" stroke-width="2" />
                                <line x1="9" y1="9" x2="15" y2="15" stroke="currentColor" stroke-width="2" />
                            </svg>
                            <span>{{ errorMessage }}</span>
                        </div>

                        <button class="feedback-submit" @click="submitFeedback" :disabled="isSubmitting">
                            <template v-if="isSubmitting">
                                <svg class="spinner" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="12" cy="12" r="10" stroke-width="4" stroke="currentColor"
                                        stroke-dasharray="30 60" />
                                </svg>
                                <span>Wird gesendet...</span>
                            </template>
                            <template v-else>
                                <span>Feedback senden</span>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13" stroke="currentColor"
                                        stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                            </template>
                        </button>
                    </div>

                    <div v-else class="feedback-success">
                        <div class="success-icon">✓</div>
                        <h3>Vielen Dank für dein Feedback!</h3>
                        <p>Wir schätzen deine Eingabe und werden sie nutzen, um unseren Service zu verbessern.</p>
                    </div>
                </PopoverContent>
            </PopoverPortal>
        </PopoverRoot>
    </div>
</template>

<style>
:root{--feedback-bg:#fff;--feedback-text:#111827;--feedback-text-secondary:#4b5563;--feedback-border:#e5e7eb;--feedback-primary:#3b82f6;--feedback-primary-hover:#2563eb;--feedback-shadow:rgba(0,0,0,.15);--feedback-success:#10b981;--feedback-error:#ef4444}@media (prefers-color-scheme:dark){:root{--feedback-bg:#1f2937;--feedback-text:#f3f4f6;--feedback-text-secondary:#d1d5db;--feedback-border:#374151;--feedback-primary:#3b82f6;--feedback-primary-hover:#60a5fa;--feedback-shadow:rgba(0,0,0,.4);--feedback-success:#34d399;--feedback-error:#f87171}}.feedback-wrapper{bottom:1rem;position:fixed;right:1rem;z-index:9999}.feedback-trigger{align-items:center;background-color:var(--feedback-primary);border:none;border-radius:8px;box-shadow:0 4px 12px rgba(59,130,246,.3);color:#fff;cursor:pointer;display:inline-flex;font-weight:600;gap:8px;justify-content:center;padding:10px 16px;transition:all .2s ease}.feedback-trigger:hover{background-color:var(--feedback-primary-hover);box-shadow:0 6px 16px rgba(59,130,246,.4);transform:translateY(-2px)}.feedback-trigger:focus{box-shadow:0 0 0 3px rgba(59,130,246,.4);outline:none}.feedback-icon{flex-shrink:0}.feedback-content{animation:popup .3s cubic-bezier(.16,1,.3,1);background-color:var(--feedback-bg);border:none;border-radius:12px;box-shadow:0 10px 25px var(--feedback-shadow);color:var(--feedback-text);padding:1.5rem;width:360px}.feedback-container{display:flex;flex-direction:column;gap:1.25rem}.feedback-title{color:var(--feedback-text);font-size:1.125rem;font-weight:700;margin:0}.feedback-rating{display:flex;flex-direction:column;gap:.75rem}.feedback-label{color:var(--feedback-text-secondary);font-size:.875rem;font-weight:500;margin:0}.rating-options{flex-wrap:wrap;gap:8px;justify-content:space-between}.rating-option,.rating-options{align-items:center;display:flex}.rating-option{background:transparent;border:1px solid var(--feedback-border);border-radius:8px;cursor:pointer;flex:1;flex-direction:column;gap:4px;padding:8px 4px;transition:all .2s ease}.rating-option:hover{background-color:rgba(59,130,246,.1)}.rating-option.selected{background-color:rgba(59,130,246,.15);border-color:var(--feedback-primary)}.rating-emoji{font-size:1.25rem;line-height:1}.rating-label{font-size:.75rem;text-wrap-mode:nowrap;color:var(--feedback-text-secondary)}.feedback-input-group{display:flex;flex-direction:column;gap:.5rem}.feedback-input-group label{color:var(--feedback-text-secondary);font-size:.875rem;font-weight:500}.feedback-container textarea{min-height:100px;padding:12px;resize:vertical}.feedback-container textarea,.feedback-email-input{background-color:var(--feedback-bg);border:1px solid var(--feedback-border);border-radius:6px;color:var(--feedback-text);font-family:inherit;font-size:.875rem;transition:all .2s ease}.feedback-email-input{padding:10px 12px}.feedback-container textarea:focus,.feedback-email-input:focus{border-color:var(--feedback-primary);box-shadow:0 0 0 2px rgba(59,130,246,.2);outline:none}.feedback-container textarea::-moz-placeholder,.feedback-email-input::-moz-placeholder{color:#9ca3af}.feedback-container textarea::placeholder,.feedback-email-input::placeholder{color:#9ca3af}.feedback-input-help{color:var(--feedback-text-secondary);display:inline-block;font-size:.75rem;margin-top:4px}.feedback-submit{align-items:center;background-color:var(--feedback-primary);border:none;border-radius:6px;color:#fff;cursor:pointer;display:inline-flex;font-weight:600;gap:6px;justify-content:center;margin-left:auto;padding:10px 16px;transition:all .2s ease}.feedback-submit:hover:not(:disabled){background-color:var(--feedback-primary-hover)}.feedback-submit:focus{box-shadow:0 0 0 3px rgba(59,130,246,.4);outline:none}.feedback-submit:disabled{cursor:not-allowed;opacity:.7}.feedback-error{align-items:center;animation:shake .5s ease-in-out;background-color:rgba(239,68,68,.1);border:1px solid var(--feedback-error);border-radius:6px;color:var(--feedback-error);display:flex;font-size:.875rem;gap:8px;padding:12px}.feedback-error svg{flex-shrink:0}@keyframes shake{0%,to{transform:translateX(0)}25%{transform:translateX(-4px)}75%{transform:translateX(4px)}}.spinner{animation:spin 1s linear infinite;height:16px;width:16px}@keyframes spin{to{transform:rotate(1turn)}}.feedback-close{align-items:center;background-color:rgba(156,163,175,.1);border:none;border-radius:9999px;color:var(--feedback-text-secondary);cursor:pointer;display:inline-flex;font-size:18px;font-weight:700;height:28px;justify-content:center;position:absolute;right:10px;top:10px;transition:all .2s ease;width:28px}.feedback-close:hover{background-color:rgba(156,163,175,.2);color:var(--feedback-text)}.feedback-close:focus{box-shadow:0 0 0 2px rgba(59,130,246,.4);outline:none}.feedback-success{flex-direction:column;gap:1rem;min-height:200px;text-align:center}.feedback-success,.success-icon{align-items:center;display:flex;justify-content:center}.success-icon{animation:success-bounce .5s cubic-bezier(.175,.885,.32,1.275);background-color:var(--feedback-success);border-radius:50%;color:#fff;font-size:2rem;font-weight:700;height:64px;width:64px}.feedback-success h3{color:var(--feedback-text);font-size:1.125rem;margin:0}.feedback-success p{color:var(--feedback-text-secondary);font-size:.875rem;margin:0}@keyframes popup{0%{opacity:0;transform:scale(.95) translateY(10px)}to{opacity:1;transform:scale(1) translateY(0)}}@keyframes success-bounce{0%{transform:scale(0)}50%{transform:scale(1.1)}to{transform:scale(1)}}
</style>
