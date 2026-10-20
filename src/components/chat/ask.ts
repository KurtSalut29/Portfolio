/** Opens the "Ask" overlay from anywhere (sidebar, mobile button, keyboard shortcut). */
export const ASK_EVENT = "kms-ask-open";

export function openAsk() {
  window.dispatchEvent(new Event(ASK_EVENT));
}
