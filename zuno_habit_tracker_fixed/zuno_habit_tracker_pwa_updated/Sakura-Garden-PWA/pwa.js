// Sakura Garden PWA setup and install button.
(() => {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./service-worker.js', { scope: './' })
        .catch(error => console.error('Service worker registration failed:', error));
    });
  }

  let installPrompt = null;
  const installButton = document.getElementById('installAppButton');

  window.addEventListener('beforeinstallprompt', event => {
    // Keep the browser's install prompt until the visitor taps our button.
    event.preventDefault();
    installPrompt = event;
    if (installButton) installButton.hidden = false;
  });

  if (installButton) {
    installButton.addEventListener('click', async () => {
      if (!installPrompt) return;
      installPrompt.prompt();
      await installPrompt.userChoice;
      installPrompt = null;
      installButton.hidden = true;
    });
  }

  window.addEventListener('appinstalled', () => {
    if (installButton) installButton.hidden = true;
    installPrompt = null;
  });
})();
