if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('./service-worker.js')
      .then(function(reg) {
        console.log('✅ Service Worker registrado com sucesso em:', reg.scope);
      })
      .catch(function(error) {
        console.log('❌ Falha ao registrar o Service Worker:', error);
      });
  });
}
