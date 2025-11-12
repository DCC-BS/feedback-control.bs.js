<script lang="ts" setup>
import {
    PopoverClose,
    PopoverContent,
    PopoverPortal,
    PopoverRoot,
    PopoverTrigger,
} from "reka-ui";
import { ref } from "vue";

interface InputProps {
    defaultMail?: string;
}

const props = withDefaults(defineProps<InputProps>(), {
    defaultMail: "",
});

const feedbackText = ref("");
const selectedRating = ref("");
const emailAddress = ref(props.defaultMail);
const isSubmitting = ref(false);
const isSubmitted = ref(false);
const errorMessage = ref("");

const ratings = [
    { emoji: "😕", label: "Schlecht", value: "poor" },
    { emoji: "😐", label: "Okay", value: "okay" },
    { emoji: "🙂", label: "Gut", value: "good" },
    { emoji: "😀", label: "Sehr gut", value: "great" },
    { emoji: "🤩", label: "Ausgezeichnet", value: "excellent" },
];

const submitFeedback = async () => {
    // Clear any previous error
    errorMessage.value = "";

    if (!feedbackText.value.trim() || !emailAddress.value.trim()) {
        errorMessage.value = "Bitte Textfeld und Mailadresse ausfüllen.";
        return;
    }

    isSubmitting.value = true;

    try {
        await $fetch("/api/feedback", {
            method: "POST",
            body: {
                rating: selectedRating.value,
                message: feedbackText.value.trim(),
                email: emailAddress.value.trim(),
            },
            headers: {
                "Content-Type": "application/json",
            },
        });

        isSubmitting.value = false;
        isSubmitted.value = true;

        // Reset after a few seconds
        setTimeout(() => {
            feedbackText.value = "";
            selectedRating.value = "";
            emailAddress.value = "";
            isSubmitted.value = false;
        }, 3000);
    } catch (error) {
        isSubmitting.value = false;
        errorMessage.value =
            "Feedback konnte nicht gesendet werden. Bitte versuche es später erneut.";
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
                            <label for="feedback-email">E-Mail</label>
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
:root {
    --feedback-bg: white;
    --feedback-text: #111827;
    --feedback-text-secondary: #4b5563;
    --feedback-border: #e5e7eb;
    --feedback-primary: #3b82f6;
    --feedback-primary-hover: #2563eb;
    --feedback-shadow: rgba(0, 0, 0, 0.15);
    --feedback-success: #10b981;
    --feedback-error: #ef4444;
}

@media (prefers-color-scheme: dark) {
    :root {
        --feedback-bg: #1f2937;
        --feedback-text: #f3f4f6;
        --feedback-text-secondary: #d1d5db;
        --feedback-border: #374151;
        --feedback-primary: #3b82f6;
        --feedback-primary-hover: #60a5fa;
        --feedback-shadow: rgba(0, 0, 0, 0.4);
        --feedback-success: #34d399;
        --feedback-error: #f87171;
    }
}

.feedback-wrapper {
    position: fixed;
    bottom: 1rem;
    right: 1rem;
    z-index: 9999;
}

.feedback-trigger {
    border-radius: 8px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 10px 16px;
    background-color: var(--feedback-primary);
    color: white;
    font-weight: 600;
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
    cursor: pointer;
    transition: all 0.2s ease;
    gap: 8px;
    border: none;
}

.feedback-trigger:hover {
    background-color: var(--feedback-primary-hover);
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(59, 130, 246, 0.4);
}

.feedback-trigger:focus {
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.4);
    outline: none;
}

.feedback-icon {
    flex-shrink: 0;
}

.feedback-content {
    padding: 1.5rem;
    background-color: var(--feedback-bg);
    border-radius: 12px;
    box-shadow: 0 10px 25px var(--feedback-shadow);
    border: none;
    width: 360px;
    animation: popup 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    color: var(--feedback-text);
}

.feedback-container {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
}

.feedback-title {
    font-size: 1.125rem;
    font-weight: 700;
    color: var(--feedback-text);
    margin: 0;
}

.feedback-rating {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

.feedback-label {
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--feedback-text-secondary);
    margin: 0;
}

.rating-options {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 8px;
}

.rating-option {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    padding: 8px 4px;
    border-radius: 8px;
    border: 1px solid var(--feedback-border);
    background: transparent;
    cursor: pointer;
    transition: all 0.2s ease;
}

.rating-option:hover {
    background-color: rgba(59, 130, 246, 0.1);
}

.rating-option.selected {
    border-color: var(--feedback-primary);
    background-color: rgba(59, 130, 246, 0.15);
}

.rating-emoji {
    font-size: 1.25rem;
    line-height: 1;
}

.rating-label {
    font-size: 0.75rem;
    text-wrap-mode: nowrap;
    color: var(--feedback-text-secondary);
}

.feedback-input-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.feedback-input-group label {
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--feedback-text-secondary);
}

.feedback-container textarea {
    border: 1px solid var(--feedback-border);
    border-radius: 6px;
    padding: 12px;
    min-height: 100px;
    resize: vertical;
    font-family: inherit;
    font-size: 0.875rem;
    transition: all 0.2s ease;
    background-color: var(--feedback-bg);
    color: var(--feedback-text);
}

.feedback-email-input {
    border: 1px solid var(--feedback-border);
    border-radius: 6px;
    padding: 10px 12px;
    font-family: inherit;
    font-size: 0.875rem;
    transition: all 0.2s ease;
    background-color: var(--feedback-bg);
    color: var(--feedback-text);
}

.feedback-email-input:focus,
.feedback-container textarea:focus {
    border-color: var(--feedback-primary);
    outline: none;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
}

.feedback-container textarea::placeholder,
.feedback-email-input::placeholder {
    color: #9ca3af;
}

.feedback-input-help {
    font-size: 0.75rem;
    color: var(--feedback-text-secondary);
    margin-top: 4px;
    display: inline-block;
}

.feedback-submit {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 10px 16px;
    background-color: var(--feedback-primary);
    color: white;
    font-weight: 600;
    border-radius: 6px;
    border: none;
    cursor: pointer;
    transition: all 0.2s ease;
    margin-left: auto;
}

.feedback-submit:hover:not(:disabled) {
    background-color: var(--feedback-primary-hover);
}

.feedback-submit:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.4);
}

.feedback-submit:disabled {
    opacity: 0.7;
    cursor: not-allowed;
}

.feedback-error {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px;
    background-color: rgba(239, 68, 68, 0.1);
    border: 1px solid var(--feedback-error);
    border-radius: 6px;
    color: var(--feedback-error);
    font-size: 0.875rem;
    animation: shake 0.5s ease-in-out;
}

.feedback-error svg {
    flex-shrink: 0;
}

@keyframes shake {

    0%,
    100% {
        transform: translateX(0);
    }

    25% {
        transform: translateX(-4px);
    }

    75% {
        transform: translateX(4px);
    }
}

.spinner {
    animation: spin 1s linear infinite;
    width: 16px;
    height: 16px;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

.feedback-close {
    border-radius: 9999px;
    height: 28px;
    width: 28px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: 10px;
    right: 10px;
    background-color: rgba(156, 163, 175, 0.1);
    color: var(--feedback-text-secondary);
    font-size: 18px;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.2s ease;
    border: none;
}

.feedback-close:hover {
    background-color: rgba(156, 163, 175, 0.2);
    color: var(--feedback-text);
}

.feedback-close:focus {
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.4);
    outline: none;
}

.feedback-success {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    min-height: 200px;
    gap: 1rem;
}

.success-icon {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    background-color: var(--feedback-success);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2rem;
    font-weight: bold;
    animation: success-bounce 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.feedback-success h3 {
    font-size: 1.125rem;
    color: var(--feedback-text);
    margin: 0;
}

.feedback-success p {
    color: var(--feedback-text-secondary);
    font-size: 0.875rem;
    margin: 0;
}

@keyframes popup {
    from {
        opacity: 0;
        transform: scale(0.95) translateY(10px);
    }

    to {
        opacity: 1;
        transform: scale(1) translateY(0);
    }
}

@keyframes success-bounce {
    0% {
        transform: scale(0);
    }

    50% {
        transform: scale(1.1);
    }

    100% {
        transform: scale(1);
    }
}
</style>