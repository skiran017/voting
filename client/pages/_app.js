import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Voting from '../contracts/Voting.json';
import { getWeb3 } from '../utils';
import '../styles/globals.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import CreateBallot from './_createBallot';
import AddVoters from './_addVoters';
import Votes from './_votes';

function MyApp() {
  const [web3, setWeb3] = useState(undefined);
  const [accounts, setAccounts] = useState(undefined);
  const [contract, setContract] = useState(undefined);
  const [admin, setAdmin] = useState(undefined);
  const [ballots, setBallots] = useState([]);

  useEffect(() => {
    init();
    window.ethereum.on('accountsChanged', (accounts) => {
      setAccounts(accounts);
    });
  }, []);

  async function init() {
    const web3 = await getWeb3();
    const accounts = await web3.eth.getAccounts();
    const networkId = await web3.eth.net.getId();
    const deployedNetwork = Voting.networks[networkId];
    const contract = new web3.eth.Contract(
      Voting.abi,
      deployedNetwork && deployedNetwork.address
    );
    const admin = await contract.methods.admin().call();

    setWeb3(web3);
    setAccounts(accounts);
    setContract(contract);
    setAdmin(admin);
  }
  const isReady = () => {
    return (
      typeof contract !== 'undefined' &&
      typeof web3 !== 'undefined' &&
      typeof accounts !== 'undefined' &&
      typeof admin !== 'undefined'
    );
  };

  useEffect(() => {
    if (isReady()) {
      updateBallots();
    }
  }, [accounts, contract, web3, admin]);

  async function updateBallots() {
    const nextBallotId = parseInt(await contract.methods.nextBallotId().call());

    const ballots = [];
    for (let i = 0; i < nextBallotId; i++) {
      const [ballot, hasVoted] = await Promise.all([
        contract.methods.getBallot(i).call(),
        contract.methods.votes(accounts[0], i).call(),
      ]);
      ballots.push({ ...ballot, hasVoted });
    }
    setBallots(ballots);
  }

  async function createBallot(e) {
    e.preventDefault();
    const name = e.target.elements[0].value;
    const choices = e.target.elements[1].value.split(',');
    const duration = e.target.elements[2].value;
    await contract.methods
      .createBallot(name, choices, duration)
      .send({ from: accounts[0] });
    await updateBallots();
  }

  async function addVoters(e) {
    e.preventDefault();
    const voters = e.target.elements[0].value.split(',');
    await contract.methods.addVoters(voters).send({ from: accounts[0] });
  }

  async function vote(e, ballotId) {
    e.preventDefault();
    const select = e.target.elements[0];
    const choiceId = select.options[select.selectedIndex].value;
    await contract.methods.vote(ballotId, choiceId).send({ from: accounts[0] });
    await updateBallots();
  }

  function isFinished(ballot) {
    const now = new Date().getTime();
    const ballotEnd = new Date(parseInt(ballot.end) * 1000).getTime();
    return ballotEnd - now > 0 ? false : true;
  }

  if (!isReady()) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Head>
        <title>Voting D-App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="container pt-5">
        <h1 className="text-center">Voting</h1>

        {accounts[0].toLowerCase() === admin.toLowerCase() ? (
          <>
            <CreateBallot handleCreateBallot={(e) => createBallot(e)} />
            <hr />
            <AddVoters handleAddVoters={(e) => addVoters(e)} />
            <hr />
          </>
        ) : null}

        <Votes handleVotes={vote} ballots={ballots} isFinished={isFinished} />
      </div>
    </>
  );
}

export default MyApp;
