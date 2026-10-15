export const SIDEBAR_KEY = "kms-sidebar";

/** Runs before paint (layout.tsx), so a collapsed sidebar never flashes open on load. */
export const SIDEBAR_SCRIPT = `try{if(localStorage.getItem('${SIDEBAR_KEY}')==='collapsed')document.documentElement.dataset.sidebar='collapsed'}catch(e){}`;
