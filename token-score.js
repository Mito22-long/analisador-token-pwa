async function analisarToken() {
  const tokenAddress = document.getElementById("tokenAddress").value.trim();
  const resultado = document.getElementById("resultado");
  resultado.innerHTML = "";

  if (!tokenAddress || !/^0x[a-fA-F0-9]{40}$/.test(tokenAddress)) {
    resultado.innerHTML = "<p class='error'>❌ Endereço de token inválido.</p>";
    return;
  }

  if (typeof window.ethereum === "undefined") {
    resultado.innerHTML = "<p class='error'>❌ MetaMask não detectado.</p>";
    return;
  }

  try {
    const web3 = new Web3(window.ethereum);
    const ERC20_ABI = [
      { "constant": true, "inputs": [], "name": "name", "outputs": [{ "name": "", "type": "string" }], "type": "function" },
      { "constant": true, "inputs": [], "name": "symbol", "outputs": [{ "name": "", "type": "string" }], "type": "function" },
      { "constant": true, "inputs": [], "name": "decimals", "outputs": [{ "name": "", "type": "uint8" }], "type": "function" },
      { "constant": true, "inputs": [], "name": "totalSupply", "outputs": [{ "name": "", "type": "uint256" }], "type": "function" },
      { "constant": false, "inputs": [{ "name": "_to", "type": "address" }, { "name": "_value", "type": "uint256" }], "name": "transfer", "outputs": [{ "name": "", "type": "bool" }], "type": "function" }
    ];

    const contract = new web3.eth.Contract(ERC20_ABI, tokenAddress);

    const [name, symbol, decimals, totalSupply] = await Promise.all([
      contract.methods.name().call(),
      contract.methods.symbol().call(),
      contract.methods.decimals().call(),
      contract.methods.totalSupply().call()
    ]);

    const supplyFormatted = parseFloat(totalSupply / (10 ** decimals)).toLocaleString('pt-BR');

    // Verificação de honeypot (simula uma transferência)
    let honeypotCheck = "";
    try {
      await contract.methods.transfer("0x000000000000000000000000000000000000dEaD", 1).call();
      honeypotCheck = "<p class='success'>✅ Token permite transferência: NÃO parece honeypot.</p>";
    } catch (e) {
      honeypotCheck = "<p class='warning'>⚠️ Atenção: Token pode bloquear transferências (Possível Honeypot).</p>";
    }

    resultado.innerHTML = `
      <p class="success"><strong>✅ Token válido detectado:</strong></p>
      <p><strong>Nome:</strong> ${name}</p>
      <p><strong>Símbolo:</strong> ${symbol}</p>
      <p><strong>Decimais:</strong> ${decimals}</p>
      <p><strong>Total Supply:</strong> ${supplyFormatted} ${symbol}</p>
      ${honeypotCheck}
    `;

  } catch (err) {
    console.error(err);
    resultado.innerHTML = "<p class='error'>❌ Erro ao analisar o token. Pode ser um contrato inválido ou fora do padrão ERC20.</p>";
  }
}
