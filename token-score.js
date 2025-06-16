async function analisarToken() {
  const tokenAddress = document.getElementById("tokenAddress").value.trim();
  const resultado = document.getElementById("resultado");
  resultado.innerHTML = "";

  if (!tokenAddress || !/^0x[a-fA-F0-9]{40}$/.test(tokenAddress)) {
    resultado.innerHTML = "<p style='color:red;'>❌ Endereço de token inválido.</p>";
    return;
  }

  try {
    if (typeof window.ethereum === "undefined") {
      resultado.innerHTML = "<p style='color:red;'>❌ MetaMask não detectado.</p>";
      return;
    }

    const web3 = new Web3(window.ethereum);
    const ERC20_ABI = [
      { "constant": true, "inputs": [], "name": "name", "outputs": [{ "name": "", "type": "string" }], "type": "function" },
      { "constant": true, "inputs": [], "name": "symbol", "outputs": [{ "name": "", "type": "string" }], "type": "function" },
      { "constant": true, "inputs": [], "name": "decimals", "outputs": [{ "name": "", "type": "uint8" }], "type": "function" },
      { "constant": true, "inputs": [], "name": "totalSupply", "outputs": [{ "name": "", "type": "uint256" }], "type": "function" }
    ];

    const token = new web3.eth.Contract(ERC20_ABI, tokenAddress);

    const [name, symbol, decimals, totalSupply] = await Promise.all([
      token.methods.name().call(),
      token.methods.symbol().call(),
      token.methods.decimals().call(),
      token.methods.totalSupply().call()
    ]);

    const supplyFormatted = parseFloat(totalSupply / (10 ** decimals)).toLocaleString('pt-BR');

    resultado.innerHTML = `
      <p><strong>✅ Token válido encontrado!</strong></p>
      <p><strong>Nome:</strong> ${name}</p>
      <p><strong>Símbolo:</strong> ${symbol}</p>
      <p><strong>Decimais:</strong> ${decimals}</p>
      <p><strong>Supply Total:</strong> ${supplyFormatted} ${symbol}</p>
    `;

  } catch (error) {
    console.error("Erro ao analisar token:", error);
    resultado.innerHTML = "<p style='color:orange;'>⚠️ Erro ao tentar ler informações do token. Ele pode ser inválido ou não seguir o padrão ERC20.</p>";
  }
}
