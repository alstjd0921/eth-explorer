const express = require('express');
const router = express.Router();
const Web3 = require('web3');

const getBlockNumber = async () => {
  const blockNumber = await web3.eth.getBlockNumber();
  return blockNumber;
};

const getBlockRange = async (pos, range = 5) => {
  let blocks = [];
  for (let i = 0; i < range; ++i) {
    let b = await web3.eth.getBlock(pos - i);
    blocks.push(b);
  }
  return blocks;
};

const getTansactions = async (blocks) => {
  let txs = await blocks.map((block) => block.transactions);
  return txs;
};

const merge = (multiArray) => {
  let cloneMultiArray = [...multiArray];
  let merged = [];
  for (let i = 0; i < multiArray.length; ++i) {
    merged = merged.concat(cloneMultiArray[i]);
  }

  return merged;
};

const getLatesTxDetailInfo = async (txs, range = 5) => {
  let txDetails = [];

  for (let i = 0; i < range; ++i) {
    if (txs[i]) {
      let tx = await web3.eth.getTransaction(txs[i]);
      txDetails.push(tx);
      if (!txs[i]) {
        break;
      }
    }
  }

  return txDetails;
};

getNetworkInfo = async function () {
  let maxCnt = 5;
  let latest_block_number = await getBlockNumber();
  let blocks = await getBlockRange(latest_block_number, maxCnt);
  let txs = await getTansactions(blocks);
  let latesTxDetailInfo = await getLatesTxDetailInfo(merge(txs), maxCnt);

  return {
    block: blocks[0],
    blocks: blocks,
    txs: latesTxDetailInfo,
  };
};

router.get('/', async function (req, res, next) {
  // web3 = web3Server.web3Ropsten;
  web3 = new Web3(
    new Web3.providers.HttpProvider(
      'https://ropsten.infura.io/v3/16275c322c5a47ad8fd125cc110ff860'
    )
  );
  let maxCnt = 5;

  let latest_block_number = await getBlockNumber();
  let blocks = await getBlockRange(latest_block_number, maxCnt);
  let txs = await getTansactions(blocks);
  let latesTxDetailInfo = await getLatesTxDetailInfo(merge(txs), maxCnt);

  return res.render('index', {
    block: blocks[0],
    blocks: blocks,
    txs: latesTxDetailInfo,
  });
});

router.post('/', async function (req, res, next) {
  let { address } = req.body;
  web3 = new Web3(
    new Web3.providers.HttpProvider(
      'https://ropsten.infura.io/v3/16275c322c5a47ad8fd125cc110ff860'
    )
  );
  await web3.eth.getBlockNumber(function (err, rtn) {
    if (
      address.length === 0 ||
      (address > rtn && address.length !== 42 && address.length !== 66)
    ) {
      return res.render('error');
    } else if (address <= rtn) {
      return res.redirect(`/block/${address}`);
    } else if (address.length === 42) {
      let ckAddr = web3.utils.isAddress(address);
      if (ckAddr === false) {
        return res.redirect(`/error`);
      } else {
        return res.redirect(`/address/${address}`);
      }
    } else if (address.length === 66) {
      return res.redirect(`/tx/${address}`);
    }
  });
});

module.exports = router;
