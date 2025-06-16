function analisarToken() {
  const tokenAddress = document.getElementById("tokenAddress").value.trim();
  const resultado = document.getElementById("resultado");

  if (!tokenAddress || !/^0x[a-fA-F0-9]{40}$/.test(tokenAddress)) {
    resultado.innerHTML = "<p style='color: red;'>⚠️ Endereço de token inválido.</p>";
    return;
  }

  // Análise simples - apenas para exemplo
  let score = 0;

  if (tokenAddress.startsWith("0x0")) {
    score -= 20;
  } else {
    score += 50;
  }

  if (tokenAddress.includes("dead")) {
    score -= 30;
  } else {
    score += 20;
  }

  if (score < 0) score = 0;
  if (score > 100) score = 100;

  let status;
  if (score >= 70) {
    status = "✅ Token parece confiável.";
  } else if (score >= 40) {
    status = "⚠️ Token regular, tome cuidado.";
  } else {
    status = "❌ Token de alto risco.";
  }

  resultado.innerHTML = `
    <p><strong>Score de Segurança:</strong> ${score}/100</p>
    <p>${status}</p>
  `;
}
