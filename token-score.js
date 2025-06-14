
async function analisarToken() {
  if (!window.ethereum) {
    alert("Conecte sua carteira para continuar.");
    return;
  }

  const tokenAddress = document.getElementById("tokenAddress").value.trim();
  const resultado = document.getElementById("resultado");
  resultado.innerHTML = "<p>🔍 Verificando acesso...</p>";

  try {
    const web3 = new Web3(window.ethereum);
    const user = (await web3.eth.getAccounts())[0];

    const TOKEN_CONTRATO = "0x5Cd853024A9CFD2e61070E92f2b8cE0F221Cd1B4";
    const ABI_ERC20 = [
      {
        constant: true,
        inputs: [{ name: "_owner", type: "address" }],
        name: "balanceOf",
        outputs: [{ name: "balance", type: "uint256" }],
        type: "function"
      }
    ];

    const contrato = new web3.eth.Contract(ABI_ERC20, TOKEN_CONTRATO);
    const saldo = await contrato.methods.balanceOf(user).call();

    if (parseInt(saldo) === 0) {
      resultado.innerHTML = "<p style='color:red;'>⚠️ Você precisa ter o token de acesso para usar esta função.</p>";
      return;
    }

    resultado.innerHTML = "<p>🔄 Analisando token...</p>";

    const res = await fetch(`https://api.gopluslabs.io/api/v1/token_security/1?contract_addresses=${tokenAddress}`);
    const data = await res.json();
    const info = data.result[tokenAddress];

    if (!info) {
      resultado.innerHTML = "<p style='color:red;'>Token não encontrado.</p>";
      return;
    }

    resultado.innerHTML = `
      <h3>Resultado</h3>
      <p><strong>Nome:</strong> ${info.token_name}</p>
      <p><strong>Símbolo:</strong> ${info.token_symbol}</p>
      <p><strong>Taxa de Compra:</strong> ${info.buy_tax}%</p>
      <p><strong>Taxa de Venda:</strong> ${info.sell_tax}%</p>
      <p><strong>Possível Honeypot:</strong> ${info.is_honeypot === "1" ? "⚠️ Sim" : "✅ Não"}</p>
    `;
  } catch (e) {
    console.error(e);
    resultado.innerHTML = "<p style='color:red;'>Erro ao processar.</p>";
  }
}
