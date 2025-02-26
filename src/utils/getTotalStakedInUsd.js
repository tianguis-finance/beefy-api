const BigNumber = require('bignumber.js');
const { bscWeb3: web3, web3Factory } = require('./web3');

const ERC20 = require('../abis/ERC20.json');
const fetchPrice = require('./fetchPrice');
const { lpTokenPrice } = require('./lpTokens');

const getTotalStakedInUsd = async (
  targetAddr,
  tokenAddr,
  oracle,
  oracleId,
  decimals = '1e18',
  chainId = 56
) => {
  const web3 = web3Factory(chainId);

  const tokenContract = new web3.eth.Contract(ERC20, tokenAddr);
  const totalStaked = new BigNumber(await tokenContract.methods.balanceOf(targetAddr).call());
  const tokenPrice = await fetchPrice({ oracle, id: oracleId });

  if (tokenAddr.toString() == '0xa36c4c7d11732681e58cbb7b8716acb8871ec4c3') {
    console.log('get total staked in usd', tokenAddr, targetAddr, totalStaked.toString());
  }
  return totalStaked.times(tokenPrice).dividedBy(decimals);
};

const getTotalLpStakedInUsd = async (targetAddr, pool, chainId = 56) => {
  return await getTotalStakedInUsd(targetAddr, pool.address, 'lps', pool.name, '1e18', chainId);
};

module.exports = { getTotalStakedInUsd, getTotalLpStakedInUsd };
